import { type MutableRefObject, useState } from 'react';

import { Button, message, Space } from 'antd';
import { type WsChatClient } from '@coze/api/ws-tools';

const Operation = ({
  isConnected,
  clientRef,
  setIsConnected,
}: {
  isConnected: boolean;
  clientRef: MutableRefObject<WsChatClient | undefined>;
  setIsConnected: (isConnected: boolean) => void;
}) => {
  // 是否开启麦克风
  const [audioEnabled, setAudioEnabled] = useState(true);

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
  );
};

export default Operation;
