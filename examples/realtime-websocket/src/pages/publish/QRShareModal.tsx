/* eslint-disable */
import { Modal, Button, Typography, QRCode } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { usePublish } from './PublishContext';

export const QRShareModal = () => {
  const { isQrModalOpen, shareUrl, isMobile, setIsQrModalOpen, handleCopyUrl } =
    usePublish();

  console.log('shareUrl', shareUrl);

  return (
    <Modal
      title="扫码收听"
      open={isQrModalOpen}
      onCancel={() => setIsQrModalOpen(false)}
      footer={null}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography.Text style={{ marginBottom: '16px' }}>
          手机扫码收听:
        </Typography.Text>

        <QRCode
          value={shareUrl}
          style={{ marginBottom: '24px' }}
          size={isMobile ? 150 : 200}
        />

        <div style={{ width: '100%' }}>
          <Typography.Text>网页收听地址:</Typography.Text>
          <div
            style={{
              display: 'flex',
              marginTop: '8px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                flex: 1,
                padding: '8px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {shareUrl}
            </div>
            <Button
              icon={<CopyOutlined />}
              onClick={handleCopyUrl}
              style={{ borderLeft: '1px solid #d9d9d9', borderRadius: 0 }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QRShareModal;
