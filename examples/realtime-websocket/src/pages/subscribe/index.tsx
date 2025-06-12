/* eslint-disable */
import { Layout } from 'antd';
import { ConsoleLog } from '../../components/console-log';
import { SubscribeProvider, useSubscribe } from './SubscribeContext';
import HeaderSection from './HeaderSection';
import AudioCards from './AudioCards';
import AudioPlayer from './AudioPlayer';

const { Content } = Layout;

// Internal component that uses the context
const SubscribeContent = () => {
  const { isMobile } = useSubscribe();

  return (
    <Layout style={{ height: '100vh', background: '#f0f5ff' }}>
      <HeaderSection />

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
        <AudioCards />
        <AudioPlayer />
      </Content>

      {/* 在移动端显示调试控制台 */}
      {isMobile && <ConsoleLog />}
    </Layout>
  );
};

// Main component that provides context
function Subscribe() {
  return (
    <SubscribeProvider>
      <SubscribeContent />
    </SubscribeProvider>
  );
}

export default Subscribe;
