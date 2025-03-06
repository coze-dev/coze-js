import type {
  CozeAPI,
  StreamChatData,
  StreamChatReq,
  RequestOptions,
  CreateFileReq,
  FileObject,
  ChatV3Message,
} from '@coze/api';

import type { ChatInfo, ChatType } from '@/libs/types';

import { IMiniChatError } from '../utils/error';
import { ConversationState } from '../provider/conversation';
import { SuggestPromoteInfo } from '../base/chat';
interface GetMessageListRes
  extends Pick<
    ConversationState,
    'prevCursorId' | 'nextCursorId' | 'prevHasMore' | 'nextHasMore'
  > {
  error?: IMiniChatError;
  messages: ChatV3Message[];
}

export interface ChatServiceProps {
  apiClient: CozeAPI;
  connectorId?: string;
  appId: string;
  chatType: ChatType;
}
export interface IChatService {
  createNewConversation: () => Promise<{
    conversationId: string;
    sectionId: string;
  }>;
  createNewSection: (conversationId: string) => Promise<{
    sectionId: string;
  }>;
  getAppInfo: () => Promise<ChatInfo>;
  getOrCreateConversationId: () => Promise<{
    conversationId: string;
    sectionId: string;
  }>;
  getMessageList: ({
    conversationId,
    prevCursorId,
    limit,
  }: {
    conversationId: string;
    prevCursorId?: string;
    limit?: number;
  }) => Promise<GetMessageListRes>;
  translation: (
    params: CreateFileReq,
    options?: RequestOptions,
  ) => Promise<{ text: string }>;
  asyncChat: (
    params: StreamChatReq & {
      connector_id?: string;
      suggestPromoteInfo?: SuggestPromoteInfo;
    },
    options?: RequestOptions,
  ) => AsyncIterable<StreamChatData>;
  upload: (
    params: CreateFileReq,
    options?: RequestOptions,
  ) => Promise<FileObject>;
  audioSpeech: (params: {
    input: string;
    voice_id: string;
    response_format?: 'wav' | 'pcm' | 'ogg' | 'opus' | 'mp3';
    speed?: number;
    sample_rate?: number;
    sampling_rate?: number;
  }) => Promise<ArrayBuffer>;
}
