/* eslint-disable */
import { Button, Row, Col, Select } from 'antd';
import { SoundOutlined } from '@ant-design/icons';
import { usePublish } from './PublishContext';

export const ControlsPanel = () => {
  const {
    isConnected,
    isConnecting,
    inputDevices,
    selectedInputDevice,
    isMobile,
    handleSetAudioInputDevice,
    handleShowQrModal,
    handleStopPublishing,
  } = usePublish();

  return (
    <Row gutter={isMobile ? 8 : 16} style={{ width: '100%' }}>
      <Col
        span={24}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: isMobile ? '8px' : '16px',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
        }}
      >
        {/* Source Selection */}
        <Select
          style={{
            width: isMobile ? '100%' : '200px',
            marginBottom: isMobile ? '8px' : 0,
          }}
          placeholder="选择声源"
          value={selectedInputDevice}
          onChange={handleSetAudioInputDevice}
          disabled={isConnecting || isConnected}
        >
          {inputDevices.map(device => (
            <Select.Option key={device.deviceId} value={device.deviceId}>
              {device.label || `麦克风 ${device.deviceId.slice(0, 8)}...`}
            </Select.Option>
          ))}
        </Select>

        {/* Voice Broadcast Button */}
        <Button
          icon={<SoundOutlined />}
          onClick={handleShowQrModal}
          disabled={!isConnected}
        >
          语音播报
        </Button>

        {/* End Meeting Button */}
        {isConnected && (
          <Button
            danger
            onClick={handleStopPublishing}
            disabled={isConnecting}
          >
            结束会议
          </Button>
        )}
      </Col>
    </Row>
  );
};

export default ControlsPanel;
