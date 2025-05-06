import React, { useEffect, useState } from 'react';

import { Button, Form, Input, message, Space, Typography } from 'antd';

const { Title, Paragraph } = Typography;

// 设置页面组件
const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 加载保存的API Key和Bot ID
  useEffect(() => {
    chrome.storage.local.get(['apiKey', 'botId'], result => {
      if (result.apiKey || result.botId) {
        form.setFieldsValue({
          apiKey: result.apiKey || '',
          botId: result.botId || '',
        });
      }
    });
  }, [form]);

  // 保存设置
  const handleSave = async (values: { apiKey: string; botId: string }) => {
    setLoading(true);
    try {
      // 保存到本地存储
      await chrome.storage.local.set({
        apiKey: values.apiKey,
        botId: values.botId,
      });
      message.success('设置已保存');
    } catch (error) {
      message.error('保存设置失败');
      console.error('保存设置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={4}>API设置</Title>
      <Paragraph>请输入您的Coze API Key和Bot ID以启用事实核查功能。</Paragraph>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{ apiKey: '', botId: '' }}
      >
        <Form.Item
          name="apiKey"
          label="Coze API Key"
          rules={[{ required: true, message: '请输入Coze API Key' }]}
        >
          <Input.Password placeholder="输入Coze API Key" />
        </Form.Item>

        <Form.Item
          name="botId"
          label="Bot ID"
          rules={[{ required: true, message: '请输入Bot ID' }]}
        >
          <Input placeholder="输入用于事实核查的智能体ID" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存设置
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
};

export default Settings;
