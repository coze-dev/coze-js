/* eslint-disable */
import { Button, Typography, Layout } from 'antd';
import { SoundOutlined, SoundFilled } from '@ant-design/icons';
import { useSubscribe } from './SubscribeContext';
import logo from '../../logo.svg';
const { Header } = Layout;
const { Title } = Typography;

export const HeaderSection = () => {
  const { isMuted, handleToggleMute } = useSubscribe();

  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Title level={4} style={{ margin: 0 }}>
        <img
          src={logo}
          alt="logo"
          style={{
            height: 40,
            marginRight: 8,
            transition: 'all 0.2s',
          }}
        />
        扣子同传
      </Title>
      <Button
        type="text"
        size="large"
        icon={isMuted ? <SoundOutlined /> : <SoundFilled />}
        onClick={handleToggleMute}
      />
    </Header>
  );
};

export default HeaderSection;
