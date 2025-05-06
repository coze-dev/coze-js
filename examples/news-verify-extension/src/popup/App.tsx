import React from 'react';

import { Typography, Card, Space } from 'antd';

const { Title, Paragraph } = Typography;

const App: React.FC = () => (
  <div style={{ width: '300px', padding: '16px' }}>
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Title level={3}>News Verify Extension</Title>
      <Card>
        <Paragraph>
          Hello World! This is a simple browser extension for news verification.
        </Paragraph>
        <Paragraph>More features will be added soon3.</Paragraph>
      </Card>
    </Space>
  </div>
);

export default App;
