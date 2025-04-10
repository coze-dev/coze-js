import { useEffect, useState } from 'react';

import { Modal, Form, Input, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

import getConfig from '../../utils/config';

// 定义配置项接口
interface FormConfig {
  name: string;
  label: string;
  required?: boolean;
  message?: string;
}

// 定义所有配置项
const formConfigs: FormConfig[] = [
  {
    name: 'base_url',
    label: 'Base URL',
    required: true,
    message: 'Please input Base URL!',
  },
  {
    name: 'base_ws_url',
    label: 'Base WS URL',
    required: true,
    message: 'Please input Base WS URL!',
  },
  {
    name: 'pat',
    label: '个人访问令牌',
    required: true,
    message: 'Please input PAT!',
  },
  {
    name: 'bot_id',
    label: '智能体ID',
    required: true,
    message: 'Please input Bot ID!',
  },
  {
    name: 'voice_id',
    label: '音色ID',
    required: false,
    message: 'Please input Voice ID!',
  },
  {
    name: 'workflow_id',
    label: '工作流ID',
    required: false,
    message: 'Please input Workflow ID!',
  },
];

// 渲染表单项组件
const renderFormItems = (fields?: string[]) =>
  formConfigs
    .filter(config => !fields || fields.includes(config.name)) // 只保留 fields 中指定的配置项
    .map(config => (
      <Form.Item
        key={config.name}
        name={config.name}
        label={config.label}
        rules={[
          {
            required: config.required,
            message: config.message,
          },
        ]}
      >
        <Input />
      </Form.Item>
    ));

const Settings = ({
  onSettingsChange,
  localStorageKey,
  fields,
  style,
}: {
  onSettingsChange: () => void;
  localStorageKey: string;
  fields?: string[];
  style?: React.CSSProperties;
}) => {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [form] = Form.useForm();

  // load settings from local storage
  useEffect(() => {
    const config = getConfig(localStorageKey);
    const baseUrl = config.getBaseUrl();
    const pat = config.getPat();
    const botId = config.getBotId();
    const baseWsUrl = config.getBaseWsUrl();
    const voiceId = config.getVoiceId();
    const workflowId = config.getWorkflowId();
    form.setFieldsValue({
      base_url: baseUrl,
      base_ws_url: baseWsUrl,
      pat,
      bot_id: botId,
      voice_id: voiceId,
      workflow_id: workflowId,
    });
  }, [form]);

  // handle settings save
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSettingsSave = (values: any) => {
    Object.entries(values).forEach(([key, value]) => {
      localStorage.setItem(`${localStorageKey}_${key}`, value as string);
    });
    setIsSettingsVisible(false);
    onSettingsChange();
  };

  return (
    <>
      <Button
        icon={<SettingOutlined />}
        type="primary"
        onClick={() => setIsSettingsVisible(true)}
        style={style}
      >
        Settings
      </Button>
      <Modal
        title="Settings"
        open={isSettingsVisible}
        onCancel={() => setIsSettingsVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSettingsSave} layout="vertical">
          {renderFormItems(fields)}
        </Form>
      </Modal>
    </>
  );
};

export default Settings;
