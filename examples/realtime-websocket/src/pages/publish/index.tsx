/* eslint-disable */
import { Layout } from 'antd';
import Settings from '../../components/settings';
import { ConsoleLog } from '../../components/console-log';
import { PublishProvider, usePublish } from './PublishContext';
import MicrophoneButton from './MicrophoneButton';
import ControlsPanel from './ControlsPanel';
import InstructionsCard from './InstructionsCard';
import QRShareModal from './QRShareModal';

const { Content } = Layout;

// Internal component that uses the context
const PublishContent = () => {
  const { isMobile, localStorageKey, handleSettingsChange } = usePublish();

  return (
    <Layout style={{ height: '100%', background: '#fff' }}>
      <Settings
        onSettingsChange={handleSettingsChange}
        localStorageKey={localStorageKey}
        fields={['app_id', 'stream_id', 'pat']}
        className="settings-button"
      />
      <Content
        style={{
          padding: isMobile ? '16px' : '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
            width: '100%',
            maxWidth: '600px',
          }}
        >
          {/* Microphone Button Component */}
          <MicrophoneButton />

          {/* Controls Panel Component */}
          <ControlsPanel />
        </div>

        {/* Instructions Card Component */}
        <InstructionsCard />
      </Content>

      {/* 在移动端显示控制台日志 */}
      {isMobile && <ConsoleLog />}

      {/* QR Code Modal Component */}
      <QRShareModal />
    </Layout>
  );
};

// Main component that provides context
function Publish() {
  return (
    <PublishProvider>
      <PublishContent />
    </PublishProvider>
  );
}

export default Publish;
