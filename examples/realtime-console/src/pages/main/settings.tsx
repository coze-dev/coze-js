import React, { useState } from 'react';

import Link from 'antd/es/typography/Link';
import { Layout, Button, Modal } from 'antd';
import { type RealtimeClient } from '@coze/realtime-api';
import { SettingOutlined, FileTextOutlined } from '@ant-design/icons';

import { LocalManager, LocalStorageKey } from '../../utils/local-manager';
import { DOCS_URL } from '../../utils/constants';
import logo from '../../logo.svg';
import useNetworkError from '../../hooks/use-network-error';
import SettingForm from './setting-form';
const { Header } = Layout;

interface SettingsProps {
  onSaveSettings: () => void;
  clientRef: React.MutableRefObject<RealtimeClient | null>;
}

const Settings: React.FC<SettingsProps> = ({ onSaveSettings, clientRef }) => {
  const localManager = new LocalManager();
  const [isModalVisible, setIsModalVisible] = useState(
    !localManager.get(LocalStorageKey.BOT_ID),
  );
  const { connectStatus } = useNetworkError({ clientRef });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    onSaveSettings();
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Header
        style={{
          padding: '16px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          height: 'auto',
          minHeight: '64px',
          lineHeight: 'normal',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flex: '1 1 auto',
            minWidth: '200px',
          }}
        >
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
              minWidth: 0,
            }}
          >
            Coze Realtime Console
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexShrink: 0,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              color: 'white',
              padding: '0 8px',
              borderRadius: '4px',
              height: '32px',
              textAlign: 'center',
              lineHeight: '32px',
              backgroundColor:
                connectStatus === 'connected' ? '#52c41a' : '#ff4d4f',
            }}
          >
            Status: {connectStatus}
          </div>
          <Link href={DOCS_URL} target="_blank">
            <Button type="primary" icon={<FileTextOutlined />}>
              Document
            </Button>
          </Link>

          <Button icon={<SettingOutlined />} onClick={showModal}>
            Settings
          </Button>
        </div>
      </Header>

      <Modal
        title="Settings"
        open={isModalVisible}
        onCancel={hideModal}
        footer={null}
        destroyOnClose={true}
      >
        <SettingForm onCancel={hideModal} onOk={handleOk} />
      </Modal>
    </>
  );
};

export default Settings;
