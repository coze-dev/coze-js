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
import { WsToolsUtils } from '@coze/api/ws-tools';
import webRTCService, { ResourceStatus } from '../../utils/webrtc-service';
import getConfig from '../../utils/config';

// Define the context type
export interface PublishContextType {
  // Connection states
  isConnecting: boolean;
  isConnected: boolean;
  isMuted: boolean;
  connectionStatus: ResourceStatus;

  // Device selection
  inputDevices: MediaDeviceInfo[];
  selectedInputDevice: string;
  mediaStreamRef: React.MutableRefObject<MediaStream | null>;

  // Volume monitor
  volume: number;
  setupSimpleVolumeMonitor: (stream: MediaStream) => void;
  cleanupVolumeMonitor: () => void;

  // Settings
  localStorageKey: string;
  config: ReturnType<typeof getConfig>;

  // QR code and sharing
  isQrModalOpen: boolean;
  shareUrl: string;

  // Device info
  isMobile: boolean;

  // Methods
  setIsConnecting: (value: boolean) => void;
  setIsConnected: (value: boolean) => void;
  setIsMuted: (value: boolean) => void;
  setConnectionStatus: (value: ResourceStatus) => void;
  setSelectedInputDevice: (deviceId: string) => void;
  setInputDevices: (devices: MediaDeviceInfo[]) => void;
  setIsQrModalOpen: (value: boolean) => void;
  setShareUrl: (value: string) => void;

  // Handlers
  handleSetAudioInputDevice: (deviceId: string) => void;
  handleSettingsChange: () => void;
  handleStartPublishing: () => void;
  handleStopPublishing: () => void;
  handleToggleMute: () => void;
  handleShowQrModal: () => void;
  handleCopyUrl: () => void;
}

// Create context with a default undefined value
const PublishContext = createContext<PublishContextType | undefined>(undefined);

// Context provider component
export const PublishProvider = ({ children }: { children: ReactNode }) => {
  // State for managing WebRTC connection
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ResourceStatus>(
    ResourceStatus.IDLE,
  );

  // State for device selection
  const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedInputDevice, setSelectedInputDevice] = useState<string>('');
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // 音量相关状态
  const [volume, setVolume] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Storage key for settings
  const localStorageKey = 'rtc-publish';

  // State for QR code modal
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Config utility for retrieving settings
  const config = getConfig(localStorageKey);

  // Device info
  const isMobile = WsToolsUtils.isMobile();

  // 定时检查连接状态
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isConnected) {
      intervalId = setInterval(() => {
        const status = webRTCService.getStatus();
        setConnectionStatus(status);

        // 如果连接已断开或失败，更新UI状态
        if (
          status === ResourceStatus.FAILED ||
          status === ResourceStatus.CLOSED
        ) {
          setIsConnected(false);
          message.error('连接已断开，请重新发布');
          clearInterval(intervalId);
        }
      }, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isConnected]);

  // Fetch available audio input devices on component mount
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await WsToolsUtils.getAudioDevices();
        setInputDevices(devices.audioInputs);
        if (devices.audioInputs.length > 0) {
          setSelectedInputDevice(devices.audioInputs[0].deviceId);
        }
      } catch (error) {
        console.error('Failed to get audio devices:', error);
        message.error('无法获取音频设备列表');
      }
    };

    getDevices();
  }, []);

  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      // 清理任何流或连接
      if (mediaStreamRef.current) {
        mediaStreamRef.current
          .getTracks()
          .forEach((track: MediaStreamTrack) => track.stop());
      }
      cleanupVolumeMonitor();
    };
  }, []);

  // 简单的音量监控函数 - 使用Canvas
  const setupSimpleVolumeMonitor = (stream: MediaStream) => {
    if (!stream) return;

    try {
      // 清理之前的监控
      cleanupVolumeMonitor();

      // 创建音频上下文和分析器
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 32; // 较低分辨率，足够显示音量
      analyserRef.current = analyser;

      // 连接音频源到分析器
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // 定时获取音量数据
      intervalRef.current = window.setInterval(() => {
        if (!analyserRef.current) return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        // 计算平均音量
        const average =
          dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        const normalizedVolume = Math.min(100, average); // 将最大值限制在100

        setVolume(normalizedVolume);
      }, 100);
    } catch (error) {
      console.error('Error setting up volume monitor:', error);
    }
  };

  // 清理音量监控资源
  const cleanupVolumeMonitor = () => {
    // 清除定时器
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // 关闭音频上下文
    if (audioContextRef.current) {
      if (audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
      audioContextRef.current = null;
    }

    // 重置分析器
    analyserRef.current = null;

    // 重置音量
    setVolume(0);
  };

  // Handle audio input device selection
  const handleSetAudioInputDevice = (deviceId: string) => {
    setSelectedInputDevice(deviceId);

    // 如果已经连接，需要停止当前流并重新获取新设备的流
    if (isConnected && mediaStreamRef.current) {
      // 停止当前所有轨道
      mediaStreamRef.current
        .getTracks()
        .forEach((track: MediaStreamTrack) => track.stop());

      // 获取新设备的流
      navigator.mediaDevices
        .getUserMedia({
          audio: { deviceId: { exact: deviceId } },
        })
        .then(stream => {
          mediaStreamRef.current = stream;
          webRTCService.updateMediaStream(stream);
          setupSimpleVolumeMonitor(stream);
        })
        .catch(error => {
          console.error('Error switching audio device:', error);
          message.error('切换音频设备失败');
        });
    }
  };

  // Settings change handler
  const handleSettingsChange = () => {
    // 设置变更时，如果已连接，可能需要重新连接
    if (isConnected) {
      message.info('设置已更改，可能需要重新连接');
    }
  };

  // Handle starting the WebRTC connection
  const handleStartPublishing = async () => {
    if (isConnecting || isConnected) return;

    // 获取配置信息
    const appId = config.getAppId();
    const streamId = config.getStreamId();
    const pat = config.getPat();

    // 验证配置
    if (!appId || !streamId) {
      message.error('请先在设置中配置 AppID 和 StreamID');
      return;
    }

    setIsConnecting(true);
    setConnectionStatus(ResourceStatus.CONNECTING);

    try {
      // 请求麦克风权限并获取媒体流
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: selectedInputDevice
          ? { deviceId: { exact: selectedInputDevice } }
          : true,
      });

      // 保存流的引用
      mediaStreamRef.current = stream;

      // 设置音量监控
      setupSimpleVolumeMonitor(stream);

      // 设置事件监听器
      const onConnected = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionStatus(ResourceStatus.CONNECTED);
        setIsMuted(false);
        message.success('发布成功');

        // 准备分享URL
        const shareUrl = webRTCService.getShareUrl();
        setShareUrl(shareUrl);
      };

      const onError = (error: Error) => {
        console.error('WebRTC publishing error:', error);
        setIsConnected(false);
        setIsConnecting(false);
        setConnectionStatus(ResourceStatus.FAILED);
        message.error(`发布失败: ${error.message}`);

        // 清理资源
        if (mediaStreamRef.current) {
          mediaStreamRef.current
            .getTracks()
            .forEach((track: MediaStreamTrack) => track.stop());
          mediaStreamRef.current = null;
        }
        cleanupVolumeMonitor();
      };

      // 启动WebRTC发布
      await webRTCService
        .publish(
          {
            appId,
            streamId,
            pat,
          },
          mediaStreamRef.current,
        )
        .then(onConnected)
        .catch(onError);
    } catch (error) {
      console.error('Failed to start publishing:', error);
      message.error('无法访问麦克风，请检查权限设置');
      setIsConnecting(false);
      setConnectionStatus(ResourceStatus.FAILED);
    }
  };

  // Handle stopping the WebRTC connection
  const handleStopPublishing = () => {
    if (!isConnected) return;

    // 停止WebRTC连接
    webRTCService.unpublish();

    // 停止媒体流
    if (mediaStreamRef.current) {
      mediaStreamRef.current
        .getTracks()
        .forEach((track: MediaStreamTrack) => track.stop());
      mediaStreamRef.current = null;
    }

    // 清理音量监控
    cleanupVolumeMonitor();

    // 更新状态
    setIsConnected(false);
    setConnectionStatus(ResourceStatus.IDLE);
    message.info('已停止发布');
  };

  // Handle mute/unmute
  const handleToggleMute = () => {
    if (!isConnected || !mediaStreamRef.current) return;

    const audioTracks = mediaStreamRef.current.getAudioTracks();
    if (audioTracks.length === 0) return;

    const shouldMute = !isMuted;
    audioTracks.forEach(track => {
      track.enabled = !shouldMute;
    });

    setIsMuted(shouldMute);

    // 更新音量监控
    if (shouldMute) {
      // 如果静音，暂停音量监控但不完全清理
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setVolume(0);
    } else if (mediaStreamRef.current) {
      // 如果取消静音，重新启动音量监控
      setupSimpleVolumeMonitor(mediaStreamRef.current);
    }

    message.info(shouldMute ? '已静音' : '已取消静音');
  };

  // Handle showing QR code modal
  const handleShowQrModal = () => {
    if (isConnected) {
      setIsQrModalOpen(true);
    } else {
      message.warning('请先开始发布');
    }
  };

  // Handle copying share URL
  const handleCopyUrl = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => message.success('链接已复制到剪贴板'))
      .catch(() => message.error('复制失败，请手动复制'));
  };

  const value: PublishContextType = {
    isConnecting,
    isConnected,
    isMuted,
    connectionStatus,
    inputDevices,
    selectedInputDevice,
    mediaStreamRef,
    volume,
    setupSimpleVolumeMonitor,
    cleanupVolumeMonitor,
    localStorageKey,
    config,
    isQrModalOpen,
    shareUrl,
    isMobile,
    setIsConnecting,
    setIsConnected,
    setIsMuted,
    setConnectionStatus,
    setSelectedInputDevice,
    setInputDevices,
    setIsQrModalOpen,
    setShareUrl,
    handleSetAudioInputDevice,
    handleSettingsChange,
    handleStartPublishing,
    handleStopPublishing,
    handleToggleMute,
    handleShowQrModal,
    handleCopyUrl,
  };

  return (
    <PublishContext.Provider value={value}>{children}</PublishContext.Provider>
  );
};

// Custom hook to use the publish context
export const usePublish = (): PublishContextType => {
  const context = useContext(PublishContext);
  if (context === undefined) {
    throw new Error('usePublish must be used within a PublishProvider');
  }
  return context;
};
