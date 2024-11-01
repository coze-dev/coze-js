import React, { useEffect, useState } from 'react';

import { Button, message, Typography } from 'antd';
import {
  RealtimeAPIError,
  type RealtimeClient,
  RealtimeUtils,
} from '@coze/realtime-api';
import { AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';

import MessageForm from './MessageForm';
import './App.css';

const { Link } = Typography;

interface ConsoleFooterProps {
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  onToggleMicrophone: (isMicrophoneOn: boolean) => void;
  isMicrophoneOn: boolean;
  isConnected?: boolean;
  clientRef: React.MutableRefObject<RealtimeClient | null>;
}

const ConsoleFooter: React.FC<ConsoleFooterProps> = ({
  onConnect,
  onDisconnect,
  onToggleMicrophone,
  isConnected,
  clientRef,
  isMicrophoneOn,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [microphoneStatus, setMicrophoneStatus] = useState<'normal' | 'error'>(
    'normal',
  );
  const [isAudioPlaybackDeviceTest, setIsAudioPlaybackDeviceTest] =
    useState(false);

  const checkMicrophonePermission = () => {
    RealtimeUtils.checkPermission().then(isDeviceEnable => {
      if (isDeviceEnable) {
        setMicrophoneStatus('normal');
      } else {
        setMicrophoneStatus('error');
      }
    });
  };

  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  const handleRefreshMicrophone = () => {
    checkMicrophonePermission();
  };

  const handleConnect = () => {
    setIsConnecting(true);
    onConnect().finally(() => {
      setIsConnecting(false);
    });
  };

  const handleInterrupt = async () => {
    if (!clientRef.current) {
      message.error('Please set accessToken and botId first');
      return;
    }

    try {
      await clientRef.current.interrupt();
      message.success('Interrupted');
    } catch (e) {
      const errorMessage =
        e instanceof RealtimeAPIError ? e.message : 'Unknown error';
      message.error(`Failed to interrupt: ${errorMessage}`);
      console.error(e);
    }
  };

  const handleToggleMicrophone = () => {
    if (clientRef.current) {
      clientRef.current.setAudioEnable(!isMicrophoneOn);
      onToggleMicrophone(!isMicrophoneOn);
      message.success(`Microphone ${!isMicrophoneOn ? 'unmuted' : 'muted'}`);
    } else {
      message.error('Please set accessToken and botId first');
    }
  };

  const handleSendMessage = (values: { eventData: string }) => {
    if (!clientRef.current) {
      message.error('Please set accessToken and botId first');
      return;
    }
    try {
      clientRef.current?.sendMessage(JSON.parse(values.eventData));
    } catch (e) {
      message.error('Please enter valid JSON format');
      console.error('JSON parse error:', e);
    }
  };

  const handleEnableAudioPropertiesReport = () => {
    if (!clientRef?.current) {
      message.error('Please set accessToken and botId first');
      return;
    }
    try {
      clientRef?.current?.enableAudioPropertiesReport({ interval: 1000 });
      message.success('Audio properties reporting enabled');
    } catch (error) {
      message.error('Failed to enable audio properties reporting');
      console.error(error);
    }
  };

  const handleAudioPlaybackDeviceTest = () => {
    if (!clientRef?.current) {
      message.error('Please set accessToken and botId first');
      return;
    }
    if (isAudioPlaybackDeviceTest) {
      try {
        clientRef.current.stopAudioPlaybackDeviceTest();
        setIsAudioPlaybackDeviceTest(false);
        message.success('Audio playback device test stopped');
      } catch (error) {
        message.error('Failed to stop audio playback device test');
        console.error(error);
      }
    } else {
      try {
        clientRef.current.startAudioPlaybackDeviceTest();
        setIsAudioPlaybackDeviceTest(true);
        message.success('Audio playback device test started');
      } catch (error) {
        message.error('Failed to start audio playback device test');
        console.error(error);
      }
    }
  };

  if (microphoneStatus === 'error') {
    return (
      <>
        <Typography.Text>Microphone not available.</Typography.Text>
        <Link onClick={handleRefreshMicrophone}>Click to retry.</Link>
      </>
    );
  }
  if (isConnected) {
    return (
      <>
        <Button
          icon={
            isMicrophoneOn ? (
              <AudioOutlined />
            ) : (
              <AudioMutedOutlined style={{ color: 'red' }} />
            )
          }
          onClick={handleToggleMicrophone}
          className="button-margin-right"
        />
        <Button
          type="primary"
          danger
          className="button-margin-right"
          onClick={handleInterrupt}
        >
          Interrupt
        </Button>
        <Button
          type="primary"
          danger
          onClick={onDisconnect}
          className="button-margin-right"
        >
          Disconnect
        </Button>
        <div style={{ marginTop: '10px' }}></div>
        <MessageForm onSubmit={handleSendMessage} />
        <Button
          type="primary"
          style={{ marginRight: '10px', marginLeft: '10px' }}
          onClick={handleEnableAudioPropertiesReport}
        >
          Enable Audio Report
        </Button>
        <Button
          type="primary"
          className="button-margin-right"
          onClick={handleAudioPlaybackDeviceTest}
        >
          {isAudioPlaybackDeviceTest ? 'Stop' : 'Start'} Audio Device Test
        </Button>
      </>
    );
  }
  return (
    <>
      <Button
        type="primary"
        loading={isConnecting}
        disabled={isConnecting}
        className="button-margin-right button-connect"
        onClick={handleConnect}
      >
        Connect
      </Button>
    </>
  );
};

export default ConsoleFooter;
