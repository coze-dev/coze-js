/* eslint-disable max-lines */
import React, { useState, useEffect } from 'react';

import Link from 'antd/es/typography/Link';
import {
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
  Space,
  Row,
  Col,
  Empty,
  Avatar,
} from 'antd';
import {
  getPKCEAuthenticationUrl,
  getPKCEOAuthToken,
  type OAuthToken,
  refreshOAuthToken,
} from '@coze/api';
import {
  SettingOutlined,
  FileTextOutlined,
  RobotOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

import useCozeAPI, {
  type WorkspaceOption,
  type BotOption,
  type VoiceOption,
} from './use-coze-api';
import logo from './logo.svg';
const { Header } = Layout;
const { Text } = Typography;
import VoiceSelect from './VoiceSelect';

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
}> = ({ workspaces, loading, onChange, value }) => (
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

const BotSelect: React.FC<{
  bots: BotOption[];
  loading: boolean;
  disabled: boolean;
  value?: string;
  onChange?: (value: string) => void;
}> = ({ bots, loading, disabled, value, onChange }) => (
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

const Settings: React.FC<SettingsProps> = ({ onSaveSettings }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');
  const [isAccessTokenLoaded, setIsAccessTokenLoaded] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [workspaces, setWorkspaces] = useState<WorkspaceOption[]>([]);
  const [bots, setBots] = useState<BotOption[]>([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [loadingBots, setLoadingBots] = useState(false);
  const baseURL = localStorage.getItem('baseURL') || 'https://api.coze.cn';

  const { api, fetchAllVoices, fetchAllBots, fetchAllWorkspaces, cloneVoice } =
    useCozeAPI({
      accessToken,
      baseURL,
    });

  const setToken = (token: OAuthToken) => {
    localStorage.setItem('accessToken', token.access_token);
    localStorage.setItem('refreshToken', token.refresh_token);
    localStorage.setItem(
      'tokenExpiresAt',
      (token.expires_in * 1000).toString(),
    );
    setAccessToken(token.access_token);
  };

  const getOrRefreshToken = async (): Promise<string> => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const codeVerifier = localStorage.getItem('pkce_code_verifier');

    const isTokenExpired = (expiresAt: string | null): boolean => {
      if (!expiresAt) {
        return true;
      }
      // Add 5-minute buffer before expiration
      return Date.now() >= parseInt(expiresAt) - 5 * 60 * 1000;
    };

    const isNeedRefreshToken = (): boolean => {
      // token expired, need refresh token
      if (
        storedRefreshToken &&
        tokenExpiresAt &&
        isTokenExpired(tokenExpiresAt)
      ) {
        console.log('token expired, need refresh token');
        return true;
      }
      if (storedRefreshToken && !storedAccessToken) {
        console.log('no access token, and has refresh token, need refresh');
        return true;
      }
      return false;
    };

    if (code && codeVerifier) {
      // pkce flow
      const token = await exchangeCodeForToken(code, codeVerifier);
      if (token) {
        console.log('pkce flow, set token', token);
        setToken(token);
        return token.access_token;
      }
      console.log('pkce flow failed, no token');
      return '';
    } else if (storedRefreshToken && isNeedRefreshToken()) {
      try {
        const refreshedToken = await refreshOAuthToken({
          baseURL,
          clientId: DEFAULT_OAUTH_CLIENT_ID,
          refreshToken: storedRefreshToken,
          clientSecret: '',
        });

        console.log('refresh token');
        setToken(refreshedToken);
        return refreshedToken.access_token;
      } catch (err) {
        console.error(err);
        message.error(`Failed to refresh token: ${err}`);
        // if contains `BadRequestError`, remove token
        if (`${err}`.includes('BadRequestError')) {
          setToken({
            access_token: '',
            refresh_token: '',
            expires_in: 0,
          });
        }
        console.log('refresh token failed');
        return '';
      }
    } else if (storedAccessToken) {
      console.log('has access token, return access token');
      return storedAccessToken;
    } else {
      console.log('no access token, return empty');
      return '';
    }
  };

  /* eslint-disable max-params */
  const loadData = async (
    objectName: string,
    dataLocalKey: string,
    setLoading: (loading: boolean) => void,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    setData: (data: any[]) => void,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    fetchData: (id?: string) => Promise<any[]>,
    parentId?: string,
  ): Promise<void> => {
    setLoading(true);
    try {
      const data = await fetchData(parentId);

      // if no data in localStorage, set the first data as default
      const storedData = localStorage.getItem(dataLocalKey);
      if (!storedData && data.length > 0) {
        const firstData = data[0].value;
        localStorage.setItem(dataLocalKey, firstData);
        form.setFieldsValue({ [dataLocalKey]: firstData });
      }
      setData(data);
    } catch (err) {
      console.error(err);
      message.error(`Failed to load ${objectName}: ${err}`);
      // code: 4100, remove token
      if (`${err}`.includes('code: 4100')) {
        console.log(`remove token when load ${objectName} failed: ${err}`);
        localStorage.removeItem('accessToken');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWorkspaceChange = () => (workspaceId: string) => {
    setSelectedWorkspace(workspaceId);
    localStorage.setItem('workspaceId', workspaceId);
    form.setFieldsValue({ botId: undefined });

    loadData(
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
      const accessTokenObtained = await getOrRefreshToken();
      setAccessToken(accessTokenObtained);
      setIsAccessTokenLoaded(true);

      if (accessTokenObtained) {
        await loadData(
          'Voices',
          'voiceId',
          setLoadingVoices,
          setVoices,
          fetchAllVoices,
        );

        await loadData(
          'Workspaces',
          'workspaceId',
          setLoadingWorkspaces,
          setWorkspaces,
          fetchAllWorkspaces,
        );

        const workspaceId = localStorage.getItem('workspaceId');
        if (workspaceId) {
          await loadData(
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
        voiceId: localStorage.getItem('voiceId') || '',
        baseURL: localStorage.getItem('baseURL') || 'https://api.coze.cn',
      });
    })();
  }, [form, api]);

  const getCurrentLocation = () =>
    `${window.location.protocol}//${window.location.host}${window.location.pathname}`;

  const exchangeCodeForToken = async (
    code: string,
    codeVerifier: string,
  ): Promise<OAuthToken | null> => {
    try {
      const token = await getPKCEOAuthToken({
        code,
        baseURL: localStorage.getItem('baseURL') || 'https://api.coze.cn',
        clientId: DEFAULT_OAUTH_CLIENT_ID,
        redirectUrl: getCurrentLocation(),
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
        baseURL: form.getFieldValue('baseURL') || 'https://api.coze.cn',
        clientId: DEFAULT_OAUTH_CLIENT_ID,
        redirectUrl: getCurrentLocation(),
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
        const { workspaceId, botId, voiceId, baseURL: baseURLForm } = values;
        if (baseURLForm) {
          localStorage.setItem('baseURL', baseURLForm);
        }
        if (!accessToken || !workspaceId || !botId) {
          message.error(
            'Access Token, Workspace, Bot, and Base URL are required!',
          );
          return;
        }

        localStorage.setItem('workspaceId', workspaceId);
        localStorage.setItem('botId', botId);
        localStorage.setItem('voiceId', voiceId);
        localStorage.setItem('baseURL', baseURLForm);

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
          padding: '16px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          height: 'auto',
          minHeight: '64px',
          lineHeight: 'normal',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flex: '1 1 auto',
            minWidth: '200px',
          }}
        >
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
              minWidth: 0,
            }}
          >
            Coze Realtime Console
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexShrink: 0,
            alignItems: 'center',
          }}
        >
          <Link href={DOCS_URL} target="_blank">
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
        visible={isModalVisible || (isAccessTokenLoaded && accessToken === '')}
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
                  href="https://www.coze.cn/survey/7431180581536268314"
                  target="_blank"
                >
                  填写问卷申请开通使用
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
                  console.log('clear token');
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
                  onChange={handleWorkspaceChange()}
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
              cloneVoice={cloneVoice}
              fetchAllVoices={fetchAllVoices}
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
