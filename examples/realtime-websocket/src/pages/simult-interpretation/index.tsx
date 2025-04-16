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
} from 'antd';
import {
  WsToolsUtils,
  AIDenoiserProcessorMode,
  AIDenoiserProcessorLevel,
  WsSimultInterpretationClient,
  PcmPlayer,
} from '@coze/api/ws-tools';
import {
  type CommonErrorEvent,
  type SimultInterpretationAudioDeltaEvent,
  type SimultInterpretationTranscriptionDeltaEvent,
  type SimultInterpretationTranslationDeltaEvent,
  WebsocketsEventType,
} from '@coze/api';
import {
  AudioOutlined,
  PauseOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';

import getConfig from '../../utils/config';
import Settings from '../../components/settings';

const { Paragraph, Text } = Typography;
const localStorageKey = 'realtime-simult-interpretation-demo';
const config = getConfig(localStorageKey);

const SimultInterpretationDemo: React.FC = () => {
  const clientRef = useRef<WsSimultInterpretationClient>();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('未开始');
  const pcmPlayerRef = useRef<PcmPlayer>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [translationText, setTranslationText] = useState('');

  // 检查权限和令牌
  useEffect(() => {
    const checkRequirements = async () => {
      // 检查麦克风权限
      const permission = await WsToolsUtils.checkDevicePermission();
      setHasPermission(permission.audio);

      // 检查是否配置了PAT令牌
      const hasConfiguredToken = !!config.getPat();
      setHasToken(hasConfiguredToken);
    };

    checkRequirements();
  }, []);

  useEffect(
    () => () => {
      clientRef.current?.destroy();
      pcmPlayerRef.current?.destroy();
    },
    [],
  );

  // 检查降噪支持
  const denoiserSupported = WsToolsUtils.checkDenoiserSupport();

  // 初始化客户端
  const initClient = () => {
    if (!hasPermission) {
      throw new Error('麦克风权限未授予');
    }

    if (!config.getPat()) {
      throw new Error('请先配置个人访问令牌 -> 右上角 Settings');
    }

    const client = new WsSimultInterpretationClient({
      token: config.getPat(),
      baseWsURL: config.getBaseWsUrl(),
      allowPersonalAccessTokenInBrowser: true,
      debug: true,
      // AI降噪配置 - 仅当浏览器支持并且选择使用时开启
      aiDenoisingConfig: denoiserSupported
        ? {
            mode: AIDenoiserProcessorMode.NSNG, // AI降噪模式
            level: AIDenoiserProcessorLevel.SOFT, // 舒缓降噪
            assetsPath:
              'https://lf3-static.bytednsdoc.com/obj/eden-cn/613eh7lpqvhpeuloz/websocket',
          }
        : undefined,
      // 音频捕获配置
      audioCaptureConfig: {
        echoCancellation: true,
        noiseSuppression: !denoiserSupported, // 如果支持AI降噪，则禁用浏览器内置降噪
        autoGainControl: true,
      },
    });

    // 如果使用AI降噪但浏览器不支持，则提示用户
    if (!denoiserSupported) {
      message.info('当前浏览器不支持AI降噪，将使用浏览器内置降噪');
    }

    // 监听转录结果更新
    client.on(
      WebsocketsEventType.SIMULT_INTERPRETATION_TRANSCRIPTION_DELTA,
      (event: unknown) => {
        setTranscriptionText(prev => {
          const { delta } = (
            event as SimultInterpretationTranscriptionDeltaEvent
          ).data;
          return prev + delta;
        });
      },
    );

    // 监听错误事件
    client.on(WebsocketsEventType.ERROR, (error: unknown) => {
      console.error(error);
      message.error((error as CommonErrorEvent).data.msg);
    });

    // 监听所有事件（用于调试）
    client.on(WebsocketsEventType.ALL, (event: unknown) => {
      console.log('收到事件', event);
    });

    // 监听翻译后音频数据
    client.on(
      WebsocketsEventType.SIMULT_INTERPRETATION_AUDIO_DELTA,
      (event: unknown) => {
        const { delta } = (event as SimultInterpretationAudioDeltaEvent).data;
        pcmPlayerRef.current?.append(delta);
      },
    );

    // 监听翻译后文本数据
    client.on(
      WebsocketsEventType.SIMULT_INTERPRETATION_TRANSLATION_DELTA,
      (event: unknown) => {
        const { delta } = (event as SimultInterpretationTranslationDeltaEvent)
          .data;
        setTranslationText(prev => prev + delta);
      },
    );

    clientRef.current = client;

    // 初始化 PCM 播放器
    pcmPlayerRef.current = new PcmPlayer({
      onCompleted: () => {
        console.log('播放完成');
      },
      isPauseDefault: true,
    });

    pcmPlayerRef.current.init();
  };

  // 开始/停止录音
  const handleStartAndStop = async () => {
    try {
      setDisabled(true); // 操作过程中禁用按钮，防止重复点击

      if (!clientRef.current) {
        await initClient();
      }

      if (!isRecording) {
        // 开始语音识别
        await clientRef.current?.start();
        setTranscriptionText('');
        setTranslationText('');
        setIsRecording(true);
        setStatus('录音中');
      } else {
        // 停止语音识别
        await clientRef.current?.stop();
        setIsRecording(false);
        setIsPaused(false);
        setStatus('已停止');
      }
    } catch (error) {
      message.error(`操作失败：${error}`);
      console.error(error);
      setIsRecording(false);
      setStatus('发生错误');
    } finally {
      setDisabled(false);
    }
  };

  // 暂停/恢复录音
  const handlePauseAndResume = () => {
    try {
      if (clientRef.current?.getStatus() === 'paused') {
        clientRef.current?.resume();
        setIsPaused(false);
        setStatus('录音中');
      } else {
        clientRef.current?.pause();
        setIsPaused(true);
        setStatus('已暂停');
      }
    } catch (error) {
      message.error(`暂停/恢复失败: ${error}`);
    }
  };

  const handleResume = () => {
    pcmPlayerRef.current?.resume();
    setIsPlaying(true);
  };

  const handlePause = () => {
    pcmPlayerRef.current?.pause();
    setIsPlaying(false);
  };
  // 设置变更处理
  const handleSettingsChange = () => {
    window.location.reload();
  };

  return (
    <Layout style={{ height: '100%' }}>
      <Settings
        onSettingsChange={handleSettingsChange}
        localStorageKey={localStorageKey}
        fields={['base_ws_url', 'pat']}
        className="settings-button"
      />
      <Layout.Content style={{ background: '#fff', padding: '20px' }}>
        {/* 前置条件检查 */}
        <Card title="前置条件检查" style={{ marginBottom: '20px' }}>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <Space>
                <Text strong>麦克风权限：</Text>
                {hasPermission === null ? (
                  <Text type="warning">正在检查...</Text>
                ) : hasPermission ? (
                  <Text type="success">已授权</Text>
                ) : (
                  <Text type="danger">未授权 - 请允许浏览器使用麦克风</Text>
                )}
              </Space>
            </Col>
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
                <Text strong>AI降噪支持：</Text>
                {denoiserSupported ? (
                  <Text type="success">支持</Text>
                ) : (
                  <Text type="warning">不支持 - 将使用浏览器内置降噪</Text>
                )}
              </Space>
            </Col>
          </Row>
        </Card>

        {/* 录音控制 */}
        <Card title="录音控制" style={{ marginBottom: '20px' }}>
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
                icon={<AudioOutlined />}
                disabled={disabled || !hasPermission || !hasToken}
                onClick={handleStartAndStop}
                danger={isRecording}
                size="large"
              >
                {isRecording ? '停止录音' : '开始录音'}
              </Button>
            </Col>
            {isRecording && (
              <Col>
                <Button
                  icon={isPaused ? <PlayCircleOutlined /> : <PauseOutlined />}
                  onClick={handlePauseAndResume}
                  size="large"
                >
                  {isPaused ? '恢复录音' : '暂停录音'}
                </Button>
              </Col>
            )}
          </Row>
        </Card>

        {/* 识别结果 */}
        <Card title="识别结果" style={{ minHeight: '120px' }}>
          <Paragraph>
            {transcriptionText || <Text type="secondary">等待识别结果...</Text>}
          </Paragraph>
          <Paragraph>
            {translationText || <Text type="secondary">等待翻译结果...</Text>}
          </Paragraph>
          <Row gutter={16} justify="start" align="middle">
            <Col>
              <Button
                icon={isPlaying ? <PlayCircleOutlined /> : <PauseOutlined />}
                onClick={isPlaying ? handlePause : handleResume}
                size="large"
              >
                {isPlaying ? '暂停' : '播放'}
              </Button>
            </Col>
            <Col>
              <Text>
                当前状态: <Text strong>{isPlaying ? '播放中' : '已暂停'}</Text>
              </Text>
            </Col>
          </Row>
        </Card>

        {/* 使用说明 */}
        <Card title="使用说明" style={{ marginTop: '20px' }}>
          <Paragraph>
            <ol>
              <li>确保授予浏览器麦克风访问权限</li>
              <li>在右上角 Settings 中配置个人访问令牌 (PAT)</li>
              <li>点击"开始录音"按钮开始语音识别</li>
              <li>说话时，实时识别结果将显示在"识别结果"区域</li>
              <li>可以使用"暂停录音"按钮暂时停止录音（保持上下文）</li>
              <li>完成后点击"停止录音"按钮结束会话</li>
            </ol>
          </Paragraph>
        </Card>
      </Layout.Content>
    </Layout>
  );
};

export default SimultInterpretationDemo;
