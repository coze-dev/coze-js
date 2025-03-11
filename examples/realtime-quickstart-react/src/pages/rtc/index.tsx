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
import { CozeAPI, ChatEventType } from '@coze/api';
import {
  useTokenWithPat,
  useTokenWithDevice,
  useTokenWithJWT,
  useTokenWithPKCE,
  useTokenWithWeb,
} from '../../hooks';
import Settings from '../../components/settings';
import getConfig from '../../utils/config';

const localStorageKey = 'realtime-quickstart-rtc';
const config = getConfig(localStorageKey);

function Rtc() {
  const clientRef = useRef<RealtimeClient | null>(null);
  // 实时语音回复消息列表
  const [messageList, setMessageList] = useState<string[]>([]);
  // 是否正在连接
  const [isConnecting, setIsConnecting] = useState(false);
  // 是否已连接
  const [isConnected, setIsConnected] = useState(false);
  // 是否开启麦克风
  const [audioEnabled, setAudioEnabled] = useState(true);
  // 是否支持视频
  const [isSupportVideo, setIsSupportVideo] = useState(false);

  const { getToken } = useTokenWithPat(localStorageKey);
  // const { getToken } = useTokenWithDevice();
  // const { getToken } = useTokenWithJWT();
  // const { getToken } = useTokenWithPKCE();
  // const { getToken } = useTokenWithWeb();
  async function getVoices() {
    const api = new CozeAPI({
      token: getToken,
      baseURL: config.getBaseUrl(),
      allowPersonalAccessTokenInBrowser: true,
    });

    const voices = await api.audio.voices.list();
    return voices.voice_list;
  }

  async function initClient() {
    const permission = await RealtimeUtils.checkDevicePermission(true);
    if (!permission.audio) {
      throw new Error('需要麦克风访问权限');
    }
    // 记录是否支持视频
    setIsSupportVideo(permission.video);

    // 获取可用音色列表(可选)
    const voices = await getVoices();

    const client = new RealtimeClient({
      accessToken: getToken,
      botId: config.getBotId(),
      connectorId: '1024',
      voiceId: voices.length > 0 ? voices[0].voice_id : undefined,
      allowPersonalAccessTokenInBrowser: true, // 可选：允许在浏览器中使用个人访问令牌
      debug: true,
      videoConfig: permission.video
        ? {
            renderDom: 'local-player',
          }
        : undefined,
    });

    clientRef.current = client;

    handleMessageEvent();
  }

  const handleMessageEvent = async () => {
    let lastEvent: any;

    clientRef.current?.on(EventNames.ALL_SERVER, (eventName, event: any) => {
      if (
        event.event_type !== ChatEventType.CONVERSATION_MESSAGE_DELTA &&
        event.event_type !== ChatEventType.CONVERSATION_MESSAGE_COMPLETED
      ) {
        return;
      }
      const content = event.data.content;
      setMessageList(prev => {
        // 如果上一个事件是增量更新，则附加到最后一条消息
        if (
          lastEvent?.event_type === ChatEventType.CONVERSATION_MESSAGE_DELTA
        ) {
          return [...prev.slice(0, -1), prev[prev.length - 1] + content];
        }
        // 否则添加新消息
        if (event.event_type === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
          return [...prev, content];
        }
        return prev;
      });
      lastEvent = event;
    });
  };

  const handleConnect = async () => {
    try {
      if (!clientRef.current) {
        await initClient();
      }
      await clientRef.current?.connect();
      setIsConnected(true);
    } catch (error) {
      console.error(error);
      if (error instanceof RealtimeAPIError) {
        switch (error.code) {
          case RealtimeError.CREATE_ROOM_ERROR:
            message.error(`创建房间失败: ${error.message}`);
            break;
          case RealtimeError.CONNECTION_ERROR:
            message.error(`加入房间失败: ${error.message}`);
            break;
          case RealtimeError.DEVICE_ACCESS_ERROR:
            message.error(`获取设备失败: ${error.message}`);
            break;
          default:
            message.error(`连接错误: ${error.message}`);
        }
      } else {
        message.error('连接错误：' + error);
      }
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
      clientRef.current?.clearEventHandlers();
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
    setMessageList([]);
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
        {isSupportVideo && (
          <Space>
            <div
              id="local-player"
              style={{
                width: 400,
                height: 400,
                border: '1px solid #ccc',
              }}
            ></div>
          </Space>
        )}
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

export default Rtc;
