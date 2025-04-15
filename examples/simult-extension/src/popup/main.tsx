/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState, useEffect } from 'react';

import ReactDOM from 'react-dom/client';
import {
  ConfigProvider,
  Layout,
  Typography,
  Input,
  Button,
  Space,
  Card,
  Badge,
  Row,
  Col,
  message,
  Modal,
} from 'antd';
import {
  TranslationOutlined,
  AudioOutlined,
  ToolOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  PcmPlayer,
  WsToolsUtils,
  WsSimultInterpretationClient,
} from '@coze/api/ws-tools';
import './popup.css';
import {
  type CommonErrorEvent,
  type SimultInterpretationAudioDeltaEvent,
  type SimultInterpretationTranscriptionDeltaEvent,
  type SimultInterpretationTranslationDeltaEvent,
  WebsocketsEventType,
} from '@coze/api';

import EventInput from './event-input';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const simultUpdate = {
  data: {
    input_audio: {
      format: 'pcm',
      codec: 'pcm',
      sample_rate: 44100,
    },
    output_audio: {
      codec: 'pcm',
      pcm_config: {
        sample_rate: 24000,
      },
      voice_id: '',
    },
    translate_config: {
      from: 'zh',
      to: 'en',
    },
  },
};

// Helper function to check environment
const isExtensionEnvironment = (): boolean =>
  // Check for Chrome extension API
  typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.id;
const Popup: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string>(
    () =>
      // Load from localStorage on initial render
      localStorage.getItem('simult_access_token') || '',
  );
  const [transcriptionText, setTranscriptionText] = useState<string>('');
  const [translationText, setTranslationText] = useState<string>('');
  const pcmPlayerRef = useRef<PcmPlayer>();
  const clientRef = useRef<WsSimultInterpretationClient>();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [version, setVersion] = useState<string>('');

  // Send simultPpe value to background script
  const sendPpeToBackground = () => {
    if (isExtensionEnvironment()) {
      const simultPpe = localStorage.getItem('simultPpe') || '';
      chrome.runtime.sendMessage(
        {
          type: 'UPDATE_PPE',
          value: simultPpe,
        },
        response => {
          console.log('PPE update response:', response);
        },
      );
    }
  };

  // Send PPE value when popup loads
  useEffect(() => {
    sendPpeToBackground();

    // Get extension version from manifest
    if (isExtensionEnvironment()) {
      const manifestData = chrome.runtime.getManifest();
      setVersion(manifestData.version);
    }
  }, []);

  const getMediaStreamTrack = async () => {
    if (!isExtensionEnvironment()) {
      return undefined;
    }
    return new Promise<MediaStreamTrack>((result, reject) => {
      chrome.tabCapture.capture(
        {
          audio: true,
          video: false,
          // 可以指定特定的音频输出设备
          // audioConstraints: {
          //   deviceId: { exact: 特定设备ID }
          // }
        },
        stream => {
          if (stream) {
            result(stream.getAudioTracks()[0]);
          } else {
            reject(new Error('获取媒体流失败'));
          }
        },
      );
    });
  };

  const initClient = async () => {
    if (isExtensionEnvironment()) {
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log('devices', devices);
      // First, request the required permissions through Chrome's permission API
      const permissionResult = await new Promise<boolean>(resolve => {
        chrome.permissions.request(
          {
            permissions: ['tabCapture'],
            origins: ['<all_urls>'],
          },
          granted => {
            if (granted) {
              console.log('Chrome permissions granted');
              resolve(true);
            } else {
              console.error('Chrome permissions denied');
              message.error(
                '麦克风权限未授予，请在浏览器设置中允许扩展使用麦克风',
              );
              resolve(false);
            }
          },
        );
      });

      if (!permissionResult) {
        throw new Error('麦克风权限未授予');
      }
    } else {
      // For non-extension environment
      const permission = await WsToolsUtils.checkDevicePermission();
      if (!permission.audio) {
        message.error('麦克风权限未授予，请在浏览器设置中允许访问麦克风');
        throw new Error('麦克风权限未授予');
      }
    }

    if (!accessToken) {
      message.error('请先配置 Access Token');
      throw new Error('请先配置 Access Token');
    }

    const client = new WsSimultInterpretationClient({
      token: accessToken,
      allowPersonalAccessTokenInBrowser: true,
      debug: true,
      mediaStreamTrack: isExtensionEnvironment()
        ? async () => {
            const tabAudioStream = await getMediaStreamTrack();
            if (!tabAudioStream && isExtensionEnvironment()) {
              message.error('获取标签页音频失败，请确保已授予标签捕获权限');
              throw new Error('获取标签页音频失败');
            }
            return tabAudioStream as MediaStreamTrack;
          }
        : undefined,
    });

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
    });
  };

  // Handle token change and save to localStorage
  const handleTokenChange = (value: string) => {
    setAccessToken(value);
    localStorage.setItem('simult_access_token', value);
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
        await clientRef.current?.start(
          JSON.parse(
            localStorage.getItem('simultUpdate') ||
              JSON.stringify(simultUpdate),
          ),
        );
        pcmPlayerRef.current?.init();
        setTranscriptionText('');
        setTranslationText('');
        setIsRecording(true);
      } else {
        // 停止语音识别
        clientRef.current?.stop();
        pcmPlayerRef.current?.interrupt();
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

  const getStatusColor = () => {
    if (isRecording) {
      return 'processing';
    } else if (isPaused) {
      return 'default';
    } else {
      return 'success';
    }
    //   case '翻译中':
    //     return 'processing';
    //   case '已完成':
    //     return 'success';
    //   default:
    //     return 'default';
    // }
  };

  const handleConfigClick = () => {
    setIsConfigModalOpen(true);
  };

  const handleConfigModalClose = () => {
    setIsConfigModalOpen(false);
    // Send updated PPE value when config modal is closed
    sendPpeToBackground();
  };

  const handleReload = () => {
    if (isExtensionEnvironment()) {
      chrome.runtime.reload();
    }
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#1677ff' } }}>
      <Layout className="popup-layout">
        <Header className="popup-header">
          <Space>
            <TranslationOutlined className="header-icon" />
            <Title level={4} className="header-title">
              同声传译插件{' '}
              {version && <span className="version-text">v{version}</span>}
            </Title>
          </Space>
          <ReloadOutlined className="reload-icon" onClick={handleReload} />
        </Header>
        <Content className="popup-content">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div className="token-section">
              <Text strong>Access Token:</Text>
              <Input
                placeholder="输入您的访问令牌"
                value={accessToken}
                onChange={e => handleTokenChange(e.target.value)}
              />
            </div>

            <Row gutter={16} align="middle" className="control-row">
              <Col span={12}>
                <Space>
                  <Button
                    icon={<ToolOutlined />}
                    onClick={handleConfigClick}
                    size="middle"
                  >
                    配置
                  </Button>
                  <Button
                    type="primary"
                    size="middle"
                    icon={<AudioOutlined />}
                    onClick={handleStartAndStop}
                    disabled={disabled}
                    danger={isRecording}
                  >
                    {isRecording ? '停止' : '开始'}
                  </Button>
                </Space>
              </Col>
              <Col span={12}>
                <div className="status-display">
                  <Text strong>状态:</Text>
                  <Badge
                    status={getStatusColor() as any}
                    text={isRecording ? '进行中' : '暂停'}
                  />
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Card
                  title="原文:"
                  size="small"
                  className="text-card"
                  style={{ padding: '8px' }}
                >
                  <TextArea
                    placeholder="原文..."
                    value={transcriptionText}
                    autoSize={{ minRows: 10, maxRows: 10 }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title="译文:"
                  size="small"
                  className="text-card"
                  style={{ padding: '8px' }}
                >
                  <TextArea
                    placeholder="译文..."
                    value={translationText}
                    readOnly
                    autoSize={{ minRows: 10, maxRows: 10 }}
                  />
                </Card>
              </Col>
            </Row>
          </Space>
        </Content>

        <Modal
          title="配置"
          open={isConfigModalOpen}
          onCancel={handleConfigModalClose}
          footer={[
            <Button key="close" onClick={handleConfigModalClose}>
              关闭
            </Button>,
          ]}
          width={400}
        >
          <EventInput
            defaultValue={
              localStorage.getItem('simultUpdate') ||
              JSON.stringify(simultUpdate, null, 2)
            }
          />
        </Modal>
      </Layout>
    </ConfigProvider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
