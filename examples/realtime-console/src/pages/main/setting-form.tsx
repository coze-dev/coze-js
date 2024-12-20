import React, { useState, useEffect } from 'react';

import Link from 'antd/es/typography/Link';
import {
  Button,
  Typography,
  message,
  Form,
  Select,
  Space,
  Row,
  Col,
  Empty,
  Avatar,
  Input,
} from 'antd';
import { AuthenticationError } from '@coze/api';
import {
  RobotOutlined,
  InfoCircleOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
} from '@ant-design/icons';

import { isTeamWorkspace, redirectToLogin } from '../../utils/utils';
import { LocalManager, LocalStorageKey } from '../../utils/local-manager';
import useCozeAPI, {
  type WorkspaceOption,
  type BotOption,
  type VoiceOption,
} from '../../hooks/use-coze-api';
import VoiceSelect from './voice-select';
const { Text } = Typography;

interface SettingsProps {
  onOk: () => void;
  onCancel: () => void;
}

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

const SettingForm: React.FC<SettingsProps> = ({ onCancel, onOk }) => {
  const [form] = Form.useForm();
  const localManager = new LocalManager();
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [workspaces, setWorkspaces] = useState<WorkspaceOption[]>([]);
  const [bots, setBots] = useState<BotOption[]>([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [loadingBots, setLoadingBots] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { api, fetchAllVoices, fetchAllBots, fetchAllWorkspaces, cloneVoice } =
    useCozeAPI();

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

      console.log(`load ${objectName} data`, data);

      // if no data in localStorage, set the first data as default
      const storedData = localManager.get(dataLocalKey);
      if (!storedData && data.length > 0) {
        const firstData = data[0].value;
        localManager.set(dataLocalKey, firstData);
        form.setFieldsValue({ [dataLocalKey]: firstData });
      }
      setData(data);
    } catch (err) {
      setData([]);
      message.error(`Failed to load ${objectName}: ${err}`);
      // code: 4100, remove token
      if (err instanceof AuthenticationError) {
        console.log(`remove token when load ${objectName} failed: ${err}`);

        let isOk = false;
        if (
          dataLocalKey === LocalStorageKey.BOT_ID &&
          isTeamWorkspace(parentId)
        ) {
          const pureWorkspaceId = parentId?.split('_')[1];
          isOk = await redirectToLogin(true, pureWorkspaceId);
          if (isOk) {
            localManager.removeAll(LocalStorageKey.WORKSPACE_PREFIX);
          }
        } else {
          isOk = await redirectToLogin(false);
          if (isOk) {
            localManager.remove(LocalStorageKey.ACCESS_TOKEN);
          }
        }
      } else {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWorkspaceChange = () => (workspaceId: string) => {
    setSelectedWorkspace(workspaceId);
    localManager.set(LocalStorageKey.WORKSPACE_ID, workspaceId);
    localManager.remove(LocalStorageKey.WORKSPACE_ACCESS_TOKEN);
    form.setFieldsValue({ [LocalStorageKey.BOT_ID]: undefined });
    localManager.remove(LocalStorageKey.BOT_ID);

    loadData(
      'Bots',
      LocalStorageKey.BOT_ID,
      setLoadingBots,
      setBots,
      fetchAllBots,
      workspaceId,
    );
  };

  useEffect(() => {
    (async () => {
      await loadData(
        'Voices',
        LocalStorageKey.VOICE_ID,
        setLoadingVoices,
        setVoices,
        fetchAllVoices,
      );

      await loadData(
        'Workspaces',
        LocalStorageKey.WORKSPACE_ID,
        setLoadingWorkspaces,
        setWorkspaces,
        fetchAllWorkspaces,
      );

      const workspaceId = localManager.get(LocalStorageKey.WORKSPACE_ID);
      if (workspaceId) {
        await loadData(
          'Bots',
          LocalStorageKey.BOT_ID,
          setLoadingBots,
          setBots,
          fetchAllBots,
          workspaceId,
        );
      }
      form.setFieldsValue({
        [LocalStorageKey.WORKSPACE_ID]: localManager.get(
          LocalStorageKey.WORKSPACE_ID,
        ),
        [LocalStorageKey.BOT_ID]: localManager.get(LocalStorageKey.BOT_ID),
        [LocalStorageKey.VOICE_ID]: localManager.get(LocalStorageKey.VOICE_ID),
        [LocalStorageKey.WORKSPACE_ACCESS_TOKEN]: localManager.get(
          LocalStorageKey.WORKSPACE_ACCESS_TOKEN,
        ),
        [LocalStorageKey.USER_ID]: localManager.get(LocalStorageKey.USER_ID),
        [LocalStorageKey.CONVERSATION_ID]: localManager.get(
          LocalStorageKey.CONVERSATION_ID,
        ),
      });
    })().catch(err => {
      console.error(err);
    });
  }, [form, api]);

  const saveSettings = () => {
    const { workspace_id, bot_id, voice_id, user_id, conversation_id } =
      form.getFieldsValue();
    localManager.set(LocalStorageKey.WORKSPACE_ID, workspace_id);
    localManager.set(LocalStorageKey.BOT_ID, bot_id);
    localManager.set(LocalStorageKey.VOICE_ID, voice_id);
    localManager.set(LocalStorageKey.USER_ID, user_id);
    localManager.set(LocalStorageKey.CONVERSATION_ID, conversation_id);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        const { workspace_id } = values;

        const isTeam = workspace_id.startsWith('team_');
        if (
          isTeam &&
          !localManager.get(LocalStorageKey.WORKSPACE_ACCESS_TOKEN)
        ) {
          message.error(
            'Workspace Access Token is required for team workspace!',
          );
          return;
        }

        saveSettings();

        onOk();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <>
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
              value={localManager.get(LocalStorageKey.ACCESS_TOKEN) || ''}
              disabled
              style={{ width: 'calc(100% - 170px)' }}
            />
            <Button
              onClick={async () => {
                console.log('clear token');
                const isOK = await redirectToLogin(false, '', false);
                if (isOK) {
                  localManager.removeAll();
                }
              }}
            >
              Clear and reauthorize
            </Button>
          </Input.Group>
        </Form.Item>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name={LocalStorageKey.WORKSPACE_ID}
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
              name={LocalStorageKey.BOT_ID}
              label="Bot"
              rules={[{ required: true, message: 'Please select a bot!' }]}
            >
              <BotSelect
                bots={bots}
                disabled={!selectedWorkspace && bots?.length === 0}
                loading={loadingBots}
                value={form.getFieldValue(LocalStorageKey.BOT_ID)}
                onChange={value => {
                  form.setFieldsValue({ [LocalStorageKey.BOT_ID]: value });
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        {isTeamWorkspace(form.getFieldValue(LocalStorageKey.WORKSPACE_ID)) && (
          <Row gutter={8}>
            <Col span={24}>
              <Form.Item
                name="workspace_access_token"
                label="Workspace Access Token"
                rules={[
                  {
                    required: true,
                    validator(rule, value, callback) {
                      if (
                        !localManager.get(
                          LocalStorageKey.WORKSPACE_ACCESS_TOKEN,
                        )
                      ) {
                        callback('Please authorize!');
                      }
                      callback();
                    },
                    message: 'Please authorize!',
                  },
                ]}
                tooltip={
                  <>团队空间需要使用 Workspace Access Token 进行鉴权，</>
                }
              >
                <Input.Group compact>
                  <Input
                    value={localManager.get(
                      LocalStorageKey.WORKSPACE_ACCESS_TOKEN,
                    )}
                    disabled
                    style={{ width: 'calc(100% - 170px)' }}
                  />
                  <Button
                    onClick={async () => {
                      console.log('clear workspace access token');

                      const botId = form.getFieldValue(LocalStorageKey.BOT_ID);
                      if (!botId) {
                        message.error('Please select a bot!');
                        return;
                      }
                      localManager.set(LocalStorageKey.BOT_ID, botId);

                      const workspaceId = form.getFieldValue(
                        LocalStorageKey.WORKSPACE_ID,
                      );
                      const pureWorkspaceId = workspaceId.split('_')[1];

                      const isOK = await redirectToLogin(
                        true,
                        pureWorkspaceId,
                        false,
                      );
                      if (isOK) {
                        localManager.removeAll(
                          LocalStorageKey.WORKSPACE_PREFIX,
                        );
                      }
                    }}
                  >
                    Authorize
                  </Button>
                </Input.Group>
              </Form.Item>
            </Col>
          </Row>
        )}
        <Form.Item name={LocalStorageKey.VOICE_ID} label="Voice">
          <VoiceSelect
            voices={voices}
            loading={loadingVoices}
            value={form.getFieldValue(LocalStorageKey.VOICE_ID)}
            onChange={value =>
              form.setFieldsValue({ [LocalStorageKey.VOICE_ID]: value })
            }
            cloneVoice={cloneVoice}
            fetchAllVoices={fetchAllVoices}
          />
        </Form.Item>
        <Form.Item style={{ marginLeft: 0 }}>
          <Button
            type="link"
            onClick={() => setShowAdvanced(!showAdvanced)}
            icon={showAdvanced ? <CaretUpOutlined /> : <CaretDownOutlined />}
            style={{ paddingLeft: 0 }}
          >
            Advanced Settings
          </Button>
        </Form.Item>

        <div style={{ display: showAdvanced ? 'block' : 'none' }}>
          <Form.Item
            name={LocalStorageKey.CONVERSATION_ID}
            label="Conversation ID"
            tooltip="Optional: Specify a custom conversation ID"
          >
            <Input placeholder="Enter conversation ID" />
          </Form.Item>
          <Form.Item
            name={LocalStorageKey.USER_ID}
            label="User ID"
            tooltip="Optional: Specify a custom user ID"
          >
            <Input placeholder="Enter user ID" />
          </Form.Item>
        </div>

        <Form.Item>
          <Row justify="end">
            <Space>
              <Button onClick={onCancel}>Cancel</Button>
              <Button type="primary" onClick={handleOk}>
                OK
              </Button>
            </Space>
          </Row>
        </Form.Item>
      </Form>
    </>
  );
};

export default SettingForm;
