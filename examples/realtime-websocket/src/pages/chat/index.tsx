/* eslint-disable */
import { useRef, useState, useEffect } from 'react';
import './index.css';
import {
  Button,
  message,
  Select,
  Modal,
  Layout,
  Row,
  Col,
  Card,
  Typography,
} from 'antd';
import getConfig from '../../utils/config';
import {
  WsChatClient,
  WsChatEventNames,
  WsToolsUtils,
} from '@coze/api/ws-tools';
import SendMessage from './send-message';
import ReceiveMessage from './receive-message';
import {
  CommonErrorEvent,
  ConversationAudioTranscriptUpdateEvent,
} from '@coze/api';
import Operation from './operation';
import { AudioConfig, AudioConfigRef } from '../../components/audio-config';
import { ConsoleLog } from '../../components/console-log';
import EventInput from '../../components/event-input';
import Settings from '../../components/settings';
import { AudioOutlined } from '@ant-design/icons';
const { Paragraph, Text } = Typography;
const localStorageKey = 'realtime-quickstart-ws';
const config = getConfig(localStorageKey);

// Helper function to get chatUpdate config based on turn detection mode
const getChatUpdateConfig = (turnDetectionType: string) => ({
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
      type: turnDetectionType,
    },
    need_play_prologue: true,
  },
});
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

  // 按键说话状态
  const [isPressRecording, setIsPressRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordTimer = useRef<NodeJS.Timeout | null>(null);
  const maxRecordingTime = 60; // 最大录音时长（秒）
  const [isCancelRecording, setIsCancelRecording] = useState(false);
  const startTouchY = useRef<number>(0);
  const [isMuted, setIsMuted] = useState(false);
  const [turnDetectionType, setTurnDetectionType] = useState('server_vad');

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
      // 如果是按键说话模式，默认关闭麦克风
      audioMutedDefault: false,
    });

    if (
      !audioConfig?.noiseSuppression &&
      !WsToolsUtils.checkDenoiserSupport()
    ) {
      message.info('当前浏览器不支持AI降噪');
    }

    clientRef.current = client;

    handleMessageEvent();
  }

  const handleMessageEvent = async () => {
    clientRef.current?.on(
      WsChatEventNames.CONVERSATION_AUDIO_TRANSCRIPT_UPDATE,
      (_, data) => {
        const event = data as ConversationAudioTranscriptUpdateEvent;
        if (event.data.content) {
          setTranscript(event.data.content);
        }
      },
    );

    // 处理音频状态变化
    clientRef.current?.on(WsChatEventNames.AUDIO_MUTED, () => {
      console.log('麦克风已关闭');
      setIsMuted(true);
    });

    clientRef.current?.on(WsChatEventNames.AUDIO_UNMUTED, () => {
      console.log('麦克风已打开');
      setIsMuted(false);
    });
    clientRef.current?.on(
      WsChatEventNames.SERVER_ERROR,
      (_: string, event: unknown) => {
        console.log('[chat] error', event);
        message.error(
          '发生错误：' +
            (event as CommonErrorEvent)?.data?.msg +
            ' logid: ' +
            (event as CommonErrorEvent)?.detail.logid,
        );
      },
    );
  };

  const handleConnect = async () => {
    try {
      if (!clientRef.current) {
        await initClient();
      }
      const chatUpdate = config.getChatUpdate();
      if (chatUpdate?.data?.output_audio?.voice_id === '') {
        delete chatUpdate.data.output_audio.voice_id;
      }
      setTurnDetectionType(
        chatUpdate?.data?.turn_detection?.type || 'server_vad',
      );

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
  function handleSettingsChange() {
    console.log('Settings changed');
    // 重新读取对话模式
    window.location.reload(); // 简单处理：刷新页面应用新设置
  }

  // 处理按住说话按钮
  const handleVoiceButtonMouseDown = (
    e: React.MouseEvent | React.TouchEvent,
  ) => {
    if (
      isConnected &&
      clientRef.current &&
      turnDetectionType === 'client_interrupt'
    ) {
      startPressRecord(e);
    }
  };

  const handleVoiceButtonMouseUp = () => {
    if (isPressRecording && !isCancelRecording) {
      finishPressRecord();
    } else if (isPressRecording && isCancelRecording) {
      cancelPressRecord();
    }
  };

  const handleVoiceButtonMouseLeave = () => {
    if (isPressRecording) {
      cancelPressRecord();
    }
  };

  const handleVoiceButtonMouseMove = (
    e: React.MouseEvent | React.TouchEvent,
  ) => {
    if (isPressRecording && startTouchY.current) {
      // 上滑超过50px则取消发送
      const clientY =
        'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      if (clientY < startTouchY.current - 50) {
        setIsCancelRecording(true);
      } else {
        setIsCancelRecording(false);
      }
    }
  };

  // 开始按键录音
  const startPressRecord = async (e: React.MouseEvent | React.TouchEvent) => {
    if (isConnected && clientRef.current) {
      try {
        // 重置录音状态
        setIsPressRecording(true);
        setRecordingDuration(0);
        setIsCancelRecording(false);
        // Store initial touch position for determining sliding direction
        if ('clientY' in e) {
          startTouchY.current = (e as React.MouseEvent).clientY;
        } else if ('touches' in e && e.touches.length > 0) {
          startTouchY.current = e.touches[0].clientY;
        } else {
          startTouchY.current = 0;
        }

        // 开始录音
        await clientRef.current.startRecord();

        // 开始计时
        recordTimer.current = setInterval(() => {
          setRecordingDuration(prev => {
            const newDuration = prev + 1;
            // 超过最大录音时长自动结束
            if (newDuration >= maxRecordingTime) {
              finishPressRecord();
            }
            return newDuration;
          });
        }, 1000);
      } catch (error: any) {
        message.error(`开始录音错误: ${error.message || '未知错误'}`);
        console.error('开始录音错误:', error);
        // Clean up timer if it was set
        if (recordTimer.current) {
          clearInterval(recordTimer.current);
          recordTimer.current = null;
        }
        // Reset recording state
        setIsPressRecording(false);
        setRecordingDuration(0);
      }
    }
  };

  // 结束按键录音并发送
  const finishPressRecord = () => {
    if (isPressRecording && clientRef.current) {
      try {
        // 停止计时
        if (recordTimer.current) {
          clearInterval(recordTimer.current);
          recordTimer.current = null;
        }

        // 如果录音时间太短（小于1秒），视为无效
        if (recordingDuration < 1) {
          cancelPressRecord();
          return;
        }

        // 停止录音并发送
        clientRef.current.stopRecord();
        setIsPressRecording(false);

        // 显示提示
        message.success(`发送了 ${recordingDuration} 秒的语音消息`);
      } catch (error: any) {
        message.error(`结束录音错误: ${error.message || '未知错误'}`);
        console.error('结束录音错误:', error);
      }
    }
  };

  // 取消按键录音
  const cancelPressRecord = async () => {
    if (isPressRecording && clientRef.current) {
      try {
        // 停止计时
        if (recordTimer.current) {
          clearInterval(recordTimer.current);
          recordTimer.current = null;
        }

        // 取消录音
        await clientRef.current?.stopRecord();
        setIsPressRecording(false);
        setIsCancelRecording(false);

        // 显示提示
        message.info('取消了语音消息');
      } catch (error: any) {
        message.error(`取消录音错误: ${error.message || '未知错误'}`);
        console.error('取消录音错误:', error);
      }
    }
  };

  // 清理资源
  useEffect(() => {
    return () => {
      if (recordTimer.current) {
        clearInterval(recordTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, []);

  return (
    <Layout className="chat-page">
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

        {/* 按键说话功能区 */}
        {turnDetectionType === 'client_interrupt' && isConnected && (
          <Row style={{ maxWidth: '400px', margin: 'auto' }}>
            <Col span={24}>
              <div
                className={`voice-button ${isPressRecording ? 'recording' : ''}`}
                onMouseDown={handleVoiceButtonMouseDown}
                onMouseUp={handleVoiceButtonMouseUp}
                onMouseLeave={handleVoiceButtonMouseLeave}
                onMouseMove={handleVoiceButtonMouseMove}
                onTouchStart={handleVoiceButtonMouseDown}
                onTouchEnd={handleVoiceButtonMouseUp}
                onTouchCancel={handleVoiceButtonMouseLeave}
                onTouchMove={handleVoiceButtonMouseMove}
              >
                {isPressRecording ? '松开 发送' : '按住 说话'}
              </div>

              {/* 录音状态提示 */}
              {isPressRecording && (
                <div className="recording-status">
                  <div className="recording-time">
                    {Math.floor(recordingDuration / 60)
                      .toString()
                      .padStart(2, '0')}
                    :{(recordingDuration % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="recording-progress-container">
                    <div
                      className="recording-progress"
                      style={{
                        width: `${(recordingDuration / maxRecordingTime) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div
                    className={`recording-tip ${isCancelRecording ? 'cancel-tip' : ''}`}
                  >
                    {isCancelRecording ? '松开手指，取消发送' : '上滑取消发送'}
                  </div>
                </div>
              )}
            </Col>
          </Row>
        )}

        {/* 状态指示器 */}
        {turnDetectionType === 'client_interrupt' && (
          <Row style={{ margin: '16px 0' }}>
            <Col span={24}>
              <div className="status-indicator">
                <div
                  className={`status-dot ${isConnected ? (isMuted ? 'muted' : 'active') : 'inactive'}`}
                ></div>
                <Text>
                  {isConnected
                    ? isMuted
                      ? '麦克风已关闭'
                      : '麦克风已打开'
                    : '未连接'}
                </Text>
              </div>
            </Col>
          </Row>
        )}

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
              JSON.stringify(getChatUpdateConfig(turnDetectionType), null, 2)
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
