import {
  HashRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { useState } from 'react';

import { Layout, Menu, theme, Button, Space } from 'antd';
import {
  MessageOutlined,
  CustomerServiceOutlined,
  ExperimentOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  GithubOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

import Transcription from './pages/transcription';
import Speech from './pages/speech';
import SimultInterpretation from './pages/simult-interpretation';
import Chat from './pages/chat';
import AudioTest from './pages/audio-test';
import TTSWithTranscription from './pages/tts_transcription';
import logo from './logo.svg';
import './App.css';
const { Header, Content, Sider } = Layout;

const menuItems = [
  {
    key: '/',
    icon: <MessageOutlined />,
    label: '实时语音对话',
    title: '实时语音对话 (Chat) 演示',
  },
  {
    key: '/transcription',
    icon: <CustomerServiceOutlined />,
    label: '语音识别',
    title: '语音识别 (ASR) 演示',
  },
  {
    key: '/speech',
    icon: <ExperimentOutlined />,
    label: '语音合成',
    title: '语音合成 (TTS) 演示',
  },
  {
    key: '/simult',
    icon: <CustomerServiceOutlined />,
    label: '同声传译',
    title: '多语种实时翻译 (Simult) 演示',
  },
  {
    key: '/tts_transcription',
    icon: <ExperimentOutlined />,
    label: '语音识别+实时语音对话',
    title: '语音识别 (ASR) +TTS',
  },
  // {
  //   key: '/audio-test',
  //   icon: <AudioOutlined />,
  //   label: '音频测试',
  // },
];

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 获取当前路由对应的菜单项的title
  const currentMenuItem = menuItems.find(
    item => item.key === location.pathname,
  );
  const currentTitle = currentMenuItem?.title || '扣子实时语音对话';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={value => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth="0"
        style={{ zIndex: 2 }}
        trigger={null}
      >
        <div
          style={{
            height: 40,
            margin: 16,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            overflow: 'hidden',
            transition: 'all 0.2s',
          }}
        >
          <img
            src={logo}
            alt="logo"
            style={{
              height: 40,
              marginRight: collapsed ? 0 : 8,
              transition: 'all 0.2s',
            }}
          />
          {!collapsed && (
            <span
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 600,
                opacity: collapsed ? 0 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              扣子
            </span>
          )}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
          className="responsive-header"
        >
          <div className="header-content">
            <div className="header-left">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 40,
                  height: 64,
                }}
              />
              <h3
                style={{
                  fontSize: '16px',
                  marginBottom: '0',
                  lineHeight: '64px',
                }}
              >
                {currentTitle}
              </h3>
            </div>

            <div className="header-right">
              <Space size={2} style={{ display: 'flex' }}>
                <Button
                  type="link"
                  icon={<FileTextOutlined />}
                  href="https://github.com/coze-dev/coze-js/discussions"
                  target="_blank"
                  style={{ padding: '0 8px' }}
                >
                  文档
                </Button>

                <Button
                  type="link"
                  icon={<GithubOutlined />}
                  href="https://github.com/coze-dev/coze-js/tree/main/examples/realtime-websocket"
                  target="_blank"
                  style={{ padding: '0 8px' }}
                >
                  GitHub
                </Button>
              </Space>
            </div>
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div
            style={{
              // padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              height: '100%',
            }}
          >
            <Routes>
              <Route path="/" element={<Chat />} />
              <Route path="/audio-test" element={<AudioTest />} />
              <Route path="/transcription" element={<Transcription />} />
              <Route path="/speech" element={<Speech />} />
              <Route path="/simult" element={<SimultInterpretation />} />
              <Route
                path="/tts_transcription"
                element={<TTSWithTranscription />}
              />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;
