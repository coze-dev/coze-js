/* eslint-disable */
import { useState, useEffect, useRef } from 'react';
import {
  Layout,
  Card,
  Space,
  Typography,
  Button,
  message,
  Tag,
  Tooltip,
} from 'antd';
import {
  SoundOutlined,
  SoundFilled,
  DisconnectOutlined,
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { RetrieveLiveData } from '@coze/api';
import logo from '../../logo.svg';
import { ConsoleLog } from '../main/console-log';
import useIsMobile from '../../hooks/use-is-mobile';
import { WebLiveClient, ResourceStatus } from '@coze/realtime-api/live';

const { Content, Header } = Layout;
const { Text, Title } = Typography;

// 主组件，包含所有功能
function Subscribe() {
  // 状态管理
  const [isMuted, setIsMuted] = useState(false);
  const [curStreamId, setCurStreamId] = useState('');
  const [status, setStatus] = useState<ResourceStatus>(ResourceStatus.IDLE);
  const clientRef = useRef<WebLiveClient | null>(null);
  const [liveData, setLiveData] = useState<RetrieveLiveData | null>(null);

  // 获取URL参数
  const location = useLocation();
  // 检测是否是移动设备
  const isMobile = useIsMobile();

  const initClient = async () => {
    try {
      const query = new URLSearchParams(location.search);
      const liveId = query.get('liveId');
      if (!liveId) {
        message.error('缺少必要的URL参数: liveId');
        return;
      }
      // 初始化客户端
      const client = new WebLiveClient(liveId);
      // 监听 RTC 状态变化
      client.onStatusChange(setStatus);

      // 获取直播信息
      const liveData = await client.getLiveData();
      setLiveData(liveData);

      clientRef.current = client;
    } catch (error) {
      console.error('Failed to initialize client:', error);
      message.error(
        `初始化失败: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  useEffect(() => {
    initClient();

    return () => {
      clientRef.current?.offStatusChange(setStatus);
      clientRef.current?.close();
      clientRef.current = null;
    };
  }, []);

  // 静音/取消静音
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    clientRef.current?.setMuted(!isMuted);
  };

  // 订阅音频流
  const handleSubscribe = async (streamId: string) => {
    if (curStreamId === streamId) {
      return;
    }
    if (curStreamId) {
      // 如果当前有订阅，则先取消订阅
      const success = await handleUnsubscribe();
      if (!success) {
        return;
      }
    }
    try {
      setCurStreamId(streamId);

      // 生成随机客户端ID
      const clientId = `client_${Math.random().toString(36).substring(2, 9)}`;

      // 订阅音频流
      await clientRef.current?.subscribe(
        liveData?.app_id || '',
        streamId,
        clientId,
      );
    } catch (error) {
      console.error('Failed to subscribe:', error);
      message.error(
        `订阅失败: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  // 取消订阅
  const handleUnsubscribe = async () => {
    try {
      await clientRef.current?.unsubscribe();
      setCurStreamId('');
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      return false;
    }
  };

  return (
    <Layout style={{ height: '100vh', background: '#f0f5ff' }}>
      {/* 头部组件 */}
      <Header
        style={{
          background: '#fff',
          padding: '0 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            <img
              src={logo}
              alt="logo"
              style={{
                height: 40,
                marginRight: 8,
                transition: 'all 0.2s',
              }}
            />
            扣子同传
          </Title>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Tag
            color={
              status === ResourceStatus.CONNECTED
                ? 'success'
                : status === ResourceStatus.CONNECTING
                  ? 'processing'
                  : 'default'
            }
          >
            {status === ResourceStatus.CONNECTED
              ? '已连接'
              : status === ResourceStatus.CONNECTING
                ? '连接中'
                : status === ResourceStatus.FAILED
                  ? '连接失败'
                  : status === ResourceStatus.CLOSED
                    ? '已关闭'
                    : '空闲'}
          </Tag>
          {curStreamId && status === ResourceStatus.CONNECTED && (
            <Tooltip title="取消订阅">
              <Button
                type="primary"
                danger
                icon={<DisconnectOutlined />}
                onClick={handleUnsubscribe}
                size="middle"
              >
                取消订阅
              </Button>
            </Tooltip>
          )}
          <Button
            type="text"
            size="large"
            icon={isMuted ? <SoundOutlined /> : <SoundFilled />}
            onClick={handleToggleMute}
          />
        </div>
      </Header>

      {/* 主要内容区域 */}
      <Content
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
        }}
      >
        {/* 音频卡片列表 */}
        <Space
          direction="vertical"
          size="large"
          style={{ width: '100%', maxWidth: '480px' }}
        >
          {liveData?.stream_infos.length === 0 && (
            <Card
              style={{
                width: '100%',
                height: '120px',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <Text>加载中...</Text>
              </div>
            </Card>
          )}
          {liveData?.stream_infos.map(streamInfo => (
            <Card
              key={streamInfo.stream_id}
              hoverable
              style={{
                width: '100%',
                height: '120px',
                borderRadius: '12px',
                borderColor:
                  curStreamId === streamInfo.stream_id &&
                  status === ResourceStatus.CONNECTED
                    ? '#1890ff'
                    : undefined,
                borderWidth:
                  curStreamId === streamInfo.stream_id &&
                  status === ResourceStatus.CONNECTED
                    ? '2px'
                    : '1px',
                boxShadow:
                  curStreamId === streamInfo.stream_id &&
                  status === ResourceStatus.CONNECTED
                    ? '0 0 10px rgba(24, 144, 255, 0.5)'
                    : undefined,
              }}
              onClick={() => handleSubscribe(streamInfo.stream_id)}
              loading={status === ResourceStatus.CONNECTING}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {streamInfo.name}
                  </Text>
                  {curStreamId === streamInfo.stream_id && (
                    <Tag
                      color={
                        status === ResourceStatus.CONNECTED
                          ? 'green'
                          : status === ResourceStatus.CONNECTING
                            ? 'processing'
                            : 'default'
                      }
                    >
                      {status === ResourceStatus.CONNECTED
                        ? '已连接'
                        : status === ResourceStatus.CONNECTING
                          ? '连接中'
                          : '选择连接'}
                    </Tag>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </Space>
      </Content>
      {isMobile && <ConsoleLog />}
    </Layout>
  );
}

export default Subscribe;
