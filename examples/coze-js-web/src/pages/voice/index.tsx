import React, { useState, useEffect } from 'react';

import {
  Layout,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Card,
  message,
  Upload,
} from 'antd';
import { SettingOutlined, UploadOutlined } from '@ant-design/icons';

import useCozeAPI from './use-coze-api';
import { config } from './config';

const { Header, Content } = Layout;

const Voice = () => {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [form] = Form.useForm();
  const [query, setQuery] = useState('');

  const { initClient, content, streamingChat, interruptAudio, uploadFile } =
    useCozeAPI();

  // load settings from local storage
  useEffect(() => {
    const baseUrl = config.getBaseUrl();
    const pat = config.getPat();
    const botId = config.getBotId();
    const voiceFileId = config.getVoiceFileId();

    form.setFieldsValue({
      base_url: baseUrl,
      pat,
      bot_id: botId,
      voice_file_id: voiceFileId,
    });
  }, [form]);

  useEffect(() => {
    const baseUrl = config.getBaseUrl();
    const pat = config.getPat();
    const botId = config.getBotId();

    if (baseUrl && pat && botId) {
      initClient();
    } else {
      message.error('Please set the base URL, PAT, bot ID and voice file ID');
    }
  }, []);

  // handle settings save
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSettingsSave = (values: any) => {
    Object.entries(values).forEach(([key, value]) => {
      localStorage.setItem(`voice_${key}`, value as string);
    });
    setIsSettingsVisible(false);
    initClient();
  };

  // handle send message
  const handleSendMessage = () => {
    if (!query.trim()) {
      message.error('Please input your message');
      return;
    }
    const voiceFileId = config.getVoiceFileId();
    if (!voiceFileId) {
      message.error('Please upload a voice file or set the voice file ID');
      return;
    }

    streamingChat(query);
    setQuery('');
  };

  // handle file upload
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileUpload = async (info: any) => {
    const file = info.file.originFileObj;
    if (file) {
      try {
        const res = await uploadFile(file);
        config.setVoiceFileId(res.id);
        form.setFieldsValue({
          voice_file_id: res.id,
        });
        message.success('File uploaded successfully');
      } catch (error) {
        message.error(`File upload failed: ${error}`);
        console.error(error);
      }
    } else {
      message.error('No file selected');
    }
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fff',
          padding: '0 24px',
        }}
      >
        <h1 style={{ margin: 0 }}>Coze Voice Demo</h1>
        <Button
          icon={<SettingOutlined />}
          onClick={() => setIsSettingsVisible(true)}
        >
          Settings
        </Button>
      </Header>

      <Content style={{ padding: '24px', overflow: 'auto' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card style={{ height: '60vh', overflow: 'auto' }}>
            <p>{content}</p>
          </Card>
          <Upload
            accept=".wav,.ogg_opus" // limit file type
            onChange={handleFileUpload}
            showUploadList={false}
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => {
                // onSuccess?.('ok');
              }, 0);
            }}
          >
            <Button icon={<UploadOutlined />}>Voice File Upload</Button>
          </Upload>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onPressEnter={handleSendMessage}
              placeholder="Type your message..."
            />
            <Button type="primary" onClick={handleSendMessage}>
              Send Message
            </Button>
            <Button onClick={interruptAudio}>Interrupt</Button>
          </Space.Compact>
        </Space>
      </Content>

      {/* settings modal */}
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
          <Form.Item name="voice_file_id" label="Voice File ID">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Voice;
