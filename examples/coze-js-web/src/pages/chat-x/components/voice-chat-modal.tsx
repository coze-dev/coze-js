import React from 'react';

import { Modal, Button, Space } from 'antd';
import { AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';

interface VoiceChatModalProps {
  open: boolean;
  onClose: () => void;
  recording: boolean;
  onRecordingChange: (recording: boolean) => void;
}

const VoiceChatModal: React.FC<VoiceChatModalProps> = ({
  open,
  onClose,
  recording,
  onRecordingChange,
}) => (
  <Modal
    title="Voice Chat"
    open={open}
    onCancel={onClose}
    footer={null}
    centered
    width={300}
  >
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <Space direction="vertical" size="large">
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={recording ? <AudioMutedOutlined /> : <AudioOutlined />}
          style={{ width: 80, height: 80, fontSize: 24 }}
          onClick={() => onRecordingChange(!recording)}
        />
        <div>{recording ? 'Click to End Chat' : 'Click to Start Chat'}</div>
      </Space>
    </div>
  </Modal>
);

export default VoiceChatModal;
