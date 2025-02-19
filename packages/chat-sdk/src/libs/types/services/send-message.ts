import { type EnterMessage } from "@coze/api";
import {
  type ChatMessage,
  type ChooseFileInfo,
  type AudioRaw,
} from "@/libs/types";
import { MiniChatError } from "@/libs/utils";

export enum SendMessageEvent {
  ReceiveMessage = "receiveMessage",
  ReceiveComplete = "receiveComplete",
  Close = "close", // sendMessage结束了
}
export enum RawMessageType {
  TEXT = "text",
  FILE = "file",
  AUDIO = "audio",
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
  status: "complete" | "in_process" | "break" | "error";
  error?: MiniChatError;
}

export interface ISendMessage {
  sendRawMessage(_rawMessage: RawMessage, _historyMessages?: EnterMessage[]);

  sendMessage(_message: EnterMessage, _historyMessages?: EnterMessage[]);
  on(
    eventName: SendMessageEvent,
    callback: (args: SendMessageEventData) => void
  );
  off(
    eventName: SendMessageEvent,
    callback: (args: SendMessageEventData) => void
  );

  // 结束的时候，一定要调用该位置。
  close(data?: SendMessageEventData);
  break();
}
