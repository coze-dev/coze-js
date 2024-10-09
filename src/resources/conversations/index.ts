import { type EnterMessage, type MetaDataType } from '../index.js';
import { APIResource } from '../resource.js';
import { Messages } from './messages/index.js';

export class Conversations extends APIResource {
  async create(params: CreateConversationReq) {
    const apiUrl = `/v1/conversation/create`;

    const response = await this._client.post<CreateConversationReq, { data: Conversation }>(apiUrl, params);
    return response.data;
  }

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
