import React from 'react';

import { Layout, Button } from 'antd';
import { GithubOutlined } from '@ant-design/icons';

import './header.css';
// @ts-expect-error-error xx
import logo from '../../logo.svg';
import Settings from '../../components/settings';

const { Header } = Layout;
export interface AppHeaderProps {
  onSettingsChange: () => void;
  localStorageKey: string;
  title: string;
}
const AppHeader: React.FC<AppHeaderProps> = ({
  onSettingsChange,
  localStorageKey,
  title,
}) => (
  <Header className="header">
    <div className="logo">
      <img src={logo} alt="logo" />
      &nbsp;{title}
    </div>
    <div className="rightContent">
      <Settings
        onSettingsChange={onSettingsChange}
        localStorageKey={localStorageKey}
      />
      <Button
        type="link"
        icon={<GithubOutlined />}
        href="https://github.com/coze-dev/coze-js/tree/main/examples/realtime-websocket"
        target="_blank"
      >
        Github
      </Button>
    </div>
  </Header>
);

export default AppHeader;
