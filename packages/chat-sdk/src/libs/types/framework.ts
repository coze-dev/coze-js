import React from 'react';

import type {
  AuthConf,
  UserInfo,
  ChatInfo,
  SettingInfo,
  HeaderConfig,
  FooterConfig,
  ChatSlotConfig,
  IOnImageClickEvent,
  ErrorUiConfig,
  LoadingUiConfig,
  ThemeType,
  IMessageCallback,
} from './base';

export interface ChatFrameworkProps {
  chat: ChatInfo;
  auth: AuthConf;
  user: UserInfo;
  ui?: {
    layout?: 'pc' | 'mobile'; // 默认为pc
    frameworkClassName?: string; // 框架整体区域
    chatSlotClassName?: string; // 聊天区域
    isMiniCustomHeader?: boolean; // 默认为false
    isReadonly?: boolean; // 不能交互，只能查看
    header?: HeaderConfig;
    footer?: FooterConfig;
    chatSlot?: ChatSlotConfig;
    error?: ErrorUiConfig;
    loading?: LoadingUiConfig;
  };
  setting: SettingInfo;
  children?: React.ReactNode;
  eventCallbacks?: {
    onImageClick?: IOnImageClickEvent;
    onInitRetry?: () => void;
    onThemeChange?: (theme: ThemeType) => void;
    message?: IMessageCallback;
  };
}
