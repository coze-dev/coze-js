/* eslint-disable */
import { Card, Space, Typography } from 'antd';
import { useSubscribe } from './SubscribeContext';

const { Text } = Typography;

export const AudioCards = () => {
  const { isConnecting, handleListenTranslation } = useSubscribe();

  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: '100%', maxWidth: '480px' }}
    >
      {/* 听翻译卡片 */}
      <Card
        hoverable
        style={{ width: '100%', height: '120px', borderRadius: '12px' }}
        onClick={handleListenTranslation}
        loading={isConnecting}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>
            听翻译
          </Text>
        </div>
      </Card>

      {/* 听原生卡片（禁用状态） */}
      <Card
        hoverable
        style={{
          width: '100%',
          height: '120px',
          borderRadius: '12px',
          opacity: 0.6, // 降低不可用功能的透明度
          cursor: 'not-allowed',
          pointerEvents: 'none', // 禁用点击事件
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
          <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>
            听原生
          </Text>
        </div>
      </Card>
    </Space>
  );
};

export default AudioCards;
