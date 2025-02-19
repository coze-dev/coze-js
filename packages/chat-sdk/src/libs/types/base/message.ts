import { type ChatV3Message } from "@coze/api";

import { type IMiniChatError } from "../utils/error";
import { RawMessage } from "../services/send-message";
export type ChatMessage = ChatV3Message & {
  section_id?: string;
  localId?: string;
  error?: IMiniChatError;
  isComplete?: boolean;
  rawMessage?: RawMessage;
  extData?: Record<string, unknown>;
  reasoning_content?: string;
  isAudioTranslatingToText?: boolean; //默认false，进sendMessage的时候，设置为true
};

export interface FileRaw {
  tempFilePaths: string[];
  tempFiles: {
    path: string;
    size: number;
  }[];
  errMsg: string;
  errNo?: number;
}

export interface AudioRaw {
  duration: number;
  tempFilePath: string;
  fileSize: number;
  content?: Blob; //只有在Web下有
  fileName?: string;
}

// 一次对话的数据, 包含问题、多个回答（verbose，suggestion）
export interface ChatMessageGroup {
  id: string; //唯一ID，因为chatId可能不存在，逻辑ID，主要用于定位位置
  chatId: string; // chat的Id，对话ID
  query?: ChatMessage;
  isAWaiting?: boolean; //是否在等待消息中
  respMessages: ChatMessage[];
  sectionId?: string;
  isPrologue?: boolean; // 是否是开场白
}
