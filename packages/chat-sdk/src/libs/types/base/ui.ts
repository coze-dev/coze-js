import React from 'react';

import { II18n } from '../utils/i18n';
import { IMiniChatError } from '../utils/error';
import { type RawMessage } from '../services/send-message';
import { ChatMessage, ChatMessageGroup } from './message';
import { IOnImageClickEvent, IOnTaskListChange } from './event-callback';

export type MessageUiConfigMap = Partial<
  Record<'text' | 'object_string' | 'card' | 'chatflow_node', MessageUiConfig>
>;
export interface IMessageContentProps {
  message: ChatMessage;
  isAWaiting?: boolean;
  i18n?: II18n;
  isLastMessage?: boolean;
  isReadOnly?: boolean;
  onImageClick?: IOnImageClickEvent;
  onTaskChange?: IOnTaskListChange;
  //disabled?: boolean;
  messageUiConfigMap?: MessageUiConfigMap;
  sendTextMessage?: (content: string) => void;
}

export interface MessageUiConfig {
  // The messages(text、object_string) have been supported, so isSupportMessage prop is not enable;
  isSupportMessage?: (item: ChatMessage) => boolean;
  renderMessage?: (
    props: Omit<IMessageContentProps, 'messageUiMap'>,
  ) => React.ReactNode | null;
}
export interface HeaderConfig {
  isNeed?: boolean; //是否显示header， 默认是true
  icon?: string; // 自定义icon
  title?: string; // 标题
  renderRightSlot?: () => React.ReactNode; // 自定义右侧内容
}

export interface FooterConfig {
  isNeed?: boolean; //是否显示, 默认是true
  expressionText?: string; // 例如 由{{name}}提供。
  containerClassName?: string; // 自定义classname
  textClassName?: string; //自定义文本的classname
  linkvars?: Record<
    string,
    {
      text: string;
      link: string;
    }
  >;
}
export type UiCommandPosition = 'headerRight' | 'inputLeft';
export interface InputConfig {
  isNeed?: boolean; //是否显示, 默认是true
  isNeedAudio?: boolean; // 是否需要语音输入，默认是false
  isNeedTaskMessage?: boolean; // Whether or not using task message， default is false
  placeholder?: string;
  defaultText?: string;
  // 判断是否可以发送消息，返回false则不能发送，其他可发送（包括undefined）
  checkCanSendMessage?: (
    message: RawMessage,
  ) => Promise<boolean | undefined> | boolean | undefined;
  renderChatInputTopSlot?: (isChatError?: boolean) => React.ReactNode;
}
export interface ClearContextConfig {
  isNeed?: boolean; //是否显示, 默认是true
  position?: UiCommandPosition; // 默认 InputLeft;
}
export interface ClearMessageConfig {
  isNeed?: boolean; //是否显示, 默认是true
  position?: UiCommandPosition; // 默认 headerRight
}
export interface UploadBtnConfig {
  isNeed?: boolean; //是否显示, 默认是true
}

export interface MessageSenderNameConfig {
  renderRightSlot?: (options: {
    isQuery?: boolean;
    chatGroup?: ChatMessageGroup;
  }) => React.ReactNode | null;
}
export interface MessageWrapperConfig {
  senderName?: MessageSenderNameConfig;
}
export interface ChatSlotConfig {
  base?: {
    maxWidth?: number;
    isFrameAutoFocus?: boolean;
  };
  input?: InputConfig;
  clearContext?: ClearContextConfig;
  clearMessage?: ClearMessageConfig;
  uploadBtn?: UploadBtnConfig;
  message?: MessageUiConfigMap;
  messageWrapper?: MessageWrapperConfig;
}
export interface ErrorUiConfig {
  renderError?: (
    error?: IMiniChatError,
    retryChatInit?: () => void,
  ) => React.ReactNode;
}
export interface LoadingUiConfig {
  renderLoading?: () => React.ReactNode;
}

export interface BgImageInfo {
  canvasPosition: {
    height: number;
    left: number;
    top: number;
    width: number;
  };
  gradientPosition: {
    left: number;
    right: number;
  };
  imgUrl: string;
  themeColor: string;
}

export interface BgImageInfoMap {
  pc?: BgImageInfo;
  mobile?: BgImageInfo;
}

export type ThemeType = 'bg-theme' | 'light';
