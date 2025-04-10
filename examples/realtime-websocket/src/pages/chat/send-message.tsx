import { type MutableRefObject, useState } from 'react';

import { Button, Col, Input, Modal, Row } from 'antd';
import { type WsChatClient } from '@coze/api/ws-tools';

const SendMessage = ({
  isConnected,
  clientRef,
}: {
  isConnected: boolean;
  clientRef: MutableRefObject<WsChatClient | undefined>;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isSignalModalVisible, setIsSignalModalVisible] = useState(false);
  const [signalText, setSignalText] = useState('');
  const [signalError, setSignalError] = useState('');

  const handleSendText = (text: string) => {
    clientRef.current?.sendTextMessage(text);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showSignalModal = () => {
    setIsSignalModalVisible(true);
    setSignalText('');
    setSignalError('');
  };

  const handleOk = () => {
    if (inputText.trim()) {
      handleSendText(inputText);
      setInputText('');
      setIsModalVisible(false);
    }
  };

  const handleSignalOk = () => {
    if (signalText.trim()) {
      try {
        // Validate JSON
        const jsonData = JSON.parse(signalText);
        // Send signal
        clientRef.current?.sendMessage(jsonData);
        setSignalText('');
        setSignalError('');
        setIsSignalModalVisible(false);
      } catch (error) {
        setSignalError('无效的JSON格式');
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setInputText('');
  };

  const handleSignalCancel = () => {
    setIsSignalModalVisible(false);
    setSignalText('');
    setSignalError('');
  };

  return (
    <>
      <Row justify="center" style={{ marginTop: '10px' }}>
        <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
          <Button size="large" disabled={!isConnected} onClick={showModal}>
            发送文本
          </Button>
          <Button
            size="large"
            disabled={!isConnected}
            onClick={showSignalModal}
            style={{ marginLeft: '10px' }}
          >
            发送事件
          </Button>
        </Col>
      </Row>
      <Modal
        title="发送文本消息"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input.TextArea
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="请输入要发送的文本"
          rows={4}
        />
      </Modal>
      <Modal
        title="发送事件"
        open={isSignalModalVisible}
        onOk={handleSignalOk}
        onCancel={handleSignalCancel}
      >
        <Input.TextArea
          value={signalText}
          onChange={e => {
            setSignalText(e.target.value);
            setSignalError('');
          }}
          placeholder="请输入JSON格式的事件"
          rows={6}
          status={signalError ? 'error' : ''}
        />
        {signalError && (
          <div style={{ color: 'red', marginTop: '8px' }}>{signalError}</div>
        )}
      </Modal>
    </>
  );
};

export default SendMessage;
