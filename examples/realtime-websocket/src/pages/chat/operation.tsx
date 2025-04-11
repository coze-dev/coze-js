import { type MutableRefObject, useState } from 'react';

import { Button, message, Space } from 'antd';
import { type WsChatClient } from '@coze/api/ws-tools';
import {
  AudioOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';

const Operation = ({
  isConnected,
  clientRef,
  setIsConnected,
  audioMutedDefault,
}: {
  isConnected: boolean;
  clientRef: MutableRefObject<WsChatClient | undefined>;
  setIsConnected: (isConnected: boolean) => void;
  audioMutedDefault: boolean;
}) => {
  // 是否开启麦克风
  const [audioEnabled, setAudioEnabled] = useState(!audioMutedDefault);

  const handleInterrupt = () => {
    try {
      clientRef.current?.interrupt();
    } catch (error) {
      message.error(`打断失败：${error}`);
    }
  };

  const toggleMicrophone = async () => {
    try {
      await clientRef.current?.setAudioEnable(!audioEnabled);
      setAudioEnabled(!audioEnabled);
    } catch (error) {
      message.error(`切换麦克风状态失败：${error}`);
    }
  };

  const handleDisconnect = () => {
    try {
      clientRef.current?.disconnect();
      clientRef.current = undefined;
      setIsConnected(false);
    } catch (error) {
      message.error(`断开失败：${error}`);
    }
  };

  return (
    <Space>
      <Button
        type="primary"
        size="large"
        icon={<AudioOutlined />}
        danger
        disabled={!isConnected}
        onClick={handleDisconnect}
      >
        断开
      </Button>
      <Button
        icon={<StopOutlined />}
        size="large"
        disabled={!isConnected}
        onClick={handleInterrupt}
      >
        打断对话
      </Button>

      <Button
        icon={audioEnabled ? <PauseOutlined /> : <PlayCircleOutlined />}
        onClick={toggleMicrophone}
        size="large"
      >
        {audioEnabled ? '静音' : '取消静音'}
      </Button>
    </Space>
  );
};

export default Operation;
