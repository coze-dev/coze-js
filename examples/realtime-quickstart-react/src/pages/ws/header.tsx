import React from 'react';
import { Layout, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import './header.css';
import Settings from '../../components/settings';

const { Header } = Layout;
export type AppHeaderProps = {
  onSettingsChange: () => void;
  localStorageKey: string;
};
const AppHeader: React.FC<AppHeaderProps> = ({
  onSettingsChange,
  localStorageKey,
}) => {
  return (
    <Header className="header">
      <div className="logo">Coze - WsChatClient</div>
      <div className="rightContent">
        <Settings
          onSettingsChange={onSettingsChange}
          localStorageKey={localStorageKey}
        />
      </div>
    </Header>
  );
};

export default AppHeader;
