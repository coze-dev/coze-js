import { APIResource } from '../resource';
import { type EnterMessage, type MetaDataType } from '../index';
import { type RequestOptions } from '../../core';
import { Messages } from './messages/index';

export class Conversations extends APIResource {
  /**
   * Create a conversation. Conversation is an interaction between an agent and a user, including one or more messages. | 调用接口创建一个会话。
   * @docs en: https://www.coze.com/docs/developer_guides/create_conversation?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/create_conversation?_lang=zh
   * @param params - Required The parameters for creating a conversation | 创建会话所需的参数
   * @param params.messages - Optional Messages in the conversation. | 会话中的消息内容。
   * @param params.meta_data - Optional Additional information when creating a message. | 创建消息时的附加消息。
   * @param params.bot_id - Optional Bind and isolate conversation on different bots. | 绑定和隔离不同Bot的会话。
   * @returns Information about the created conversation. | 会话的基础信息。
   */
  async create(params: CreateConversationReq, options?: RequestOptions) {
    const apiUrl = '/v1/conversation/create';
    const response = await this._client.post<
      CreateConversationReq,
      { data: Conversation }
    >(apiUrl, params, false, options);
    return response.data;
  }

  /**
   * Get the information of specific conversation. | 通过会话 ID 查看会话信息。
   * @docs en: https://www.coze.com/docs/developer_guides/retrieve_conversation?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/retrieve_conversation?_lang=zh
   * @param conversation_id - Required The ID of the conversation. | Conversation ID，即会话的唯一标识。
   * @returns Information about the conversation. | 会话的基础信息。
   */
  async retrieve(conversation_id: string, options?: RequestOptions) {
    const apiUrl = `/v1/conversation/retrieve?conversation_id=${conversation_id}`;
    const response = await this._client.get<null, { data: Conversation }>(
      apiUrl,
      null,
      false,
      options,
    );
    return response.data;
  }
  /**
   * List all conversations. | 列出 Bot 下所有会话。
   * @param params
   * @param params.bot_id - Required Bot ID. | Bot ID。
   * @param params.page_num - Optional The page number. | 页码，默认值为 1。
   * @param params.page_size - Optional The number of conversations per page. | 每页的会话数量，默认值为 50。
   * @returns Information about the conversations. | 会话的信息。
   */
  async list(
    params: ListConversationReq,
    options?: RequestOptions,
  ): Promise<ListConversationsData> {
    const apiUrl = '/v1/conversations';
    const response = await this._client.get<
      ListConversationReq,
      { data: ListConversationsData }
    >(apiUrl, params, false, options);
    return response.data;
  }

  /**
   * Clear a conversation. | 清空会话。
   * @param conversation_id - Required The ID of the conversation. | Conversation ID，即会话的唯一标识。
   * @returns Information about the conversation session. | 会话的会话 ID。
   */
  async clear(
    conversation_id: string,
    options?: RequestOptions,
  ): Promise<ConversationSession> {
    const apiUrl = `/v1/conversations/${conversation_id}/clear`;
    const response = await this._client.post<
      null,
      { data: ConversationSession }
    >(apiUrl, null, false, options);
    return response.data;
  }

  messages: Messages = new Messages(this._client);
}

export interface CreateConversationReq {
  messages?: EnterMessage[];
  meta_data?: MetaDataType;
  bot_id?: string;
}

export interface ListConversationReq {
  bot_id: string;
  page_num?: number;
  page_size?: number;
}

export interface ListConversationsData {
  conversations: Conversation[];
  has_more: boolean;
}

export interface Conversation {
  /**
   *  Conversation ID
   */
  id: string;

  /**
   * Session creation time. The format is a 10-digit Unixtime timestamp in seconds.
   */
  created_at: number;

  /**
   * Custom key-value pairs, specified as a Map object format. The length is 16 pairs of key-value pairs, where the key (key) is 1～64 characters long and the value (value) is 1～512 characters long.
   */
  meta_data: MetaDataType;
  /**
   * The section_id of the last message in the session.
   */
  last_section_id?: string;
}

export interface ConversationSession {
  id: string;
  conversation_id: string;
}

export * from './messages/index';
