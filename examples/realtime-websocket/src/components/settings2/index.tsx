import { useEffect, useState } from 'react';

import Select, {
  type DefaultOptionType,
  type OptionProps,
} from 'antd/es/select';
import {
  Modal,
  Form,
  Button,
  Input,
  message,
  TreeSelect,
  type TreeSelectProps,
} from 'antd';
import { SettingOutlined } from '@ant-design/icons';

import getConfig from '../../utils/config';
import { getTokenByCookie } from '../../utils';
import useApi from './use-api';

const Settings2 = ({
  onSettingsChange,
  localStorageKey,
  className,
}: {
  onSettingsChange: () => void;
  localStorageKey: string;
  fields: string[];
  className?: string;
}) => {
  const config = getConfig(localStorageKey);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [form] = Form.useForm();
  const { isRelease, getBotInfo, getBots, getWorkspaces, getVoices } =
    useApi(localStorageKey);

  const [treeData, setTreeData] = useState<Omit<DefaultOptionType, 'label'>[]>(
    [],
  );
  const [voiceData, setVoiceData] = useState<OptionProps[]>([]);
  const [pat, setPat] = useState(config.getPat());
  const [showSelect, setShowSelect] = useState(
    () => !config.getPat().startsWith('pat_'),
  );

  const onLoadData: TreeSelectProps['loadData'] = async ({ id }) => {
    const options = await getBots(id);
    const treeData2: Omit<DefaultOptionType, 'label'>[] = [];
    options.forEach(item => {
      treeData2.push({
        id: item.id,
        pId: id,
        value: item.id,
        title: item.name,
        isLeaf: true,
      });
    });
    setTreeData(treeData.concat(treeData2));
  };

  // load settings from local storage
  useEffect(() => {
    const baseUrl = config.getBaseUrl();
    const pat2 = config.getPat();
    const botId = config.getBotId();
    const baseWsUrl = config.getBaseWsUrl();
    const voiceId = config.getVoiceId();
    const workflowId = config.getWorkflowId();
    form.setFieldsValue({
      base_url: baseUrl,
      base_ws_url: baseWsUrl,
      pat: pat2,
      bot_id: botId,
      voice_id: voiceId,
      workflow_id: workflowId,
    });

    if (botId && showSelect) {
      getBotInfo(botId).then(bot => {
        form.setFieldValue('bot_id', bot.name);
      });
    }
  }, [form]);

  useEffect(() => {
    // 是否使用 cookie 换 token 的方案
    // 如果是，则智能体、音色直接让用户选择
    // 如果不是，则需手动输入
    if (isRelease() && !pat.startsWith('pat_')) {
      setShowSelect(true);
    } else {
      setShowSelect(false);
    }
  }, [isRelease, pat]);

  const fetchAllWorkspaces = async () => {
    const workspaces = await getWorkspaces();
    const treeData2: Omit<OptionProps, 'label'>[] = [];
    workspaces.forEach(workspace => {
      treeData2.push({
        id: workspace.id,
        pId: 0,
        value: workspace.id,
        title: workspace.name,
        isLeaf: false,
        selectable: false,
      });
    });
    setTreeData(treeData2);
  };

  const fetchAllVoices = async () => {
    const voices = await getVoices();
    const treeData2: OptionProps[] = [];
    voices.forEach(voice => {
      treeData2.push({
        value: voice.value,
        label: voice.label,
        children: [],
      });
    });
    setVoiceData(treeData2);
  };

  useEffect(() => {
    if (!pat) {
      return;
    }
    if (showSelect) {
      fetchAllWorkspaces();
      fetchAllVoices();
    } else {
      form.setFieldValue('bot_id', config.getBotId());
    }
  }, [showSelect]);

  // handle settings save
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSettingsSave = (values: any) => {
    Object.entries(values).forEach(([key, value]) => {
      if (key !== 'bot_id' || /^\d+$/.test(String(value))) {
        localStorage.setItem(`${localStorageKey}_${key}`, value as string);
      }
    });
    setIsSettingsVisible(false);
    onSettingsChange();
  };

  const handleAuth = async () => {
    if (!isRelease()) {
      message.warning('Not Support!');
      return;
    }

    const oauthToken = await getTokenByCookie();
    if (!oauthToken) {
      message.warning('Failed to retrieve token. ');
      return;
    }
    form.setFieldValue('pat', oauthToken.access_token);

    localStorage.setItem(`${localStorageKey}_pat`, oauthToken.access_token);
    localStorage.setItem(
      `${localStorageKey}_expires_in`,
      oauthToken.expires_in.toString(),
    );

    setPat(oauthToken.access_token);

    await fetchAllWorkspaces();
    await fetchAllVoices();
    message.success('Authorization successful!');
  };

  const handlePatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPat(e.target.value);
  };

  return (
    <>
      <Button
        icon={<SettingOutlined />}
        type="primary"
        onClick={() => setIsSettingsVisible(true)}
        className={className}
      >
        Settings
      </Button>
      <Modal
        title="Settings"
        open={isSettingsVisible}
        onCancel={() => setIsSettingsVisible(false)}
        onOk={() => form.submit()}
        forceRender={false}
        destroyOnClose={true}
      >
        <Form form={form} onFinish={handleSettingsSave} layout="vertical">
          <Form.Item
            key={'base_ws_url'}
            name={'base_ws_url'}
            label={'Base WS URL'}
            rules={[
              {
                required: true,
                message: 'Please input Base WS URL!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            key={'pat'}
            name={'pat'}
            label={
              <span>
                个人访问令牌
                {isRelease() && (
                  <Button
                    style={{ marginLeft: '8px' }}
                    type="link"
                    onClick={handleAuth}
                  >
                    去授权
                  </Button>
                )}
              </span>
            }
            rules={[
              {
                required: true,
                message: 'Please input PAT!',
              },
            ]}
          >
            <Input onChange={handlePatChange} />
          </Form.Item>
          <Form.Item
            key={'botID'}
            name={'bot_id'}
            label="智能体ID"
            rules={[
              {
                required: true,
                message: 'Please select',
              },
            ]}
          >
            {showSelect ? (
              <TreeSelect
                treeDataSimpleMode
                placeholder="Please select"
                loadData={onLoadData}
                treeData={treeData}
                showSearch
                filterTreeNode={(inputValue, treeNode) =>
                  (treeNode.title as string)
                    .toLowerCase()
                    .indexOf(inputValue.toLowerCase()) >= 0
                }
                treeNodeFilterProp="title"
              />
            ) : (
              <Input />
            )}
          </Form.Item>
          <Form.Item key={'voiceID'} name={'voice_id'} label="音色ID">
            {showSelect ? (
              <Select
                placeholder="Please select"
                showSearch
                filterOption={(inputValue, option) =>
                  (option?.label as string)
                    .toLowerCase()
                    .indexOf(inputValue.toLowerCase()) >= 0
                }
                options={voiceData}
              />
            ) : (
              <Input />
            )}
          </Form.Item>
          <Form.Item key={'workflowID'} name={'workflow_id'} label="工作流ID">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Settings2;
