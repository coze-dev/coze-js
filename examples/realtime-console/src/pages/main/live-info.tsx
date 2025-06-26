import { useEffect, useState, useRef } from 'react';

import { QRCodeSVG } from 'qrcode.react';
import { Button, Modal, Typography, Divider, message } from 'antd';
import {
  QrcodeOutlined,
  DownloadOutlined,
  CopyOutlined,
} from '@ant-design/icons';

import { LocalManager, LocalStorageKey } from '../../utils/local-manager';

export default function LiveInfo({ liveId }: { liveId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [listenUrl, setListenUrl] = useState('');
  const qrRef = useRef<SVGSVGElement>(null);
  const localManager = new LocalManager();
  const roomMode = localManager.get(LocalStorageKey.ROOM_MODE);

  useEffect(() => {
    if (!liveId) {
      return;
    }
    const baseUrl = `${window.location.origin}${window.location.pathname}/subscribe`;
    const liveUrl = `${baseUrl}?liveId=${liveId}`;
    setListenUrl(liveUrl);
    setQrCodeUrl(liveUrl);
  }, [liveId]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  // 复制链接到剪贴板
  const copyLink = () => {
    navigator.clipboard
      .writeText(listenUrl)
      .then(() => {
        message.success('链接已复制到剪贴板');
      })
      .catch(err => {
        console.error('复制失败:', err);
        message.error('复制失败，请手动复制');
      });
  };

  // 下载二维码图片
  const downloadQRCode = () => {
    if (!qrRef.current) {
      return;
    }

    // 创建一个临时的 canvas 元素
    const canvas = document.createElement('canvas');
    const svg = qrRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();

    // 将 SVG 转换为 data URL
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // 设置 canvas 尺寸
      canvas.width = img.width;
      canvas.height = img.height;

      // 在 canvas 上绘制图像
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      // 创建下载链接
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = '扫码收听.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.onerror = () => {
      console.error('图片加载失败');
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  if (roomMode !== 'translate') {
    return null;
  }

  return (
    <span>
      <Button type="primary" icon={<QrcodeOutlined />} onClick={showModal}>
        扫码收听
      </Button>

      <Modal
        title="扫码收听"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={400}
      >
        <div style={{ background: '#f0f8ff', padding: 20, borderRadius: 8 }}>
          <Typography.Title level={5} style={{ marginBottom: 16 }}>
            手机扫码收听:
          </Typography.Title>

          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div
              style={{
                width: 200,
                height: 200,
                margin: '0 auto',
                border: '1px solid #e8e8e8',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'white',
                padding: 10,
              }}
            >
              <QRCodeSVG value={qrCodeUrl} size={180} ref={qrRef} level="H" />
            </div>
            <Button
              type="text"
              icon={<DownloadOutlined />}
              style={{ marginTop: 8 }}
              onClick={downloadQRCode}
            >
              下载二维码
            </Button>
          </div>

          <Divider style={{ margin: '12px 0' }} />

          <Typography.Title level={5} style={{ marginBottom: 16 }}>
            网页收听地址:
          </Typography.Title>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Typography.Text ellipsis style={{ flex: 1 }}>
              {listenUrl}
            </Typography.Text>
            <Button
              type="primary"
              size="small"
              icon={<CopyOutlined />}
              onClick={copyLink}
            >
              复制
            </Button>
          </div>
        </div>
      </Modal>
    </span>
  );
}
