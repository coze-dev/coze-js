import { ITouchEvent } from '@tarojs/components';

import { ChatMessageGroup } from './message';

export interface IOnTaskListChangeProps {
  taskList: Array<{
    taskName: string;
    taskValue: string[];
  }>;
}

export type IOnImageClickEvent = (extra: { url: string }) => void;
export type IOnTaskListChange = (data: {
  taskList: Array<{
    taskName: string;
    taskValue: string[];
  }>;
}) => void;

export interface IMessageCallbackContext {
  extra: unknown;
}
export interface IMessageCallback {
  afterMessageReceivedFinish?: (
    context: IMessageCallbackContext & {
      extra: {
        processChatMessageGroup: ChatMessageGroup;
      };
    },
  ) => void;
}
export interface LinkEventData {
  url: string;
}

export type OnLinkClickCallback = (
  event: ITouchEvent,
  eventData: LinkEventData,
) => void;
export interface ElementEventCallbacks {
  /** 链接点击回调 */
  onLinkClick?: OnLinkClickCallback;
  /** 图片点击回调 */
  onImageClick?: IOnImageClickEvent;
}
