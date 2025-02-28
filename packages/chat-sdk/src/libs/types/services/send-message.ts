import { CreateChatData, type EnterMessage } from '@coze/api';

import { MiniChatError } from '@/libs/utils';
import {
  type ChatMessage,
  type ChooseFileInfo,
  type AudioRaw,
} from '@/libs/types';

export enum SendMessageEvent {
  ReceiveMessage = 'receiveMessage',
  ReceiveComplete = 'receiveComplete',
  RequireAction = 'RequireAction', // 发送消息过程中，有action事件发生
  Close = 'close', // sendMessage结束了
}
export enum RawMessageType {
  TEXT = 'text',
  FILE = 'file',
  AUDIO = 'audio',
}
export type RawMessage =
  | {
      type: RawMessageType.TEXT;
      data: string;
    }
  | {
      type: RawMessageType.FILE;
      data: ChooseFileInfo[];
    }
  | {
      type: RawMessageType.AUDIO;
      data: AudioRaw;
    };

export interface SendMessageEventData {
  messages: ChatMessage[];
  event?: CreateChatData;
  status: 'complete' | 'in_process' | 'break' | 'error' | 'action';
  error?: MiniChatError;
}

export interface ISendMessage {
  sendRawMessage: (
    _rawMessage: RawMessage,
    _historyMessages?: EnterMessage[],
  ) => unknown;

  sendMessage: (
    _message: EnterMessage,
    _historyMessages?: EnterMessage[],
  ) => unknown;
  on: (
    eventName: SendMessageEvent,
    callback: (args: SendMessageEventData) => void,
  ) => unknown;
  off: (
    eventName: SendMessageEvent,
    callback: (args: SendMessageEventData) => void,
  ) => unknown;

  // 结束的时候，一定要调用该位置。
  close: (data?: SendMessageEventData) => unknown;
  break: () => unknown;
}
