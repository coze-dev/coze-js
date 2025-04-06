/* eslint-disable */
import { useRef, useState, useEffect } from 'react';
import { RealtimeUtils } from '@coze/realtime-api';
import { Button, Space, message, Select, List } from 'antd';
import { PcmRecorder } from '@coze/api/ws-tools';
import { AudioConfig, AudioConfigRef } from '../../components/audio-config';

function WS() {
  const clientRef = useRef<PcmRecorder>();
  // 是否已连接
  const [isRecording, setIsRecording] = useState(false);

  const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedInputDevice, setSelectedInputDevice] = useState<string>('');
  const [audioList, setAudioList] = useState<
    {
      label: string;
      url: string;
    }[]
  >([]);
  const audioElement = useRef<HTMLAudioElement>(null);
  const settingsRef = useRef<AudioConfigRef>(null);

  useEffect(() => {
    const getDevices = async () => {
      const devices = await RealtimeUtils.getAudioDevices();
      setInputDevices(devices.audioInputs);
      if (devices.audioInputs.length > 0) {
        setSelectedInputDevice(devices.audioInputs[0].deviceId);
      }
      console.log(devices.audioOutputs);
    };

    getDevices();
  }, []);

  const getAudioTrack = async (
    audioElement: HTMLAudioElement,
  ): Promise<MediaStreamTrack> => {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    // 创建音频源
    const source = audioContext.createMediaElementSource(audioElement);

    // 创建 MediaStreamDestination
    const destination = audioContext.createMediaStreamDestination();

    // 连接节点
    source.connect(destination);
    source.connect(audioContext.destination); // 保持原有播放功能

    // 获取 AudioMediaTrack
    const audioTrack = destination.stream.getAudioTracks()[0];

    return audioTrack;
  };

  async function initClient() {
    // 从 audio 元素获取 MediaStreamTrack
    // const stream = (audioElement.current as any)?.captureStream();
    const audioTrack = await getAudioTrack(audioElement.current as any);

    // const audioTrack = stream?.getAudioTracks()[0];
    const {
      denoiseMode,
      denoiseLevel,
      noiseSuppression,
      echoCancellation,
      autoGainControl,
      debug,
    } = settingsRef.current?.getSettings() || {};
    clientRef.current = new PcmRecorder({
      mediaStreamTrack: audioTrack,
      debug,
      audioCaptureConfig: {
        noiseSuppression,
        echoCancellation,
        autoGainControl,
      },
      // 自带的噪声抑制和 AI 降噪是互斥的
      aiDenoisingConfig: !noiseSuppression
        ? {
            mode: denoiseMode,
            level: denoiseLevel,
            assetsPath:
              'https://lf3-static.bytednsdoc.com/obj/eden-cn/613eh7lpqvhpeuloz/websocket',
          }
        : undefined,
      wavRecordConfig: {
        enableSourceRecord: true,
        enableDenoiseRecord: true,
      },
    });
  }

  const handleStart = async () => {
    try {
      if (clientRef.current) {
        clientRef.current.destroy();
      }
      await initClient();

      await clientRef.current?.start();
      await clientRef.current?.record({
        wavAudioCallback: (blob, name) => {
          const audioUrl = URL.createObjectURL(blob);
          setAudioList(prev => [...prev, { label: name, url: audioUrl }]);
        },
      });

      // 播放音频
      audioElement.current?.play();
    } catch (error) {
      console.error(error);
      message.error('错误：' + (error as Error).message);
    }
  };

  const handleStop = () => {
    try {
      clientRef.current?.pause();
      setIsRecording(false);
      // 停止播放音频
      audioElement.current?.pause();
    } catch (error) {
      message.error('失败：' + error);
    }
  };

  const handleSetAudioInputDevice = async (deviceId: string) => {
    try {
      if (clientRef.current) {
        clientRef.current.config.deviceId = deviceId;
        await clientRef.current.start();
      }
      setSelectedInputDevice(deviceId);
    } catch (error) {
      message.error('设置音频输入设备失败：' + error);
    }
  };

  const handleDump = () => {
    clientRef.current?.dump();
  };

  return (
    <div style={{ padding: '20px' }}>
      <AudioConfig clientRef={clientRef} ref={settingsRef} />
      <br />
      <Space style={{ padding: '10px' }}>
        <Button
          type="primary"
          disabled={isRecording}
          onClick={() => {
            handleStart().finally(() => {
              setIsRecording(true);
            });
          }}
        >
          Start Recording
        </Button>
        <Button disabled={!isRecording} onClick={handleStop}>
          Stop Recording
        </Button>
        <Button onClick={handleDump}>Dump</Button>
      </Space>
      <br />
      <Space style={{ padding: '10px' }}>
        <audio ref={audioElement} src={'/test.wav'} controls />
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
      </Space>
      <br />
      <Space direction="vertical">
        <Space>
          <div
            style={{
              marginTop: '20px',
              padding: '20px',
              maxHeight: '600px',
              width: '500px',
              overflowY: 'auto',
              border: '1px solid #ccc',
            }}
          >
            <h3>音频列表</h3>
            <List
              dataSource={audioList}
              renderItem={(audio, index) => (
                <List.Item key={index} style={{ textAlign: 'left' }}>
                  <Space>
                    <span>
                      {audio.label === 'source' ? '源音频：' : '降噪后：'}
                    </span>
                    <audio src={audio.url} controls />
                  </Space>
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
