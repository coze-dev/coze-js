import { MiniChatError } from "@/libs/utils";
import type { ChatInfo, ChatType } from "../base";
interface ChatInfoAction {
  setChatInfo: (info: ChatInfo) => void;
  setIsLoading: (isLoading: boolean) => void;
  setCustomChatInfo: (info: ChatInfo) => void; // 设置用户自定义的chat数据。
  setError: (error: MiniChatError | null) => void;
}

interface ChatInfoState {
  id: string;
  type: ChatType;
  error: MiniChatError | null; //是否错误
  isLoading: boolean; // 是否记载中
  info: ChatInfo | null;
}

export type ChatInfoStore = ChatInfoAction & ChatInfoState;
