import React from 'react';
import { Layout } from 'antd';
import './header.css';
import Settings from '../../components/settings';
import logo from '../../logo.svg';

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
    </div>
  </Header>
);

export default AppHeader;
