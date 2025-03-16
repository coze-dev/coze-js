/* eslint-disable */
import { useRef, useState, useEffect } from 'react';
import { RealtimeUtils } from '@coze/realtime-api';
import { Button, Space, List, message, Modal, Input, Select } from 'antd';
import {
  ConversationAudioTranscriptUpdateEvent,
  CreateChatWsRes,
  WebsocketsEventType,
} from '@coze/api';
import { useTokenWithPat } from '../../hooks';
import getConfig from '../../utils/config';
import Settings from '../../components/settings';
import { WsChatClient, WsChatEventNames } from '@coze/api/ws-tools';
const localStorageKey = 'realtime-quickstart-ws';
const config = getConfig(localStorageKey);
const { TextArea } = Input;

function WS() {
  const clientRef = useRef<WsChatClient | null>(null);
  // 实时语音回复消息列表
  const [messageList, setMessageList] = useState<string[]>([]);
  // 是否正在连接
  const [isConnecting, setIsConnecting] = useState(false);
  // 是否已连接
  const [isConnected, setIsConnected] = useState(false);
  // 是否开启麦克风
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [transcript, setTranscript] = useState('');
  const { getToken } = useTokenWithPat(localStorageKey);
  const isRecordingRef = useRef(false);
  const [audioBuffer, setAudioBuffer] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedInputDevice, setSelectedInputDevice] = useState<string>('');

  useEffect(() => {
    const getDevices = async () => {
      const devices = await RealtimeUtils.getAudioDevices();
      setInputDevices(devices.audioInputs);
      if (devices.audioInputs.length > 0) {
        setSelectedInputDevice(devices.audioInputs[0].deviceId);
      }
    };

    getDevices();
  }, []);

  async function initClient() {
    const permission = await RealtimeUtils.checkDevicePermission();
    if (!permission.audio) {
      throw new Error('需要麦克风访问权限');
    }

    const client = new WsChatClient({
      token: getToken,
      baseWsURL: config.getBaseWsUrl(),
      allowPersonalAccessTokenInBrowser: true,
      botId: config.getBotId(),
      debug: false,
      voiceId: config.getVoiceId(),
    });

    clientRef.current = client;

    handleMessageEvent();
  }

  const handleMessageEvent = async () => {
    let lastEvent: any;

    clientRef.current?.on(
      WsChatEventNames.ALL,
      (event: CreateChatWsRes | undefined) => {
        console.log('[chat] event_type', event?.event_type);

        if (!event) {
          return;
        }

        if (
          event.event_type !== WebsocketsEventType.CONVERSATION_MESSAGE_DELTA &&
          event.event_type !==
            WebsocketsEventType.CONVERSATION_MESSAGE_COMPLETED
        ) {
          return;
        }
        const content = event.data.content;
        setMessageList(prev => {
          // 如果上一个事件是增量更新，则附加到最后一条消息
          if (
            lastEvent?.event_type ===
            WebsocketsEventType.CONVERSATION_MESSAGE_DELTA
          ) {
            return [...prev.slice(0, -1), prev[prev.length - 1] + content];
          }
          // 否则添加新消息
          if (
            event.event_type === WebsocketsEventType.CONVERSATION_MESSAGE_DELTA
          ) {
            return [...prev, content];
          }
          return prev;
        });
        lastEvent = event;
      },
    );

    clientRef.current?.on(
      WebsocketsEventType.INPUT_AUDIO_BUFFER_SPEECH_STARTED,
      () => {
        // clientRef.current?.clear();
      },
    );
    clientRef.current?.on(
      WebsocketsEventType.INPUT_AUDIO_BUFFER_SPEECH_STOPPED,
      () => {
        // clientRef.current?.clear();
      },
    );
    clientRef.current?.on(
      WebsocketsEventType.CONVERSATION_AUDIO_TRANSCRIPT_UPDATE,
      (event: unknown) => {
        console.log('[chat] transcript update', event);
        setTranscript(
          (event as ConversationAudioTranscriptUpdateEvent).data.content,
        );
      },
    );

    clientRef.current?.on('completed', () => {
      console.log('[chat] completed');
      // clientRef.current?.setAudioEnable(true);
    });
  };

  const handleConnect = async () => {
    try {
      if (!clientRef.current) {
        await initClient();
      }
      await clientRef.current?.connect({
        onAudioBufferAppend: data => {
          if (isRecordingRef.current) {
            setAudioBuffer(prev => [...prev, data.data.delta]);
          }
        },
      });
      setIsConnected(true);
    } catch (error) {
      console.error(error);
      message.error('连接错误：' + (error as Error).message);
    }
  };

  const handleInterrupt = () => {
    try {
      clientRef.current?.interrupt();
    } catch (error) {
      message.error('打断失败：' + error);
    }
  };

  const handleDisconnect = () => {
    try {
      clientRef.current?.disconnect();
      clientRef.current = null;
      setIsConnected(false);
    } catch (error) {
      message.error('断开失败：' + error);
    }
  };

  const toggleMicrophone = async () => {
    try {
      await clientRef.current?.setAudioEnable(!audioEnabled);
      setAudioEnabled(!audioEnabled);
    } catch (error) {
      message.error('切换麦克风状态失败：' + error);
    }
  };

  const handleSendText = (text: string) => {
    // 打印当前时间
    console.log('[chat] current time', new Date().toLocaleString(), text);

    clientRef.current?.sendTextMessage(text);
  };

  const handleSendAudio = async () => {
    if (audioBuffer.length === 0) {
      message.error('请先录制音频');
      return;
    }
    console.log('[chat] handleSendAudio start');
    for (let i = 0; i < audioBuffer.length; i++) {
      const audio = audioBuffer[i];
      await new Promise(resolve => setTimeout(resolve, 50));
      clientRef.current?.sendMessage({
        id: 'event_id',
        event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_APPEND,
        data: {
          delta: audio,
        },
      });
    }
    console.log('[chat] handleSendAudio end');
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
    // 重新初始化客户端或刷新配置
    if (isConnected) {
      handleDisconnect();
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (inputText.trim()) {
      handleSendText(inputText);
      setInputText('');
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setInputText('');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <Settings
          onSettingsChange={handleSettingsChange}
          localStorageKey={localStorageKey}
        />
      </div>
      <Space style={{ padding: '10px' }}>
        <Button
          type="primary"
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
        <Button disabled={!isConnected} onClick={handleInterrupt}>
          打断
        </Button>
        <Button danger disabled={!isConnected} onClick={handleDisconnect}>
          断开
        </Button>
        {audioEnabled ? (
          <Button disabled={!isConnected} onClick={toggleMicrophone}>
            静音
          </Button>
        ) : (
          <Button disabled={!isConnected} onClick={toggleMicrophone}>
            取消静音
          </Button>
        )}
      </Space>
      <br />
      <Space>
        <Select
          style={{ width: 200 }}
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
        <Button disabled={!isConnected} onClick={showModal} block>
          发送文本
        </Button>
        {!isRecordingRef.current ? (
          <Button
            disabled={!isConnected}
            onClick={() => {
              setAudioBuffer([]);
              isRecordingRef.current = true;
            }}
            block
          >
            音频录制
          </Button>
        ) : (
          <Button
            disabled={!isConnected}
            onClick={() => {
              isRecordingRef.current = false;
            }}
            block
          >
            停止录制
          </Button>
        )}
        <Button disabled={!isConnected} onClick={handleSendAudio} block>
          音频发送
        </Button>
      </Space>
      <br />
      <Space style={{ padding: '20px' }} align="start">
        <div style={{ width: '400px', textAlign: 'left' }}>
          语音识别结果：{transcript}
        </div>
      </Space>
      <br />
      <Space direction="vertical">
        <Space>
          <div
            style={{
              marginTop: '20px',
              padding: '20px',
              maxHeight: '600px',
              width: '400px',
              overflowY: 'auto',
              border: '1px solid #ccc',
            }}
          >
            <h3>实时语音回复</h3>
            <List
              dataSource={messageList}
              renderItem={(message, index) => (
                <List.Item key={index} style={{ textAlign: 'left' }}>
                  {message}
                </List.Item>
              )}
            />
          </div>
        </Space>
      </Space>
      <Modal
        title="发送文本消息"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <TextArea
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="请输入要发送的文本"
          rows={4}
        />
      </Modal>
    </div>
  );
}

export default WS;
