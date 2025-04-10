import React, { useEffect, useRef, useState } from 'react';

import TextArea from 'antd/es/input/TextArea';
import { Button, Layout, message, Row } from 'antd';
import { WsSpeechClient } from '@coze/api/ws-tools';

import getConfig from '../../utils/config';
import Settings from '../../components/settings';
const localStorageKey = 'realtime-quickstart-transcription';
const config = getConfig(localStorageKey);

const Speech: React.FC = () => {
  const clientRef = useRef<WsSpeechClient>();
  const [transcriptionText, setTranscriptionText] =
    useState('你好，请问有什么需要帮助？'); // 语音合成文本
  const [disabled, setDisabled] = useState(false); // 是否禁用按钮
  const [isCompleted, setIsCompleted] = useState(true); // 是否完成语音合成
  const [isPaused, setIsPaused] = useState(false); // 是否暂停语音合成

  const initClient = () => {
    if (!config.getPat()) {
      throw new Error('请先配置个人访问令牌 -> 右上角 Settings');
    }

    const client = new WsSpeechClient({
      token: config.getPat(),
      baseWsURL: config.getBaseWsUrl(),
      allowPersonalAccessTokenInBrowser: true,
      debug: true,
    });

    // 语音合成完成事件（含中断）
    client.on('completed', () => {
      setIsCompleted(true);
      setIsPaused(false);
    });

    // 注册所有事件
    client.on('data', (event: unknown) => {
      console.log('receive event', event);
    });

    clientRef.current = client;
  };

  const handleAppendAndComplete = async () => {
    try {
      setDisabled(true); // 操作过程中中，禁用按钮操作，防止重复点击

      if (!clientRef.current) {
        await initClient();
      }

      await clientRef.current?.connect();
      setIsCompleted(false);
      setIsPaused(false);
      // 开始语音合成
      clientRef.current?.appendAndComplete(transcriptionText);
    } catch (error) {
      message.error(`操作失败：${error}`);
      console.error(error);
    } finally {
      setDisabled(false);
    }
  };

  const handleAppend = async () => {
    if (!clientRef.current) {
      await initClient();
    }

    setIsCompleted(false);
    setIsPaused(false);
    await clientRef.current?.connect();
    for (let i = 0; i < transcriptionText.length; i++) {
      console.log('send delta text', transcriptionText[i]);
      clientRef.current?.append(transcriptionText[i]);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    clientRef.current?.complete();
  };

  const handleInterrupt = async () => {
    await clientRef.current?.interrupt();
    setIsCompleted(true);
  };

  const handlePause = async () => {
    await clientRef.current?.pause();
    setIsPaused(true);
  };

  const handleResume = async () => {
    await clientRef.current?.resume();
    setIsPaused(false);
  };

  const handleSettingsChange = () => {
    window.location.reload();
  };

  useEffect(
    () => () => {
      clientRef.current?.disconnect();
    },
    [],
  );

  return (
    <Layout style={{ height: '100%' }}>
      <Settings
        onSettingsChange={handleSettingsChange}
        localStorageKey={localStorageKey}
        fields={['base_ws_url', 'pat', 'voice_id']}
        style={{
          position: 'absolute',
          right: 100,
          top: 15,
          zIndex: 10,
        }}
      />
      <Layout.Content style={{ background: '#fff' }}>
        <Row justify="center" style={{ margin: '16px', gap: 10 }}>
          <TextArea
            rows={4}
            value={transcriptionText}
            onChange={e => setTranscriptionText(e.target.value)}
          />
          <Button
            type="primary"
            disabled={disabled || !isCompleted || isPaused}
            onClick={handleAppendAndComplete}
          >
            整句播放
          </Button>
          <Button
            type="primary"
            disabled={disabled || !isCompleted || isPaused}
            onClick={handleAppend}
          >
            流式播放
          </Button>
          <Button disabled={isCompleted} onClick={handleInterrupt}>
            中断
          </Button>
          <Button disabled={isCompleted || isPaused} onClick={handlePause}>
            暂停
          </Button>
          <Button disabled={isCompleted || !isPaused} onClick={handleResume}>
            恢复
          </Button>
        </Row>
      </Layout.Content>
    </Layout>
  );
};

export default Speech;
