import React from 'react';

import { SuggestPromoteInfo } from '@/libs/types/base/chat';
import type {
  SettingInfo,
  FooterConfig,
  HeaderConfig,
  UserInfo,
  InputConfig,
  ClearContextConfig,
  ClearMessageConfig,
  UploadBtnConfig,
  ThemeType,
  MessageUiConfigMap,
  IMessageCallback,
  MessageWrapperConfig,
} from '@/libs/types';

export type OnImageClick = (extra: { url: string }) => void;

export interface IWorkflow {
  id?: string;
  parameters?: Record<string, unknown>;
  header?: Record<string, string>;
}

export interface IProject {
  id: string;
  type: 'app' | 'bot';
  mode: 'draft' | 'release' | 'websdk'; // 草稿模式 | 发布模式 | webSdk发布
  caller?: 'UI_BUILDER' | 'CANVAS';
  connectorId?: string;
  conversationName?: string; // project的话，必须填写
  name?: string;
  defaultName?: string; // 优先级最低，兼容老数据
  desc?: string;
  iconUrl?: string;
  defaultIconUrl?: string; // 优先级最低，兼容老数据
  onBoarding?: {
    prologue?: string;
    suggestions?: string[];
  };
  suggestPromoteInfo?: SuggestPromoteInfo;
}
export interface IEventCallbacks {
  onImageClick?: (extra: { url: string }) => void;
  onGetChatFlowExecuteId?: (id: string) => void;
  onThemeChange?: (theme: ThemeType) => void;
  onInitSuccess?: () => void;
  message?: IMessageCallback;
}
export interface IChatFlowProps {
  workflow: IWorkflow;
  project: IProject;
  eventCallbacks?: IEventCallbacks;
  userInfo: UserInfo;
  areaUi: {
    layout?: 'pc' | 'mobile'; // 默认为pc
    isMiniCustomHeader?: boolean; // 默认为false
    isDisabled?: boolean; // 默认 false
    input?: InputConfig;
    clearContext?: ClearContextConfig;
    clearMessage?: ClearMessageConfig;
    uploadBtn?: UploadBtnConfig;
    header?: HeaderConfig; // 默认是
    footer?: FooterConfig;
    uiTheme?: 'uiBuilder' | 'chatFlow'; // uiBuilder 的主题
    renderLoading?: () => React.ReactNode;
    bgInfo?: {
      imgUrl: string;
      themeColor: string; // 背景颜色
    };
    message?: MessageUiConfigMap;
    messageWrapper?: MessageWrapperConfig;
  };
  auth?: {
    type: 'external' | 'internal'; // 内部： cookie换token， 外部： internal
    token?: string;
    refreshToken?: () => Promise<string> | string;
  };
  setting: SettingInfo;
  style?: React.CSSProperties;
}
