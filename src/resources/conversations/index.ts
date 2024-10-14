import { type EnterMessage, type MetaDataType } from '../index.js';
import { APIResource } from '../resource.js';
import { Messages } from './messages/index.js';

export class Conversations extends APIResource {
  /**
   * Create a conversation. Conversation is an interaction between an agent and a user, including one or more messages. | 调用接口创建一个会话。
   * @docs en: https://www.coze.com/docs/developer_guides/create_conversation?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/create_conversation?_lang=zh
   * @param params - Required The parameters for creating a conversation | 创建会话所需的参数
   * @param params.messages - Optional Messages in the conversation. | 会话中的消息内容。
   * @param params.meta_data - Optional Additional information when creating a message. | 创建消息时的附加消息。
   * @returns Information about the created conversation. | 会话的基础信息。
   */
  async create(params: CreateConversationReq) {
    const apiUrl = `/v1/conversation/create`;
    const response = await this._client.post<CreateConversationReq, { data: Conversation }>(apiUrl, params);
    return response.data;
  }

  /**
   * Get the information of specific conversation. | 通过会话 ID 查看会话信息。
   * @docs en: https://www.coze.com/docs/developer_guides/retrieve_conversation?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/retrieve_conversation?_lang=zh
   * @param conversation_id - Required The ID of the conversation. | Conversation ID，即会话的唯一标识。
   * @returns Information about the conversation. | 会话的基础信息。
   */
  async retrieve(conversation_id: string) {
    const apiUrl = `/v1/conversation/retrieve?conversation_id=${conversation_id}`;
    const response = await this._client.get<null, { data: Conversation }>(apiUrl);
    return response.data;
  }

  messages: Messages = new Messages(this._client);
}

export interface CreateConversationReq {
  messages?: EnterMessage[];
  meta_data?: MetaDataType;
}

export interface Conversation {
  /**
   * Conversation ID，即会话的唯一标识。
   */
  id: string;

  /**
   * 会话创建的时间。格式为 10 位的 Unixtime 时间戳，单位为秒。
   */
  created_at: number;

  /**
   * 创建消息时的附加消息，获取消息时也会返回此附加消息。
   * 自定义键值对，应指定为 Map 对象格式。长度为 16 对键值对，其中键（key）的长度范围为 1～64 个字符，值（value）的长度范围为 1～512 个字符。
   */
  meta_data: MetaDataType;
}

export * from './messages/index.js';
