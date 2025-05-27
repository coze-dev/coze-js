/* eslint-disable */
import { Button } from 'antd';
import { AudioOutlined, PauseOutlined } from '@ant-design/icons';
import { usePublish } from './PublishContext';
import VolumeIndicator from './VolumeIndicator';
import { ResourceStatus } from '../../utils/webrtc-service';
import { Typography } from 'antd';

export const MicrophoneButton = () => {
  const {
    isConnected,
    isConnecting,
    isMuted,
    connectionStatus,
    isMobile,
    handleToggleMute,
    handleStartPublishing,
  } = usePublish();

  return (
    <div style={{ marginBottom: isMobile ? '16px' : '24px', textAlign: 'center' }}>
      <Button
        type="primary"
        shape="circle"
        icon={
          isConnected ? (
            isMuted ? (
              <AudioOutlined />
            ) : (
              <PauseOutlined />
            )
          ) : (
            <AudioOutlined />
          )
        }
        size="large"
        style={{
          width: isMobile ? '60px' : '80px',
          height: isMobile ? '60px' : '80px',
          fontSize: isMobile ? '24px' : '32px',
        }}
        onClick={isConnected ? handleToggleMute : handleStartPublishing}
        loading={isConnecting}
        danger={isConnected && !isMuted}
      />

      {/* 显示麦克风音量 */}
      {isConnected && !isMuted && <VolumeIndicator />}

      {/* 显示连接状态 */}
      {connectionStatus !== ResourceStatus.IDLE && (
        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <Typography.Text
            type={
              connectionStatus === ResourceStatus.CONNECTED
                ? 'success'
                : connectionStatus === ResourceStatus.CONNECTING
                  ? 'warning'
                  : 'danger'
            }
          >
            {connectionStatus === ResourceStatus.CONNECTED
              ? '已连接'
              : connectionStatus === ResourceStatus.CONNECTING
                ? '连接中'
                : connectionStatus === ResourceStatus.FAILED
                  ? '连接失败'
                  : '已断开'}
          </Typography.Text>
        </div>
      )}
    </div>
  );
};

export default MicrophoneButton;
