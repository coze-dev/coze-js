import React, { useState, useEffect } from 'react';

import Link from 'antd/es/typography/Link';
import {
  FormInstance,
  Layout,
  Button,
  Modal,
  Input,
  Typography,
  message,
  Form,
  Dropdown,
  Menu,
  Select,
  Badge,
  Space,
  Row,
  Col,
  Empty,
  Avatar,
} from 'antd';
import {
  SettingOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  RobotOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import logo from './logo.svg';
import {
  CozeAPI,
  getPKCEAuthenticationUrl,
  getPKCEOAuthToken,
  OAuthToken,
  refreshOAuthToken,
} from '@coze/api';
import {
  fetchAllWorkspaces,
  fetchAllVoices,
  fetchAllBots,
  WorkspaceOption,
  BotOption,
  VoiceOption,
} from './net';
const { Header } = Layout;
const { Text } = Typography;

interface SettingsProps {
  onSaveSettings: () => void;
}

const DOCS_URL =
  'https://bytedance.larkoffice.com/docx/FQJ9dvBE7oLzu3xtacJc6Cyjnof';

const DEFAULT_OAUTH_CLIENT_ID = '30367348905137699749500653976611.app.coze';

const WorkspaceSelect: React.FC<{
  workspaces: WorkspaceOption[];
  loading: boolean;
  onChange: (value: string) => void;
  value?: string;
}> = ({ workspaces, loading, onChange, value }) => {
  return (
    <Select
      placeholder="Select a workspace"
      onChange={onChange}
      loading={loading}
      value={value}
    >
      {workspaces.map(workspace => (
        <Select.Option key={workspace.value} value={workspace.value}>
          {workspace.label}
        </Select.Option>
      ))}
    </Select>
  );
};

const BotSelect: React.FC<{
  bots: BotOption[];
  loading: boolean;
  disabled: boolean;
  value?: string;
  onChange?: (value: string) => void;
}> = ({ bots, loading, disabled, value, onChange }) => {
  return (
    <Select
      placeholder="Select a bot"
      disabled={disabled}
      value={value}
      onChange={onChange}
      loading={loading}
      notFoundContent={
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Space direction="vertical" align="center">
              <InfoCircleOutlined style={{ fontSize: '24px', color: '#999' }} />
              <Text type="secondary">
                No bots found in this workspace. Please create a bot first.
              </Text>
            </Space>
          }
        />
      }
    >
      {bots.map(bot => (
        <Select.Option key={bot.value} value={bot.value}>
          <Space align="center">
            {bot.avatar ? (
              <Avatar size="small" src={bot.avatar} />
            ) : (
              <RobotOutlined style={{ fontSize: '16px' }} />
            )}
            {bot.label}
          </Space>
        </Select.Option>
      ))}
    </Select>
  );
};

const VoiceSelect: React.FC<{
  voices: VoiceOption[];
  loading: boolean;
  value?: string;
  onChange?: (value: string) => void;
}> = ({ voices, loading, value, onChange }) => {
  const [audioPlayer] = useState(new Audio());

  const handlePreview = (previewUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioPlayer.src === previewUrl) {
      if (audioPlayer.paused) {
        audioPlayer.play();
      } else {
        audioPlayer.pause();
      }
    } else {
      audioPlayer.src = previewUrl;
      audioPlayer.play();
    }
  };

  useEffect(() => {
    return () => {
      audioPlayer.pause();
      audioPlayer.src = '';
    };
  }, [audioPlayer]);

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder="Select a voice"
      allowClear
      style={{ width: '100%' }}
      loading={loading}
    >
      {voices.map(voice => (
        <Select.Option key={voice.value} value={voice.value}>
          <Space>
            {voice.name} ({voice.language_name})
            <Badge
              count={voice.is_system_voice ? 'System' : 'Custom'}
              style={{
                backgroundColor: voice.is_system_voice ? '#87d068' : '#108ee9',
              }}
            />
            {voice.preview_url && (
              <PlayCircleOutlined
                onClick={e => handlePreview(voice.preview_url!, e)}
              />
            )}
          </Space>
        </Select.Option>
      ))}
    </Select>
  );
};

const Settings: React.FC<SettingsProps> = ({ onSaveSettings }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [workspaces, setWorkspaces] = useState<WorkspaceOption[]>([]);
  const [bots, setBots] = useState<BotOption[]>([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [loadingBots, setLoadingBots] = useState(false);
  const baseURL = localStorage.getItem('baseURL') || 'https://api.coze.cn';
  const [api, setApi] = useState<CozeAPI | null>(
    accessToken
      ? new CozeAPI({
          token: accessToken,
          baseURL,
          allowPersonalAccessTokenInBrowser: true,
        })
      : null,
  );

  const setToken = (token: OAuthToken) => {
    localStorage.setItem('accessToken', token.access_token);
    localStorage.setItem('refreshToken', token.refresh_token);
    localStorage.setItem(
      'tokenExpiresAt',
      (token.expires_in * 1000).toString(),
    );
    setAccessToken(token.access_token);
    setApi(
      new CozeAPI({
        token: token.access_token,
        baseURL,
        allowPersonalAccessTokenInBrowser: true,
      }),
    );
  };

  const getOrRefreshToken = async (): Promise<string> => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const codeVerifier = localStorage.getItem('pkce_code_verifier');

    if (code && codeVerifier) {
      // pkce flow
      const token = await exchangeCodeForToken(code, codeVerifier);
      if (token) {
        setToken(token);
        return token.access_token;
      }
      return '';
    } else if (
      storedRefreshToken &&
      tokenExpiresAt &&
      Date.now() >= parseInt(tokenExpiresAt)
    ) {
      // refresh token
      try {
        const refreshedToken = await refreshOAuthToken({
          baseURL,
          clientId: DEFAULT_OAUTH_CLIENT_ID,
          refreshToken: storedRefreshToken,
          clientSecret: '',
        });

        setToken(refreshedToken);
        return refreshedToken.access_token;
      } catch (error) {
        message.error('Failed to refresh token');
        console.error(error);
        return '';
      }
    } else if (storedAccessToken) {
      // no refresh token, use access token
      setAccessToken(storedAccessToken);
      return storedAccessToken;
    } else {
      // no tokens
      return '';
    }
  };

  const loadData = async (
    api: CozeAPI,
    form: FormInstance<any>,
    objectName: string,
    dataLocalKey: string,
    setLoading: (loading: boolean) => void,
    setData: (data: any[]) => void,
    fetchData: (api: CozeAPI, id?: string) => Promise<any[]>,
    parentId?: string,
  ): Promise<void> => {
    setLoading(true);
    try {
      const data = await fetchData(api, parentId);

      // if no data in localStorage, set the first data as default
      const storedData = localStorage.getItem(dataLocalKey);
      if (!storedData && data.length > 0) {
        const firstData = data[0].value;
        localStorage.setItem(dataLocalKey, firstData);
        form.setFieldsValue({ [dataLocalKey]: firstData });
      }
      setData(data);
    } catch (error) {
      message.error('Failed to load ' + objectName);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkspaceChange =
    (api: CozeAPI | null) => (workspaceId: string) => {
      if (!api) {
        return;
      }

      setSelectedWorkspace(workspaceId);
      localStorage.setItem('workspaceId', workspaceId);
      form.setFieldsValue({ botId: undefined });

      loadData(
        api,
        form,
        'Bots',
        'botId',
        setLoadingBots,
        setBots,
        fetchAllBots,
        workspaceId,
      );
    };

  useEffect(() => {
    (async () => {
      const accessToken = await getOrRefreshToken();

      if (accessToken) {
        const api = new CozeAPI({
          token: accessToken,
          baseURL,
          allowPersonalAccessTokenInBrowser: true,
        });
        setApi(api);

        loadData(
          api,
          form,
          'Voices',
          'voiceId',
          setLoadingVoices,
          setVoices,
          fetchAllVoices,
        );

        loadData(
          api,
          form,
          'Workspaces',
          'workspaceId',
          setLoadingWorkspaces,
          setWorkspaces,
          fetchAllWorkspaces,
        );

        const workspaceId = localStorage.getItem('workspaceId');
        if (workspaceId) {
          loadData(
            api,
            form,
            'Bots',
            'botId',
            setLoadingBots,
            setBots,
            fetchAllBots,
            workspaceId,
          );
        }
      }

      form.setFieldsValue({
        workspaceId: localStorage.getItem('workspaceId') || '',
        botId: localStorage.getItem('botId') || '',
        voiceId:
          localStorage.getItem('voiceId') ||
          (voices.length > 0 ? voices[0].value : ''),
        baseURL: localStorage.getItem('baseURL') || 'https://api.coze.cn',
      });
    })();
  }, [form]);

  const exchangeCodeForToken = async (
    code: string,
    codeVerifier: string,
  ): Promise<OAuthToken | null> => {
    try {
      const token = await getPKCEOAuthToken({
        code,
        baseURL: localStorage.getItem('baseURL') || 'https://api.coze.cn',
        clientId: DEFAULT_OAUTH_CLIENT_ID,
        redirectUrl: window.location.origin,
        codeVerifier,
      });

      setToken(token);

      window.history.replaceState({}, document.title, window.location.pathname);
      localStorage.removeItem('pkce_code_verifier');

      message.success('Successfully obtained access token');
      return token;
    } catch (error) {
      message.error('Failed to exchange code for token');
      console.error(error);
      return null;
    }
  };

  const initPKCEFlow = async () => {
    try {
      const pkceAuth = await getPKCEAuthenticationUrl({
        baseURL: localStorage.getItem('baseURL') || 'https://api.coze.cn',
        clientId: DEFAULT_OAUTH_CLIENT_ID,
        redirectUrl: window.location.origin,
      });
      localStorage.setItem('pkce_code_verifier', pkceAuth.codeVerifier);
      window.location.href = pkceAuth.url;
    } catch (error) {
      message.error('Failed to initialize OAuth flow');
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        const { workspaceId, botId, voiceId, baseURL } = values;
        if (!accessToken || !workspaceId || !botId || !baseURL) {
          message.error(
            'Access Token, Workspace, Bot, and Base URL are required!',
          );
          return;
        }

        localStorage.setItem('workspaceId', workspaceId);
        localStorage.setItem('botId', botId);
        localStorage.setItem('voiceId', voiceId);
        localStorage.setItem('baseURL', baseURL);

        onSaveSettings();
        setIsModalVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Text ellipsis style={{ maxWidth: 200 }} title={accessToken}>
          access_token: {accessToken || 'Not set'}
        </Text>
      </Menu.Item>
      <Menu.Item key="2">
        <Text
          ellipsis
          style={{ maxWidth: 200 }}
          title={form.getFieldValue('workspaceId')}
        >
          workspace_id: {localStorage.getItem('workspaceId') || 'Not set'}
        </Text>
      </Menu.Item>
      <Menu.Item key="3">
        <Text
          ellipsis
          style={{ maxWidth: 200 }}
          title={form.getFieldValue('botId')}
        >
          bot_id: {localStorage.getItem('botId') || 'Not set'}
        </Text>
      </Menu.Item>
      <Menu.Item key="4">
        <Text
          ellipsis
          style={{ maxWidth: 200 }}
          title={form.getFieldValue('voiceId')}
        >
          voice_id: {localStorage.getItem('voiceId') || 'Not set'}
        </Text>
      </Menu.Item>
      <Menu.Item key="5">
        <Text
          ellipsis
          style={{ maxWidth: 200 }}
          title={form.getFieldValue('baseURL')}
        >
          base_url: {localStorage.getItem('baseURL') || 'Not set'}
        </Text>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Header
        style={{
          padding: '0 16px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={logo}
            alt="Logo"
            style={{ height: '32px', marginRight: '16px' }}
          />
          <div
            style={{
              color: 'white',
              fontSize: '18px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Coze Realtime Console
          </div>
        </div>
        <div>
          <Link href={DOCS_URL} target="_blank" style={{ marginRight: '8px' }}>
            <Button type="primary" icon={<FileTextOutlined />}>
              Documentation
            </Button>
          </Link>
          <Dropdown overlay={menu} placement="bottomRight">
            <Button icon={<SettingOutlined />} onClick={showModal}>
              Settings
            </Button>
          </Dropdown>
        </div>
      </Header>

      <Modal
        title="Settings"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Access Token"
            tooltip={
              <>
                仅支持已开通白名单的火山引擎专业版用户，
                <Link
                  href="https://www.coze.cn/store/agent/7431466007513808959?bid=6e8pp4bh8100f&bot_id=true"
                  target="_blank"
                >
                  通过与Bot的对话开启白名单
                </Link>
              </>
            }
          >
            <Input.Group compact>
              <Input
                value={accessToken}
                disabled
                style={{ width: 'calc(100% - 160px)' }}
              />
              <Button onClick={initPKCEFlow} style={{ width: '80px' }}>
                Authorize
              </Button>
              <Button
                onClick={() => {
                  localStorage.removeItem('accessToken');
                  localStorage.removeItem('refreshToken');
                  localStorage.removeItem('tokenExpiresAt');
                  window.location.reload();
                }}
              >
                Clear
              </Button>
            </Input.Group>
          </Form.Item>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name="workspaceId"
                label="Workspace"
                rules={[
                  { required: true, message: 'Please select a workspace!' },
                ]}
              >
                <WorkspaceSelect
                  workspaces={workspaces}
                  loading={loadingWorkspaces}
                  onChange={handleWorkspaceChange(api)}
                  value={selectedWorkspace}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="botId"
                label="Bot"
                rules={[{ required: true, message: 'Please select a bot!' }]}
              >
                <BotSelect
                  bots={bots}
                  disabled={!selectedWorkspace}
                  loading={loadingBots}
                  value={form.getFieldValue('botId')}
                  onChange={value => form.setFieldsValue({ botId: value })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="voiceId" label="Voice">
            <VoiceSelect
              voices={voices}
              loading={loadingVoices}
              value={form.getFieldValue('voiceId')}
              onChange={value => form.setFieldsValue({ voiceId: value })}
            />
          </Form.Item>
          <Form.Item
            name="baseURL"
            label="Base URL"
            rules={[{ required: true, message: 'Please input the base URL!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Settings;
