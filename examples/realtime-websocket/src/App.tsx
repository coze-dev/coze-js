import {
  HashRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { useState } from 'react';

import { Layout, Menu, theme, Button } from 'antd';
import {
  AudioOutlined,
  MessageOutlined,
  CustomerServiceOutlined,
  ExperimentOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  GithubOutlined,
} from '@ant-design/icons';

import Transcription from './pages/transcription';
import Speech from './pages/speech';
import Chat from './pages/chat';
import AudioTest from './pages/audio-test';
import logo from './logo.svg';

const { Header, Content, Sider } = Layout;

const menuItems = [
  {
    key: '/',
    icon: <MessageOutlined />,
    label: '实时语音',
  },
  {
    key: '/transcription',
    icon: <CustomerServiceOutlined />,
    label: '语音识别',
  },
  {
    key: '/speech',
    icon: <ExperimentOutlined />,
    label: '语音合成',
  },
  {
    key: '/audio-test',
    icon: <AudioOutlined />,
    label: '音频测试',
  },
];

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={value => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth="0"
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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Button
            type="link"
            icon={<GithubOutlined />}
            href="https://github.com/coze-dev/coze-js/tree/main/examples/realtime-websocket"
            target="_blank"
          >
            GitHub
          </Button>
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
