import { useEffect, useState } from 'react';

import { Modal, Form, Input, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

import getConfig from '../../utils/config';

const Settings = ({
  onSettingsChange,
  localStorageKey,
}: {
  onSettingsChange: () => void;
  localStorageKey: string;
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
        onClick={() => setIsSettingsVisible(true)}
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
          <Form.Item
            name="base_url"
            label="Base URL"
            rules={[{ required: true, message: 'Please input Base URL!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="base_ws_url"
            label="Base WS URL"
            rules={[{ required: true, message: 'Please input Base WS URL!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="pat"
            label="PAT"
            rules={[{ required: true, message: 'Please input PAT!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="bot_id"
            label="Bot ID"
            rules={[{ required: true, message: 'Please input Bot ID!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="voice_id"
            label="Voice ID"
            rules={[{ message: 'Please input Voice ID!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="workflow_id"
            label="Workflow ID"
            rules={[{ message: 'Please input Workflow ID!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Settings;
