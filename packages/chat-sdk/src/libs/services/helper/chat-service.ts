import type {
  ListMessageData,
  CreateFileReq,
  RequestOptions,
  FileObject,
  StreamChatReq,
  StreamChatData,
  APIError,
} from "@coze/api";
import { IChatService, ChatServiceProps } from "@/libs/types";
import { logger, MiniChatError } from "@/libs/utils";
import { type CozeAPI } from "@coze/api";
import type { ChatInfo, ChatType } from "@/libs/types";
import { SuggestPromoteInfo } from "@/libs/types/base/chat";

const MESSAGE_LIST_NUM = 20;

export class ChatService implements IChatService {
  protected apiClient: CozeAPI;
  protected connectorId: string;
  protected appId: string;
  protected chatType: ChatType;

  constructor({ apiClient, connectorId, appId, chatType }: ChatServiceProps) {
    this.apiClient = apiClient;
    this.connectorId = connectorId || "999";
    this.appId = appId;
    this.chatType = chatType;
  }
  async createNewConversation() {
    const { id: conversationId, last_section_id: sectionId = "" } =
      await this.apiClient.conversations.create({
        bot_id: this.appId,
        // @ts-expect-error -- linter-disable-autofix
        connector_id: this.connectorId,
      });
    return { conversationId, sectionId };
  }
  async createNewSection(conversationId) {
    const { id: sectionId } = await this.apiClient.conversations.clear(
      conversationId || ""
    );
    return { sectionId };
  }
  async getAppInfo(): Promise<ChatInfo> {
    try {
      const result = await this.apiClient.bots.retrieve({
        bot_id: this.appId,
        // @ts-expect-error -- linter-disable-autofix
        connector_id: this.connectorId,
      });
      return {
        appId: this.appId,
        type: this.chatType,
        ...result,
      };
    } catch (error) {
      const err = error as APIError;
      throw new MiniChatError(err.code || -1, err.message);
    }
  }
  async getOrCreateConversationId() {
    const { data: conversationRes } = (await this.apiClient.get(
      "/v1/conversations",
      {
        bot_id: this.appId,
        connector_id: this.connectorId,
        page_num: 1,
        page_size: 1,
      }
    )) as {
      data: {
        conversations: {
          id: string;
          last_section_id: string;
        }[];
      };
    };
    const { id: conversationId, last_section_id: sectionId } =
      conversationRes?.conversations?.[0] || {};
    if (!conversationId) {
      return await this.createNewConversation();
    }
    return { conversationId, sectionId };
  }
  async getMessageList({
    conversationId,
    prevCursorId,
    limit = MESSAGE_LIST_NUM,
  }) {
    try {
      const resMessage = await this.apiClient.conversations.messages.list(
        conversationId,
        {
          after_id: prevCursorId || undefined,
          limit,
        }
      );
      return getFormatMessageListInfo(resMessage);
    } catch (error) {
      logger.error("Get Message Error", error);
      return {
        prevCursorId: undefined,
        nextCursorId: undefined,
        prevHasMore: false,
        nextHasMore: false,
        messages: [],
        error: new MiniChatError(-1, "Get Message Error"),
      };
    }

    function getFormatMessageListInfo(resMessage: ListMessageData) {
      const {
        first_id: nextCursorId,
        last_id: prevCursorId,
        has_more: prevHasMore,
        data: messageList,
      } = resMessage;
      return {
        prevCursorId,
        nextCursorId,
        prevHasMore,
        nextHasMore: false,
        messages: messageList.reverse(),
      };
    }
  }
  asyncChat(
    params: StreamChatReq & {
      connector_id?: string;
      suggestPromoteInfo?: SuggestPromoteInfo;
    },
    options?: RequestOptions
  ): AsyncIterable<StreamChatData> {
    return this.apiClient.chat.stream(params, options);
  }
  upload(params: CreateFileReq, options?: RequestOptions): Promise<FileObject> {
    return this.apiClient.files.upload(params, options);
  }
  async translation(params: CreateFileReq, options?: RequestOptions) {
    // @ts-expect-error -- linter-disable-autofix
    return await this.apiClient.audio.transcriptions(params, options);
  }
  async audioSpeech(params) {
    return await this.apiClient.audio.speech.create(params);
  }
}
