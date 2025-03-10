import { useEffect, useState } from 'react';

import { Modal, Form, Input, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

import { config } from './config';

const Settings = ({ onSettingsChange }: { onSettingsChange: () => void }) => {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [form] = Form.useForm();

  // load settings from local storage
  useEffect(() => {
    const baseUrl = config.getBaseUrl();
    const pat = config.getPat();
    const botId = config.getBotId();
    const baseWsUrl = config.getBaseWsUrl();

    form.setFieldsValue({
      base_url: baseUrl,
      base_ws_url: baseWsUrl,
      pat,
      bot_id: botId,
    });
  }, [form]);

  // handle settings save
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSettingsSave = (values: any) => {
    Object.entries(values).forEach(([key, value]) => {
      localStorage.setItem(`chat-x_${key}`, value as string);
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
        </Form>
      </Modal>
    </>
  );
};

export default Settings;
