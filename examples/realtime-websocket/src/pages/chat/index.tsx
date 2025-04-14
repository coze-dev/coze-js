/* eslint-disable */
import { useRef, useState, useEffect } from 'react';
import { Button, message, Select, Modal, Layout, Row, Col, Card } from 'antd';
import getConfig from '../../utils/config';
import {
  WsChatClient,
  WsChatEventNames,
  WsToolsUtils,
} from '@coze/api/ws-tools';
import SendMessage from './send-message';
import ReceiveMessage from './receive-message';
import { ConversationAudioTranscriptUpdateEvent } from '@coze/api';
import Operation from './operation';
import { AudioConfig, AudioConfigRef } from '../../components/audio-config';
import { ConsoleLog } from '../../components/console-log';
import EventInput from './event-input';
import Settings from '../../components/settings';
import { AudioOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
const { Paragraph } = Typography;
const localStorageKey = 'realtime-quickstart-ws';
const config = getConfig(localStorageKey);

const chatUpdate = {
  data: {
    input_audio: {
      format: 'pcm',
      codec: 'pcm',
      sample_rate: 44100,
    },
    output_audio: {
      codec: 'pcm',
      pcm_config: {
        sample_rate: 24000,
      },
      voice_id: config.getVoiceId(),
    },
    turn_detection: {
      type: 'server_vad',
    },
    need_play_prologue: true,
  },
};
function Chat() {
  const clientRef = useRef<WsChatClient>();
  const audioConfigRef = useRef<AudioConfigRef>(null);
  // 是否正在连接
  const [isConnecting, setIsConnecting] = useState(false);
  // 是否已连接
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState('');

  const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedInputDevice, setSelectedInputDevice] = useState<string>('');

  // 添加控制弹窗显示的状态
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const isMobile = WsToolsUtils.isMobile();

  useEffect(() => {
    const getDevices = async () => {
      const devices = await WsToolsUtils.getAudioDevices();
      setInputDevices(devices.audioInputs);
      if (devices.audioInputs.length > 0) {
        setSelectedInputDevice(devices.audioInputs[0].deviceId);
      }
    };

    getDevices();
  }, []);

  async function initClient() {
    const permission = await WsToolsUtils.checkDevicePermission();
    if (!permission.audio) {
      throw new Error('需要麦克风访问权限');
    }

    if (!config.getPat()) {
      throw new Error('请先配置个人访问令牌 -> 右上角 Settings');
    }

    if (!config.getBotId()) {
      throw new Error('请先配置智能体ID -> 右上角 Settings');
    }

    const audioConfig = audioConfigRef.current?.getSettings();
    console.log('audioConfig', audioConfig);

    const client = new WsChatClient({
      token: config.getPat(),
      baseWsURL: config.getBaseWsUrl(),
      allowPersonalAccessTokenInBrowser: true,
      botId: config.getBotId(),
      debug: audioConfig?.debug,
      voiceId: config.getVoiceId(),
      workflowId: config.getWorkflowId() || undefined,
      // mediaStreamTrack: audioTrack,
      aiDenoisingConfig: !audioConfig?.noiseSuppression
        ? {
            mode: audioConfig?.denoiseMode,
            level: audioConfig?.denoiseLevel,
            assetsPath:
              'https://lf3-static.bytednsdoc.com/obj/eden-cn/613eh7lpqvhpeuloz/websocket',
          }
        : undefined,
      audioCaptureConfig: {
        echoCancellation: audioConfig?.echoCancellation,
        noiseSuppression: audioConfig?.noiseSuppression,
        autoGainControl: audioConfig?.autoGainControl,
      },
      wavRecordConfig: {
        enableSourceRecord: false,
        enableDenoiseRecord: false,
      },
      deviceId: selectedInputDevice || undefined,
      audioMutedDefault: audioConfig?.audioMutedDefault,
    });

    if (
      !audioConfig?.noiseSuppression &&
      !WsToolsUtils.checkDenoiserSupport()
    ) {
      message.info('当前浏览器不支持降噪');
    }

    clientRef.current = client;

    handleMessageEvent();
  }

  const handleMessageEvent = async () => {
    clientRef.current?.on(
      WsChatEventNames.CONVERSATION_AUDIO_TRANSCRIPT_UPDATE,
      (_: string, event: unknown) => {
        console.log('[chat] transcript update', event);
        setTranscript(
          (event as ConversationAudioTranscriptUpdateEvent).data.content,
        );
      },
    );
  };

  const handleConnect = async () => {
    try {
      if (!clientRef.current) {
        await initClient();
      }
      const chatUpdate = JSON.parse(localStorage.getItem('chatUpdate') || '{}');
      if (chatUpdate?.data?.output_audio?.voice_id === '') {
        delete chatUpdate.data.output_audio.voice_id;
      }
      await clientRef.current?.connect({ chatUpdate });
      setIsConnected(true);
    } catch (error) {
      console.error(error);
      message.error('连接错误：' + (error as Error).message);
    }
  };

  const handleSetAudioInputDevice = async (deviceId: string) => {
    try {
      await clientRef.current?.setAudioInputDevice(deviceId);
      setSelectedInputDevice(deviceId);
    } catch (error) {
      message.error('设置音频输入设备失败：' + error);
    }
  };

  // 添加设置变更处理函数
  const handleSettingsChange = () => {
    window.location.reload();
  };

  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, []);

  return (
    <Layout style={{ height: '100%' }}>
      <Settings
        onSettingsChange={handleSettingsChange}
        localStorageKey={localStorageKey}
        fields={['base_ws_url', 'bot_id', 'pat', 'voice_id', 'workflow_id']}
        className="settings-button"
      />
      <Layout.Content style={{ padding: '16px', background: '#fff' }}>
        <Row justify="center">
          <Col
            span={24}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px', // 添加按钮之间的间距
            }}
          >
            <Button size="large" onClick={() => setIsConfigModalOpen(true)}>
              配置
            </Button>
            {!isConnected && (
              <Button
                type="primary"
                size="large"
                icon={<AudioOutlined />}
                danger={isConnected}
                loading={isConnecting}
                disabled={isConnected || isConnecting}
                onClick={() => {
                  setIsConnecting(true);
                  handleConnect().finally(() => {
                    setIsConnecting(false);
                  });
                }}
              >
                开始对话
              </Button>
            )}
            {isConnected && (
              <Operation
                isConnected={isConnected}
                clientRef={clientRef}
                setIsConnected={setIsConnected}
                audioMutedDefault={
                  audioConfigRef.current?.getSettings()?.audioMutedDefault ??
                  false
                }
              />
            )}
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col
            span={24}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px', // 添加按钮之间的间距
            }}
          >
            <Select
              style={{ width: '200px' }}
              size="large"
              placeholder="选择输入设备"
              value={selectedInputDevice}
              onChange={handleSetAudioInputDevice}
            >
              {inputDevices.map(device => (
                <Select.Option key={device.deviceId} value={device.deviceId}>
                  {device.label || `麦克风 ${device.deviceId.slice(0, 8)}...`}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        <SendMessage isConnected={isConnected} clientRef={clientRef} />

        <Row style={{ margin: '16px 0' }}>
          <Col span={24} style={{ textAlign: 'left' }}>
            语音识别结果：{transcript}
          </Col>
        </Row>

        <ReceiveMessage clientRef={clientRef} />
        {isMobile && <ConsoleLog />}

        {/* 配置弹窗 */}
        <Modal
          title="音频配置"
          open={isConfigModalOpen}
          onCancel={() => setIsConfigModalOpen(false)}
          footer={null}
          destroyOnClose={false}
          forceRender
        >
          <AudioConfig clientRef={clientRef} ref={audioConfigRef} />
          <EventInput
            defaultValue={
              localStorage.getItem('chatUpdate') ||
              JSON.stringify(chatUpdate, null, 2)
            }
          />
        </Modal>
        <Card title="使用说明" style={{ marginTop: '20px' }}>
          <Paragraph>
            <ol>
              <li>确保授予浏览器麦克风访问权限</li>
              <li>在右上角 Settings 中配置个人访问令牌 (PAT) 和智能体 ID</li>
              <li>点击"开始对话"按钮建立与智能体的语音连接</li>
              <li>开始对话 - 您的语音将实时转录，智能体会自动回复</li>
              <li>您可以随时使用"打断对话"按钮中断智能体的回复</li>
              <li>使用"静音"按钮可以暂时关闭麦克风输入</li>
              <li>您也可以通过文本框发送文本消息与智能体交流</li>
              <li>完成后点击"断开连接"按钮结束会话</li>
            </ol>
          </Paragraph>
        </Card>
      </Layout.Content>
    </Layout>
  );
}

export default Chat;
