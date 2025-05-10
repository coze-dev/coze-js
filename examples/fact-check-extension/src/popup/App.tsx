/* eslint-disable */
import React, { useEffect, useState } from 'react';
import './markdown.css'; // 稍后会创建这个CSS文件

import {
  Typography,
  Card,
  Space,
  Button,
  Tabs,
  Spin,
  Result,
  Input,
} from 'antd';
import { SettingOutlined, CheckCircleOutlined } from '@ant-design/icons';

import Settings from './Settings';

const { Title, Paragraph } = Typography;

// 处理Markdown格式的函数
function processMarkdown(text: string): string {
  if (!text) return '';

  // 使用正则表达式处理Markdown格式
  return (
    text
      // 处理标题
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      // 处理粗体和斜体
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // 处理链接，在新标签页打开
      .replace(
        /\[(.+?)\]\((.+?)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
      )
      // 处理列表
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      // 处理段落和换行
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
  );
}

const { TextArea } = Input;

// 核查组件
const FactCheck: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [factCheckResult, setFactCheckResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // 加载待核查的文本
  useEffect(() => {
    chrome.storage.local.get(['pendingVerification'], result => {
      if (result.pendingVerification) {
        setText(result.pendingVerification);
        chrome.storage.local.remove(['pendingVerification']);
      }
    });

    // 添加消息监听器，接收来自后台脚本的核查结果
    const messageListener = (
      message: any,
      _sender: any,
      _sendResponse: any,
    ) => {
      console.log('接收到消息:', message);

      if (message.action === 'factCheckTextResult') {
        if (message.error) {
          setHasError(true);
          setFactCheckResult(message.error);
        } else if (message.result) {
          setFactCheckResult(message.result);
        }
        setLoading(false);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  // 核查文本
  const factCheckText = () => {
    if (!text.trim()) {
      return;
    }

    setLoading(true);
    setHasError(false);
    setFactCheckResult('');

    try {
      chrome.runtime.sendMessage(
        { action: 'factCheckText', text },
        response => {
          console.log('初始响应:', response);

          if (chrome.runtime.lastError) {
            console.error('Runtime error:', chrome.runtime.lastError);
            setHasError(true);
            setFactCheckResult(
              chrome.runtime.lastError.message || '无法与服务器建立连接',
            );
            setLoading(false);
          }

          if (response && response.status !== 'processing') {
            setLoading(false);
          }
        },
      );
    } catch (error) {
      setHasError(true);
      setFactCheckResult('无法连接到背景脚本，请重试');
      setLoading(false);
      console.error('factCheckText error', error);
    }
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <TextArea
        rows={4}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="输入或粘贴需要核查的新闻文本"
      />

      <Button
        type="primary"
        onClick={factCheckText}
        loading={loading}
        disabled={!text.trim()}
        block
      >
        核查文本真实性
      </Button>

      {loading && (
        <Card>
          <Spin spinning={true} />
          <Paragraph style={{ textAlign: 'center', marginTop: '10px' }}>
            正在分析中，请稍候...
          </Paragraph>
        </Card>
      )}

      {factCheckResult && !loading && (
        <Card>
          {hasError ? (
            <Result
              status="error"
              title="核查失败"
              subTitle={factCheckResult}
            />
          ) : (
            <div>
              <Title style={{ marginTop: '0' }} level={4}>
                核查结果
              </Title>
              <div
                dangerouslySetInnerHTML={{
                  __html: processMarkdown(factCheckResult),
                }}
                className="markdown-content"
              />
            </div>
          )}
        </Card>
      )}

      {!text && !factCheckResult && !loading && (
        <Card>
          <Paragraph>
            使用方法：右键选中网页上的新闻文本，选择「事实核查」选项。
          </Paragraph>
          <Paragraph>您也可以在此页面直接粘贴文本进行核查。</Paragraph>
        </Card>
      )}
    </Space>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('factCheck');

  useEffect(() => {
    chrome.storage.local.get(['pendingVerification'], result => {
      if (result.pendingVerification) {
        setActiveTab('factCheck');
      }
    });
  }, []);

  return (
    <div style={{ width: '350px', padding: '16px' }}>
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Title level={3} style={{ margin: '0' }}>
          事实核查
        </Title>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'factCheck',
              label: (
                <span>
                  <CheckCircleOutlined />
                  核查
                </span>
              ),
              children: <FactCheck />,
            },
            {
              key: 'settings',
              label: (
                <span>
                  <SettingOutlined />
                  设置
                </span>
              ),
              children: <Settings />,
            },
          ]}
        />
      </Space>
    </div>
  );
};

export default App;
