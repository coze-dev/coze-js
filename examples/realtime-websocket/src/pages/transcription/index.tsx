import React, { useRef, useState } from 'react';

import { Button, Layout, message, Modal, Row } from 'antd';
import { WsToolsUtils, WsTranscriptionClient } from '@coze/api/ws-tools';
import {
  type CommonErrorEvent,
  type TranscriptionsMessageUpdateEvent,
  WebsocketsEventType,
} from '@coze/api';
import { AudioOutlined } from '@ant-design/icons';

import getConfig from '../../utils/config';
import Settings from '../../components/settings';
import {
  AudioConfig,
  type AudioConfigRef,
} from '../../components/audio-config';
const localStorageKey = 'realtime-quickstart-transcription';
const config = getConfig(localStorageKey);

const Transcription: React.FC = () => {
  const clientRef = useRef<WsTranscriptionClient>();
  const [isRecording, setIsRecording] = useState(false); // 是否正在语音识别
  const [isPaused, setIsPaused] = useState(false); // 是否暂停语音识别
  const [transcriptionText, setTranscriptionText] = useState(''); // 语音识别结果（文本）
  const [disabled, setDisabled] = useState(false); // 是否禁用按钮
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false); // 是否打开配置弹窗
  const audioConfigRef = useRef<AudioConfigRef>(null);

  const initClient = async () => {
    const permission = await WsToolsUtils.checkDevicePermission();
    if (!permission.audio) {
      message.error('麦克风权限未开启');
      return;
    }

    const audioConfig = audioConfigRef.current?.getSettings();

    const client = new WsTranscriptionClient({
      token: config.getPat(),
      baseWsURL: config.getBaseWsUrl(),
      allowPersonalAccessTokenInBrowser: true,
      debug: audioConfig?.debug,
      aiDenoisingConfig: !audioConfig?.noiseSuppression
        ? {
            mode: audioConfig?.denoiseMode,
            level: audioConfig?.denoiseLevel,
            assetsPath:
              'https://lf3-static.bytednsdoc.com/obj/eden-cn/613eh7lpqvhpeuloz/websocket',
          }
        : undefined,
      audioCaptureConfig: {
        echoCancellation: audioConfig?.echoCancellation,
        noiseSuppression: audioConfig?.noiseSuppression,
        autoGainControl: audioConfig?.autoGainControl,
      },
    });

    // 如果降噪未开启，且当前浏览器不支持降噪，则提示用户
    if (
      !audioConfig?.noiseSuppression &&
      !WsToolsUtils.checkDenoiserSupport()
    ) {
      message.info('当前浏览器不支持降噪');
    }

    // 语音识别结果
    client.on(
      WebsocketsEventType.TRANSCRIPTIONS_MESSAGE_UPDATE,
      (event: unknown) => {
        setTranscriptionText(
          (event as TranscriptionsMessageUpdateEvent).data.content,
        );
      },
    );

    // 错误事件
    client.on(WebsocketsEventType.ERROR, (error: unknown) => {
      console.error(error);
      message.error((error as CommonErrorEvent).data.msg);
    });

    // 注册所有事件
    client.on(WebsocketsEventType.ALL, (event: unknown) => {
      console.log('receive event', event);
    });

    clientRef.current = client;
  };

  const handleStartAndStop = async () => {
    try {
      setDisabled(true); // 操作过程中中，禁用按钮操作，防止重复点击

      if (!clientRef.current) {
        await initClient();
      }

      if (!isRecording) {
        // 开始语音识别
        await clientRef.current?.start();
        setTranscriptionText('');
        setIsRecording(true);
      } else {
        // 停止语音识别
        await clientRef.current?.stop();
        setIsRecording(false);
        setIsPaused(false);
      }
    } catch (error) {
      message.error(`操作失败：${error}`);
      console.error(error);
      setIsRecording(false);
    } finally {
      setDisabled(false);
    }
  };

  const handlePauseAndResume = () => {
    try {
      if (clientRef.current?.getStatus() === 'paused') {
        clientRef.current?.resume();
        setIsPaused(false);
      } else {
        clientRef.current?.pause();
        setIsPaused(true);
      }
    } catch (error) {
      message.error(`Failed to toggle pause/resume: ${error}`);
    }
  };

  const handleSettingsChange = () => {
    window.location.reload();
  };

  return (
    <Layout style={{ height: '100%' }}>
      <Settings
        onSettingsChange={handleSettingsChange}
        localStorageKey={localStorageKey}
        fields={['base_ws_url', 'pat']}
        style={{
          position: 'absolute',
          right: 100,
          top: 15,
          zIndex: 10,
        }}
      />
      <Layout.Content style={{ background: '#fff' }}>
        <Row justify="center" style={{ marginTop: '16px', gap: 10 }}>
          <Button onClick={() => setIsConfigModalOpen(true)}>配置</Button>
          <Button
            type="primary"
            icon={<AudioOutlined />}
            disabled={disabled}
            onClick={handleStartAndStop}
            danger={isRecording}
          >
            {isRecording ? '停止识别' : '开始识别'}
          </Button>
          {isRecording && (
            <Button onClick={handlePauseAndResume}>
              {isPaused ? '恢复识别' : '暂停识别'}
            </Button>
          )}
        </Row>
        <Row justify="center" style={{ marginTop: '10px' }}>
          <div>识别结果：{transcriptionText}</div>
        </Row>
        <Modal
          title="音频配置"
          open={isConfigModalOpen}
          onCancel={() => setIsConfigModalOpen(false)}
          footer={null}
          destroyOnClose={false}
          forceRender
        >
          <AudioConfig clientRef={clientRef} ref={audioConfigRef} />
        </Modal>
      </Layout.Content>
    </Layout>
  );
};

export default Transcription;
