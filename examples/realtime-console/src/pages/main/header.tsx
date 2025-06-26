import React, { useEffect, useRef, useState } from 'react';

import { Button, message, Typography, Select, Row, Col, Checkbox } from 'antd';
import {
  EventNames,
  RealtimeAPIError,
  type RealtimeClient,
  RealtimeUtils,
} from '@coze/realtime-api';
import { AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';

import '../../App.css';
import { ChatEventType } from '@coze/api';

import { isShowVideo } from '../../utils/utils';
import { LocalManager, LocalStorageKey } from '../../utils/local-manager';
import { DISCONNECT_TIME } from '../../utils/constants';
import useIsMobile from '../../hooks/use-is-mobile';
import useCozeAPI from '../../hooks/use-coze-api';
import MessageForm, { type MessageFormRef } from './message-form';
import LiveInfo from './live-info';
import ComfortStrategyForm from './comfort-strategy-form';

const { Text, Link } = Typography;

interface HeaderProps {
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  onToggleMicrophone: (isMicrophoneOn: boolean) => void;
  isMicrophoneOn: boolean;
  isConnected?: boolean;
  clientRef: React.MutableRefObject<RealtimeClient | null>;
}

const Header: React.FC<HeaderProps> = ({
  onConnect,
  onDisconnect,
  onToggleMicrophone,
  isConnected,
  clientRef,
  isMicrophoneOn,
}) => {
  const localManager = new LocalManager();
  const [isConnecting, setIsConnecting] = useState(false);
  const [microphoneStatus, setMicrophoneStatus] = useState<'normal' | 'error'>(
    'normal',
  );
  // const [isAudioPlaybackDeviceTest, setIsAudioPlaybackDeviceTest] =
  //   useState(false);
  const [noiseSuppression, setNoiseSuppression] = useState<string[]>(() => {
    const savedValue = localManager.get(LocalStorageKey.NOISE_SUPPRESSION);
    return savedValue ? JSON.parse(savedValue) : [];
  });
  const [connectLeftTime, setConnectLeftTime] = useState(DISCONNECT_TIME);
  const [audioCapture, setAudioCapture] = useState<string>('default');
  const [audioPlayback, setAudioPlayback] = useState<string>('default');
  const [videoInputDeviceId, setVideoInputDeviceId] =
    useState<string>('default');

  const [inputDeviceOptions, setInputDeviceOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [outputDeviceOptions, setOutputDeviceOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [videoInputDeviceOptions, setVideoInputDeviceOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const formRef = useRef<MessageFormRef>(null);
  const [comfortStrategyVisible, setComfortStrategyVisible] = useState(false);
  const { uploadFile } = useCozeAPI();
  const isMobile = useIsMobile();
  const [isSampleMode, setIsSampleMode] = useState(isMobile);
  const [liveId, setLiveId] = useState('');

  const checkMicrophonePermission = () => {
    RealtimeUtils.checkDevicePermission(true).then(result => {
      if (result.audio) {
        setMicrophoneStatus('normal');
        if (result.video) {
          localManager.set(LocalStorageKey.ENABLE_VIDEO, 'true');
        } else {
          localManager.set(LocalStorageKey.ENABLE_VIDEO, 'false');
        }
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
        const devices = await RealtimeUtils.getAudioDevices({ video: true });
        const inputDevices = devices.audioInputs.map(device => ({
          label: device.label || `Microphone ${device.deviceId}`,
          value: device.deviceId,
        }));
        const outputDevices = devices.audioOutputs.map(device => ({
          label: device.label || `Speaker ${device.deviceId}`,
          value: device.deviceId,
        }));
        const videoInputDevices = devices.videoInputs.map(device => ({
          label: device.label || `Video Input ${device.deviceId}`,
          value: device.deviceId,
        }));

        setInputDeviceOptions(inputDevices);
        setOutputDeviceOptions(outputDevices);
        setVideoInputDeviceOptions(videoInputDevices);
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
      const type =
        data?.data?.required_action?.submit_tool_outputs?.tool_calls?.[0]?.type;
      if (type === 'reply_message') {
        return;
      }
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

    clientRef.current.on(EventNames.AUDIO_MUTED, () => {
      onToggleMicrophone(false);
    });

    clientRef.current.on(EventNames.AUDIO_UNMUTED, () => {
      onToggleMicrophone(true);
    });

    // 订阅 LIVE_CREATED 事件,获取 live_id
    clientRef.current.on(EventNames.LIVE_CREATED, (_: string, event: any) => {
      if (event?.data?.live_id) {
        setLiveId(event.data.live_id);
      }
    });

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
    localManager.set(LocalStorageKey.NOISE_SUPPRESSION, JSON.stringify(value));
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
      // onToggleMicrophone(!isMicrophoneOn);
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

  // const handleEnableAudioPropertiesReport = () => {
  //   if (!clientRef?.current) {
  //     message.error('Please click Settings to set configuration first');
  //     return;
  //   }
  //   try {
  //     clientRef?.current?.enableAudioPropertiesReport({ interval: 1000 });
  //     message.success('Audio properties reporting enabled');
  //   } catch (error) {
  //     message.error('Failed to enable audio properties reporting');
  //     console.error(error);
  //   }
  // };

  // const handleAudioPlaybackDeviceTest = () => {
  //   if (!clientRef?.current) {
  //     message.error('Please click Settings to set configuration first');
  //     return;
  //   }
  //   if (isAudioPlaybackDeviceTest) {
  //     try {
  //       clientRef.current.stopAudioPlaybackDeviceTest();
  //       setIsAudioPlaybackDeviceTest(false);
  //       message.success('Audio playback device test stopped');
  //     } catch (error) {
  //       message.error('Failed to stop audio playback device test');
  //       console.error(error);
  //     }
  //   } else {
  //     try {
  //       clientRef.current.startAudioPlaybackDeviceTest();
  //       setIsAudioPlaybackDeviceTest(true);
  //       message.success('Audio playback device test started');
  //     } catch (error) {
  //       message.error('Failed to start audio playback device test');
  //       console.error(error);
  //     }
  //   }
  // };

  const handleAudioCaptureChange = (value: string) => {
    setAudioCapture(value);
    clientRef.current?.setAudioInputDevice(value);
  };

  const handleAudioPlaybackChange = (value: string) => {
    setAudioPlayback(value);
    clientRef.current?.setAudioOutputDevice(value);
  };

  const handleVideoInputDeviceChange = async (value: string) => {
    try {
      const isScreenShareDevice = RealtimeUtils.isScreenShareDevice(
        clientRef.current?._config.videoConfig?.videoInputDeviceId,
      );
      const currentIsScreenShareDevice =
        RealtimeUtils.isScreenShareDevice(value);

      if (currentIsScreenShareDevice) {
        localManager.set(LocalStorageKey.VIDEO_INPUT_DEVICE_ID, value);
      } else {
        localManager.remove(LocalStorageKey.VIDEO_INPUT_DEVICE_ID);
      }

      if (isScreenShareDevice !== currentIsScreenShareDevice) {
        window.location.reload();
      } else {
        setVideoInputDeviceId(value);
        await clientRef.current?.setVideoInputDevice(value);
      }
    } catch (error) {
      message.error(`Failed to set video input device: ${error}`);
      console.error(error);
    }
  };

  const handleComfortStrategySubmit = async (
    values: any,
    callback?: (values: any) => void,
  ) => {
    let fileId;
    if (values.comfortStrategy === 'audio') {
      try {
        const res = await uploadFile(values.audioFile.file);
        fileId = res?.id;
        console.log('File uploaded successfully:', res);
      } catch (error) {
        message.error('Failed to upload file');
      }
    }

    const eventData = {
      id: 'event_1',
      event_type: 'session.pre_answer.updated',
      data: {
        pre_answer: {
          type: values.comfortStrategy,
          file_id: fileId,
          pre_answer_list: values.fixedText?.split('\n').filter(Boolean),
          bot_id: values.botId,
        },
        trigger: {
          type: values.triggerStrategy,
          time_after: values.triggerInterval,
        },
      },
    };
    if (callback) {
      callback(eventData);
    } else {
      handleSendMessage({ eventData: JSON.stringify(eventData) });
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
          onClick={handleDisconnect}
          className="button-margin-right"
        >
          Disconnect ({Math.floor(connectLeftTime / 60)}m {connectLeftTime % 60}
          s)
        </Button>
        {isMobile && (
          <Checkbox
            checked={isSampleMode}
            onChange={e => setIsSampleMode(e.target.checked)}
          >
            Sample Mode
          </Checkbox>
        )}
        {!isSampleMode && (
          <>
            <div style={{ marginTop: '10px' }}></div>
            <MessageForm onSubmit={handleSendMessage} ref={formRef} />
            {/* <Button
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
            </Button> */}
            <Button
              type="primary"
              style={{ marginRight: '10px', marginLeft: '10px' }}
              onClick={() => setComfortStrategyVisible(true)}
            >
              Comfort Strategy
            </Button>
            <LiveInfo liveId={liveId} />
            <Row gutter={[16, 16]} justify="center" align="middle">
              <Col xs={24} sm={12} md={8}>
                <div>
                  <Text style={{ marginRight: 8 }}>Capture Device:</Text>
                  <Select
                    style={{ width: '100%' }}
                    value={audioCapture}
                    onChange={handleAudioCaptureChange}
                    options={inputDeviceOptions}
                  />
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div>
                  <Text style={{ marginRight: 8 }}>Playback Device:</Text>
                  <Select
                    style={{ width: '100%' }}
                    value={audioPlayback}
                    onChange={handleAudioPlaybackChange}
                    options={outputDeviceOptions}
                  />
                </div>
              </Col>
              {isShowVideo() && (
                <Col xs={24} sm={12} md={8}>
                  <div>
                    <Text style={{ marginRight: 8 }}>Video Device:</Text>
                    <Select
                      style={{ width: '100%' }}
                      value={videoInputDeviceId}
                      onChange={handleVideoInputDeviceChange}
                      options={videoInputDeviceOptions}
                    />
                  </div>
                </Col>
              )}
            </Row>
            <ComfortStrategyForm
              visible={comfortStrategyVisible}
              onClose={() => setComfortStrategyVisible(false)}
              onSubmit={handleComfortStrategySubmit}
            />
          </>
        )}
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

export default Header;
