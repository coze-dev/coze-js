import React, { useEffect, useRef, useState } from 'react';

import {
  Button,
  Layout,
  Space,
  Typography,
  message,
  Row,
  Col,
  Card,
  Input,
} from 'antd';
import { WsSpeechClient } from '@coze/api/ws-tools';
import {
  SoundOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';

import getConfig from '../../utils/config';
import Settings from '../../components/settings';

const { Paragraph, Text } = Typography;
const { TextArea } = Input;
const localStorageKey = 'realtime-speech-demo';
const config = getConfig(localStorageKey);

const SpeechDemo: React.FC = () => {
  const clientRef = useRef<WsSpeechClient>();
  const [transcriptionText, setTranscriptionText] =
    useState('你好，这是一个文本转语音测试。');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('未开始');

  // 检查令牌
  useEffect(() => {
    const checkRequirements = () => {
      // 检查是否配置了PAT令牌
      const hasConfiguredToken = !!config.getPat();
      setHasToken(hasConfiguredToken);
    };

    checkRequirements();
  }, []);

  // 初始化客户端
  const initClient = () => {
    if (!config.getPat()) {
      throw new Error('请先配置个人访问令牌 -> 右上角 Settings');
    }

    const client = new WsSpeechClient({
      token: config.getPat(),
      baseWsURL: config.getBaseWsUrl(),
      allowPersonalAccessTokenInBrowser: true,
      debug: false,
    });

    // 语音合成完成事件（含中断）
    client.on('completed', () => {
      setIsPlaying(false);
      setIsPaused(false);
      setStatus('已完成');
      console.log('语音合成完成');
    });

    // 注册所有事件
    client.on('data', event => {
      console.log('收到事件', event);
    });

    clientRef.current = client;
  };

  // 整句播放
  const handleAppendAndComplete = async () => {
    try {
      setDisabled(true); // 操作过程中禁用按钮，防止重复点击

      if (!clientRef.current) {
        initClient();
      }

      await clientRef.current?.connect({
        voiceId: config.getVoiceId(), // 可以从配置中获取音色ID
      });

      setIsPlaying(true);
      setIsPaused(false);
      setStatus('播放中');

      // 开始语音合成
      clientRef.current?.appendAndComplete(transcriptionText);
    } catch (error) {
      message.error(`操作失败：${error}`);
      console.error(error);
      setStatus('发生错误');
    } finally {
      setDisabled(false);
    }
  };

  // 流式播放
  const handleAppend = async () => {
    try {
      setDisabled(true);

      if (!clientRef.current) {
        initClient();
      }

      await clientRef.current?.connect({
        voiceId: config.getVoiceId(),
      });

      setIsPlaying(true);
      setIsPaused(false);
      setStatus('流式播放中');

      // 逐字符发送文本
      for (let i = 0; i < transcriptionText.length; i++) {
        clientRef.current?.append(transcriptionText[i]);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // 完成文本输入
      clientRef.current?.complete();
    } catch (error) {
      message.error(`操作失败：${error}`);
      console.error(error);
      setStatus('发生错误');
    } finally {
      setDisabled(false);
    }
  };

  // 中断播放
  const handleInterrupt = async () => {
    try {
      await clientRef.current?.interrupt();
      setIsPlaying(false);
      setIsPaused(false);
      setStatus('已中断');
    } catch (error) {
      message.error(`中断失败：${error}`);
    }
  };

  // 暂停播放
  const handlePause = async () => {
    try {
      await clientRef.current?.pause();
      setIsPaused(true);
      setStatus('已暂停');
    } catch (error) {
      message.error(`暂停失败：${error}`);
    }
  };

  // 恢复播放
  const handleResume = async () => {
    try {
      await clientRef.current?.resume();
      setIsPaused(false);
      setStatus('播放中');
    } catch (error) {
      message.error(`恢复失败：${error}`);
    }
  };

  // 设置变更处理
  const handleSettingsChange = () => {
    window.location.reload();
  };

  // 组件卸载时清理资源
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
          position: 'fixed',
          right: 100,
          top: 15,
          zIndex: 10,
        }}
      />
      <Layout.Content style={{ background: '#fff', padding: '20px' }}>
        {/* 前置条件检查 */}
        <Card title="前置条件检查" style={{ marginBottom: '20px' }}>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <Space>
                <Text strong>个人访问令牌 (PAT)：</Text>
                {hasToken ? (
                  <Text type="success">已配置</Text>
                ) : (
                  <Text type="danger">未配置 - 请在右上角 Settings 中设置</Text>
                )}
              </Space>
            </Col>
            <Col span={24}>
              <Space>
                <Text strong>音色配置：</Text>
                {config.getVoiceId() ? (
                  <Text type="success">已配置 (ID: {config.getVoiceId()})</Text>
                ) : (
                  <Text type="warning">未配置 - 将使用默认音色</Text>
                )}
              </Space>
            </Col>
          </Row>
        </Card>

        {/* 文本输入 */}
        <Card title="文本输入" style={{ marginBottom: '20px' }}>
          <TextArea
            rows={4}
            value={transcriptionText}
            onChange={e => setTranscriptionText(e.target.value)}
            placeholder="请输入要转换为语音的文本"
            style={{ marginBottom: '16px' }}
          />
        </Card>

        {/* 播放控制 */}
        <Card title="播放控制" style={{ marginBottom: '20px' }}>
          <Row justify="start" style={{ marginBottom: '16px' }}>
            <Col>
              <Text>
                当前状态: <Text strong>{status}</Text>
              </Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col>
              <Button
                type="primary"
                icon={<SoundOutlined />}
                disabled={disabled || !hasToken || (isPlaying && !isPaused)}
                onClick={handleAppendAndComplete}
                size="large"
              >
                整句播放
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<SoundOutlined />}
                disabled={disabled || !hasToken || (isPlaying && !isPaused)}
                onClick={handleAppend}
                size="large"
              >
                流式播放
              </Button>
            </Col>
            {isPlaying && (
              <>
                <Col>
                  <Button
                    icon={<StopOutlined />}
                    onClick={handleInterrupt}
                    size="large"
                    disabled={!isPlaying}
                  >
                    中断
                  </Button>
                </Col>
                <Col>
                  <Button
                    icon={isPaused ? <PlayCircleOutlined /> : <PauseOutlined />}
                    onClick={isPaused ? handleResume : handlePause}
                    size="large"
                    disabled={!isPlaying}
                  >
                    {isPaused ? '恢复' : '暂停'}
                  </Button>
                </Col>
              </>
            )}
          </Row>
        </Card>

        {/* 使用说明 */}
        <Card title="使用说明" style={{ marginTop: '20px' }}>
          <Paragraph>
            <ol>
              <li>在右上角 Settings 中配置个人访问令牌 (PAT)</li>
              <li>可选：在 Settings 中配置音色 ID</li>
              <li>在"文本输入"区域输入要转换为语音的文本</li>
              <li>
                选择播放方式：
                <ul>
                  <li>
                    <strong>整句播放</strong>：一次性将全部文本转换为语音
                  </li>
                  <li>
                    <strong>流式播放</strong>：逐字符转换，模拟实时生成效果
                  </li>
                </ul>
              </li>
              <li>播放过程中可以使用"暂停"、"恢复"和"中断"按钮控制播放</li>
            </ol>
          </Paragraph>
        </Card>
      </Layout.Content>
    </Layout>
  );
};

export default SpeechDemo;
