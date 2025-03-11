/* eslint-disable */
import { useRef, useState } from 'react';
import {
  EventNames,
  RealtimeAPIError,
  RealtimeClient,
  RealtimeError,
  RealtimeUtils,
} from '@coze/realtime-api';
import { Button, Space, List, message } from 'antd';
import {
  CozeAPI,
  ChatEventType,
  CreateChatWsRes,
  WebsocketsEventType,
} from '@coze/api';
import {
  useTokenWithPat,
  useTokenWithDevice,
  useTokenWithJWT,
  useTokenWithPKCE,
  useTokenWithWeb,
} from '../../hooks';
import getConfig from '../../utils/config';
import Settings from '../../components/settings';
import { WsChatClient } from '@coze/api/ws-tools';
const localStorageKey = 'realtime-quickstart-ws';
const config = getConfig(localStorageKey);

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

  const { getToken } = useTokenWithPat(localStorageKey);
  // const { getToken } = useTokenWithDevice();
  // const { getToken } = useTokenWithJWT();
  // const { getToken } = useTokenWithPKCE();
  // const { getToken } = useTokenWithWeb();

  async function initClient() {
    const permission = await RealtimeUtils.checkDevicePermission();
    if (!permission.audio) {
      throw new Error('需要麦克风访问权限');
    }

    const client = new WsChatClient({
      token: getToken,
      baseWsURL: config.getBaseWsUrl(),
      allowPersonalAccessTokenInBrowser: true,
    });

    clientRef.current = client;

    handleMessageEvent();
  }

  const handleMessageEvent = async () => {
    let lastEvent: any;

    clientRef.current?.on('data', (event: CreateChatWsRes) => {
      console.log('[chat] event', event);

      if (
        event.event_type !== WebsocketsEventType.CONVERSATION_MESSAGE_DELTA &&
        event.event_type !== WebsocketsEventType.CONVERSATION_MESSAGE_COMPLETED
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
    });

    clientRef.current?.on(
      WebsocketsEventType.INPUT_AUDIO_BUFFER_SPEECH_STOPPED,
      () => {
        // clientRef.current?.setAudioEnable(false);
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
      await clientRef.current?.connect({ botId: config.getBotId() });
      setIsConnected(true);
    } catch (error) {
      console.error(error);
      message.error('连接错误：' + error);
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

  // 添加设置变更处理函数
  const handleSettingsChange = () => {
    // 重新初始化客户端或刷新配置
    if (isConnected) {
      handleDisconnect();
    }
  };
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <Settings
          onSettingsChange={handleSettingsChange}
          localStorageKey={localStorageKey}
        />
      </div>
      <Space style={{ padding: '20px' }}>
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
    </div>
  );
}

export default WS;
