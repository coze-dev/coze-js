/* eslint-disable */
import { useRef, useState, useEffect } from 'react';
import { Button, message, Select, Modal, Layout, Row, Col } from 'antd';
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
import Header from '../../components/header/header';
import { ConsoleLog } from './console-log';
import EventInput from './event-input';
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

  return (
    <Layout style={{ background: '#fff' }}>
      <Header
        onSettingsChange={handleSettingsChange}
        localStorageKey={localStorageKey}
        title="WsChatClient"
      />
      <Layout.Content>
        <Row style={{ marginTop: '10px' }} justify="center">
          <Col
            span={24}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px', // 添加按钮之间的间距
            }}
          >
            <Button onClick={() => setIsConfigModalOpen(true)}>配置</Button>
            {!isConnected && (
              <Button
                danger
                disabled={isConnected || isConnecting}
                onClick={() => {
                  setIsConnecting(true);
                  handleConnect().finally(() => {
                    setIsConnecting(false);
                  });
                }}
              >
                连接
              </Button>
            )}
            {isConnected && (
              <Operation
                isConnected={isConnected}
                clientRef={clientRef}
                setIsConnected={setIsConnected}
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

        <Row style={{ margin: '16px' }}>
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
      </Layout.Content>
    </Layout>
  );
}

export default Chat;
