/* eslint-disable */
import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from 'react';
import { message } from 'antd';
import { useLocation } from 'react-router-dom';
import { WsToolsUtils } from '@coze/api/ws-tools';
import webRTCService, { ResourceStatus } from '../../utils/webrtc-service';

// Helper function for URL parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Define the context type
export interface SubscribeContextType {
  // Audio states
  isMuted: boolean;
  isConnecting: boolean;
  isConnected: boolean;
  status: ResourceStatus;

  // URL parameters
  appId: string | null;
  streamId: string | null;

  // Audio element reference
  audioRef: React.RefObject<HTMLAudioElement>;

  // Device info
  isMobile: boolean;

  // State setters
  setIsMuted: (value: boolean) => void;
  setIsConnecting: (value: boolean) => void;
  setIsConnected: (value: boolean) => void;
  setStatus: (value: ResourceStatus) => void;

  // Handlers
  handleToggleMute: () => void;
  handleSubscribe: () => Promise<void>;
  handleUnsubscribe: () => Promise<void>;
  handleListenTranslation: () => void;
}

// Create context with a default undefined value
const SubscribeContext = createContext<SubscribeContextType | undefined>(
  undefined,
);

// Context provider component
export const SubscribeProvider = ({ children }: { children: ReactNode }) => {
  // 状态管理
  const [isMuted, setIsMuted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  // 设置连接状态
  const [status, setStatus] = useState<ResourceStatus>(ResourceStatus.IDLE);

  // 获取URL参数
  const query = useQuery();
  const appId = query.get('appId') || query.get('appid');
  const streamId = query.get('streamId') || query.get('streamid');

  // 音频元素引用
  const audioRef = useRef<HTMLAudioElement>(null);

  // 检测是否是移动设备
  const isMobile = WsToolsUtils.isMobile();

  // 页面加载时检查URL参数
  useEffect(() => {
    if (!appId || !streamId) {
      message.error('缺少必要的URL参数: appid 或 streamid');
    }

    // 组件卸载时清理资源
    return () => {
      // 如果已连接，断开连接
      if (isConnected) {
        handleUnsubscribe();
      }
    };
  }, [appId, streamId]);

  // 静音/取消静音
  const handleToggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  // 订阅音频流
  const handleSubscribe = async () => {
    if (!appId || !streamId) {
      message.error('缺少必要的参数');
      return;
    }

    try {
      setIsConnecting(true);
      setStatus(ResourceStatus.CONNECTING);

      // 生成随机客户端ID
      const clientId = `client_${Math.random().toString(36).substring(2, 9)}`;

      // 创建WebRTC订阅
      const result = await webRTCService.subscribe(appId, streamId, clientId);

      // 获取远程媒体流
      const peerConnection = result.peerConnection;
      if (peerConnection) {
        // 绑定媒体流事件
        peerConnection.ontrack = (event: RTCTrackEvent) => {
          console.log('Received remote track:', event.track.kind);
          if (event.track.kind === 'audio' && audioRef.current) {
            // 创建媒体流并设置给audio元素
            const mediaStream = new MediaStream([event.track]);
            audioRef.current.srcObject = mediaStream;
            audioRef.current.play().catch(error => {
              console.error('Error playing audio:', error);
            });
          }
        };

        // 绑定连接状态变化事件
        peerConnection.onconnectionstatechange = () => {
          console.log(
            'Connection state changed:',
            peerConnection.connectionState,
          );
          if (peerConnection.connectionState === 'connected') {
            setStatus(ResourceStatus.CONNECTED);
            setIsConnected(true);
            setIsConnecting(false);
            message.success('连接成功');
          } else if (peerConnection.connectionState === 'failed') {
            setStatus(ResourceStatus.FAILED);
            setIsConnected(false);
            setIsConnecting(false);
            message.error('连接失败');
          } else if (peerConnection.connectionState === 'closed') {
            setStatus(ResourceStatus.CLOSED);
            setIsConnected(false);
            setIsConnecting(false);
          }
        };
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
      message.error(
        `订阅失败: ${error instanceof Error ? error.message : String(error)}`,
      );
      setStatus(ResourceStatus.FAILED);
      setIsConnecting(false);
    }
  };

  // 取消订阅
  const handleUnsubscribe = async () => {
    try {
      await webRTCService.unsubscribe();

      // 清理音频元素
      if (audioRef.current) {
        audioRef.current.srcObject = null;
      }

      setIsConnected(false);
      setStatus(ResourceStatus.CLOSED);
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    }
  };

  // 开始听翻译 - 目前与自动订阅功能相同
  const handleListenTranslation = () => {
    if (!isConnected && !isConnecting) {
      handleSubscribe();
    }
  };

  const value: SubscribeContextType = {
    isMuted,
    isConnecting,
    isConnected,
    status,
    appId,
    streamId,
    audioRef,
    isMobile,
    setIsMuted,
    setIsConnecting,
    setIsConnected,
    setStatus,
    handleToggleMute,
    handleSubscribe,
    handleUnsubscribe,
    handleListenTranslation,
  };

  return (
    <SubscribeContext.Provider value={value}>
      {children}
    </SubscribeContext.Provider>
  );
};

// Custom hook to use the subscribe context
export const useSubscribe = (): SubscribeContextType => {
  const context = useContext(SubscribeContext);
  if (context === undefined) {
    throw new Error('useSubscribe must be used within a SubscribeProvider');
  }
  return context;
};
