import React from 'react';

import { Layout } from 'antd';

import './header.css';
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
        fields={[]}
      />
    </div>
  </Header>
);

export default AppHeader;
