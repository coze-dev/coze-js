import { ChatMessageGroup } from "./message";

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
    }
  ) => void;
}
