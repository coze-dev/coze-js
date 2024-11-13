import React, { useEffect, useRef, useState } from 'react';

import { Button, message, Typography, Select } from 'antd';
import {
  RealtimeAPIError,
  type RealtimeClient,
  RealtimeUtils,
} from '@coze/realtime-api';
import { AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';

import MessageForm, { type MessageFormRef } from './MessageForm';

import './App.css';
import { ChatEventType } from '@coze/api';

const { Text, Link } = Typography;

interface ConsoleFooterProps {
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  onToggleMicrophone: (isMicrophoneOn: boolean) => void;
  isMicrophoneOn: boolean;
  isConnected?: boolean;
  clientRef: React.MutableRefObject<RealtimeClient | null>;
}

const STORAGE_KEY = 'noiseSuppression';

const DISCONNECT_TIME = 1800; // 30 minutes

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
  const [noiseSuppression, setNoiseSuppression] = useState<string[]>(() => {
    const savedValue = localStorage.getItem(STORAGE_KEY);
    return savedValue ? JSON.parse(savedValue) : [];
  });
  const [connectLeftTime, setConnectLeftTime] = useState(DISCONNECT_TIME);
  const [audioCapture, setAudioCapture] = useState<string>('default');
  const [audioPlayback, setAudioPlayback] = useState<string>('default');
  const [inputDeviceOptions, setInputDeviceOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [outputDeviceOptions, setOutputDeviceOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const formRef = useRef<MessageFormRef>(null);
  const isShowVideo = !window.location.href.includes('coze.cn');

  const checkMicrophonePermission = () => {
    RealtimeUtils.checkPermission({
      audio: true,
      video: isShowVideo,
    }).then(isDeviceEnable => {
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
  useEffect(() => {
    if (isConnected && connectLeftTime > 0) {
      const timer = setInterval(() => {
        setConnectLeftTime(prev => {
          if (prev <= 1) {
            handleDisconnect();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isConnected, connectLeftTime]);

  useEffect(() => {
    async function getDevices() {
      try {
        const devices = await RealtimeUtils.getAudioDevices();
        const inputDevices = devices.audioInputs.map(device => ({
          label: device.label || `Microphone ${device.deviceId}`,
          value: device.deviceId,
        }));
        const outputDevices = devices.audioOutputs.map(device => ({
          label: device.label || `Speaker ${device.deviceId}`,
          value: device.deviceId,
        }));

        setInputDeviceOptions(inputDevices);
        setOutputDeviceOptions(outputDevices);
      } catch (err) {
        console.error('Failed to get devices:', err);
        message.error('Failed to get devices');
      }
    }

    getDevices();
  }, []);

  useEffect(() => {
    if (!clientRef.current) {
      return;
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const onMessage = (event: string, data: any) => {
      const functionCall =
        data?.data?.required_action?.submit_tool_outputs?.tool_calls?.[0]
          ?.function;
      formRef.current?.showModal(
        JSON.stringify(
          {
            id: '1',
            event_type: 'conversation.chat.submit_tool_outputs',
            data: {
              chat_id: data?.data?.id,
              tool_outputs: [
                {
                  tool_call_id:
                    data?.data?.required_action?.submit_tool_outputs
                      ?.tool_calls?.[0]?.id,
                  output: '',
                },
              ],
            },
          },
          null,
          2,
        ),
        JSON.stringify(functionCall, null, 2),
      );
    };
    const eventName = `server.${ChatEventType.CONVERSATION_CHAT_REQUIRES_ACTION}`;
    clientRef.current.on(eventName, onMessage);

    return () => {
      try {
        clientRef.current?.off(eventName, onMessage);
      } catch (e) {
        console.error(e);
      }
    };
  }, [clientRef.current]);

  const handleRefreshMicrophone = () => {
    checkMicrophonePermission();
  };

  const handleNoiseSuppressionChange = (value: string[]) => {
    setNoiseSuppression(value);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  };

  const handleConnect = () => {
    setIsConnecting(true);
    onConnect().finally(() => {
      setIsConnecting(false);
    });
  };

  const handleDisconnect = () => {
    setConnectLeftTime(DISCONNECT_TIME);
    onDisconnect();
  };

  const handleInterrupt = async () => {
    if (!clientRef.current) {
      message.error('Please click Settings to set configuration first');
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
      message.error('Please click Settings to set configuration first');
    }
  };

  const handleSendMessage = (values: { eventData: string }) => {
    if (!clientRef.current) {
      message.error('Please click Settings to set configuration first');
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
      message.error('Please click Settings to set configuration first');
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
      message.error('Please click Settings to set configuration first');
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

  const handleAudioCaptureChange = (value: string) => {
    setAudioCapture(value);
    clientRef.current?.setAudioInputDevice(value);
  };

  const handleAudioPlaybackChange = (value: string) => {
    setAudioPlayback(value);
    clientRef.current?.setAudioOutputDevice(value);
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
          onClick={handleDisconnect}
          className="button-margin-right"
        >
          Disconnect ({Math.floor(connectLeftTime / 60)}m {connectLeftTime % 60}
          s)
        </Button>
        <div style={{ marginTop: '10px' }}></div>
        <MessageForm onSubmit={handleSendMessage} ref={formRef} />
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
        <div
          style={{
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <span style={{ marginBottom: '10px' }}>
            <Text style={{ marginRight: 8 }}>Capture Device:</Text>
            <Select
              style={{ width: 200 }}
              value={audioCapture}
              onChange={handleAudioCaptureChange}
              options={inputDeviceOptions}
            />
          </span>
          <span>
            <Text style={{ marginRight: 8 }}>Playback Device:</Text>
            <Select
              style={{ width: 200 }}
              value={audioPlayback}
              onChange={handleAudioPlaybackChange}
              options={outputDeviceOptions}
            />
          </span>
        </div>
      </>
    );
  }
  return (
    <>
      <Text style={{ marginRight: 8 }}>Audio Noise Suppression:</Text>
      <Select
        mode="multiple"
        style={{ width: 300, marginRight: 10 }}
        value={noiseSuppression}
        onChange={handleNoiseSuppressionChange}
        options={[
          { label: 'Stationary Noise', value: 'stationary' },
          { label: 'Non-stationary Noise', value: 'non-stationary' },
        ]}
      />
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
