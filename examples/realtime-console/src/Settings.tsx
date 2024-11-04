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
} from 'antd';
import { SettingOutlined, FileTextOutlined } from '@ant-design/icons';

import logo from './logo.svg'; // 导入 logo

const { Header } = Layout;
const { Text } = Typography;

interface SettingsProps {
  onSaveSettings: () => void;
}

const DOCS_URL =
  'https://bytedance.larkoffice.com/docx/FQJ9dvBE7oLzu3xtacJc6Cyjnof';
const Settings: React.FC<SettingsProps> = ({ onSaveSettings }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Load values from localStorage on component mount
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedBotId = localStorage.getItem('botId');
    const storedVoiceId = localStorage.getItem('voiceId');
    const storedBaseURL = localStorage.getItem('baseURL');
    form.setFieldsValue({
      accessToken: storedAccessToken || '',
      botId: storedBotId || '',
      voiceId: storedVoiceId || '',
      baseURL: storedBaseURL || 'https://api.coze.cn',
    });
  }, [form]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        const { accessToken, botId, voiceId, baseURL } = values;
        if (!accessToken || !botId || !baseURL) {
          message.error('Access Token, Bot ID, and Base URL are required!');
          return;
        }

        localStorage.setItem('accessToken', accessToken);
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
        <Text
          ellipsis
          style={{ maxWidth: 200 }}
          title={form.getFieldValue('accessToken')}
        >
          access_token: {localStorage.getItem('accessToken') || 'Not set'}
        </Text>
      </Menu.Item>
      <Menu.Item key="2">
        <Text
          ellipsis
          style={{ maxWidth: 200 }}
          title={form.getFieldValue('botId')}
        >
          bot_id: {localStorage.getItem('botId') || 'Not set'}
        </Text>
      </Menu.Item>
      <Menu.Item key="3">
        <Text
          ellipsis
          style={{ maxWidth: 200 }}
          title={form.getFieldValue('voiceId')}
        >
          voice_id: {localStorage.getItem('voiceId') || 'Not set'}
        </Text>
      </Menu.Item>
      <Menu.Item key="4">
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
            name="accessToken"
            label="Access Token"
            rules={[
              { required: true, message: 'Please input your access token!' },
            ]}
            tooltip={
              <>
                Only available for Volcano Engine Professional users with
                whitelist access.
                <Link
                  href="https://www.coze.cn/store/agent/7431466007513808959?bid=6e8pp4bh8100f&bot_id=true"
                  target="_blank"
                >
                  You can enable whitelist through Bot conversation.
                </Link>
              </>
            }
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="botId"
            label="Bot ID"
            rules={[{ required: true, message: 'Please input your bot ID!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="voiceId" label="Voice ID">
            <Input />
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
