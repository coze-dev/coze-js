import { APIResource } from '../../resource.js';
import {
  type ContentType,
  type ChatV3Message,
  type MetaDataType,
  type RoleType,
  type ObjectStringItem,
} from '../../index.js';
import { type RequestOptions } from '../../../core.js';

export class Messages extends APIResource {
  /**
   * Create a message and add it to the specified conversation. | 创建一条消息，并将其添加到指定的会话中。
   * @docs en: https://www.coze.com/docs/developer_guides/create_message?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/create_message?_lang=zh
   * @param conversation_id - Required The ID of the conversation. | Conversation ID，即会话的唯一标识。
   * @param params - Required The parameters for creating a message | 创建消息所需的参数
   * @param params.role - Required The entity that sent this message. Possible values: user, assistant. | 发送这条消息的实体。取值：user, assistant。
   * @param params.content - Required The content of the message. | 消息的内容。
   * @param params.content_type - Required The type of the message content. | 消息内容的类型。
   * @param params.meta_data - Optional Additional information when creating a message. | 创建消息时的附加消息。
   * @returns Information about the new message. | 消息详情。
   */
  async create(
    conversation_id: string,
    params: CreateMessageReq,
    options?: RequestOptions,
  ) {
    const apiUrl = `/v1/conversation/message/create?conversation_id=${conversation_id}`;
    const response = await this._client.post<
      CreateMessageReq,
      { data: ChatV3Message }
    >(apiUrl, params, false, options);
    return response.data;
  }

  /**
   * Modify a message, supporting the modification of message content, additional content, and message type. | 修改一条消息，支持修改消息内容、附加内容和消息类型。
   * @docs en: https://www.coze.com/docs/developer_guides/modify_message?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/modify_message?_lang=zh
   * @param conversation_id - Required The ID of the conversation. | Conversation ID，即会话的唯一标识。
   * @param message_id - Required The ID of the message. | Message ID，即消息的唯一标识。
   * @param params - Required The parameters for modifying a message | 修改消息所需的参数
   * @param params.meta_data - Optional Additional information when modifying a message. | 修改消息时的附加消息。
   * @param params.content - Optional The content of the message. | 消息的内容。
   * @param params.content_type - Optional The type of the message content. | 消息内容的类型。
   * @returns Information about the modified message. | 消息详情。
   */
  // eslint-disable-next-line max-params
  async update(
    conversation_id: string,
    message_id: string,
    params: UpdateMessageReq,
    options?: RequestOptions,
  ) {
    const apiUrl = `/v1/conversation/message/modify?conversation_id=${conversation_id}&message_id=${message_id}`;
    const response = await this._client.post<
      UpdateMessageReq,
      { message: ChatV3Message }
    >(apiUrl, params, false, options);
    return response.message;
  }

  /**
   * Get the detailed information of specified message. | 查看指定消息的详细信息。
   * @docs en: https://www.coze.com/docs/developer_guides/retrieve_message?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/retrieve_message?_lang=zh
   * @param conversation_id - Required The ID of the conversation. | Conversation ID，即会话的唯一标识。
   * @param message_id - Required The ID of the message. | Message ID，即消息的唯一标识。
   * @returns Information about the message. | 消息详情。
   */
  async retrieve(
    conversation_id: string,
    message_id: string,
    options?: RequestOptions,
  ) {
    const apiUrl = `/v1/conversation/message/retrieve?conversation_id=${conversation_id}&message_id=${message_id}`;
    const response = await this._client.get<null, { data: ChatV3Message }>(
      apiUrl,
      null,
      false,
      options,
    );
    return response.data;
  }

  /**
   * List messages in a conversation. | 列出会话中的消息。
   * @docs en: https://www.coze.com/docs/developer_guides/message_list?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/message_list?_lang=zh
   * @param conversation_id - Required The ID of the conversation. | Conversation ID，即会话的唯一标识。
   * @param params - Optional The parameters for listing messages | 列出消息所需的参数
   * @param params.order - Optional The order of the messages. | 消息的顺序。
   * @param params.chat_id - Optional The ID of the chat. | 聊天 ID。
   * @param params.before_id - Optional The ID of the message before which to list. | 列出此消息之前的消息 ID。
   * @param params.after_id - Optional The ID of the message after which to list. | 列出此消息之后的消息 ID。
   * @param params.limit - Optional The maximum number of messages to return. | 返回的最大消息数。
   * @returns A list of messages. | 消息列表。
   */
  async list(
    conversation_id: string,
    params: ListMessageReq,
    options?: RequestOptions,
  ): Promise<ListMessageData> {
    const apiUrl = `/v1/conversation/message/list?conversation_id=${conversation_id}`;
    const response = await this._client.post<ListMessageReq, ListMessageData>(
      apiUrl,
      params,
      false,
      options,
    );
    return response;
  }

  /**
   * Call the API to delete a message within a specified conversation. | 调用接口在指定会话中删除消息。
   * @docs en: https://www.coze.com/docs/developer_guides/delete_message?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/delete_message?_lang=zh
   * @param conversation_id - Required The ID of the conversation. | Conversation ID，即会话的唯一标识。
   * @param message_id - Required The ID of the message. | Message ID，即消息的唯一标识。
   * @returns Details of the deleted message. | 已删除的消息详情。
   */
  async delete(
    conversation_id: string,
    message_id: string,
    options?: RequestOptions,
  ) {
    const apiUrl = `/v1/conversation/message/delete?conversation_id=${conversation_id}&message_id=${message_id}`;
    const response = await this._client.post<
      unknown,
      { data: ChatV3Message[] }
    >(apiUrl, undefined, false, options);
    return response.data;
  }
}

export interface CreateMessageReq {
  role: RoleType;
  content: string | ObjectStringItem[];
  content_type: ContentType;
  meta_data: MetaDataType;
}

export interface UpdateMessageReq {
  meta_data?: MetaDataType;
  content?: string | ObjectStringItem[];
  content_type?: ContentType;
}

export interface ListMessageReq {
  order?: 'desc' | 'asc';
  chat_id?: string;
  before_id?: string;
  after_id?: string;
  limit?: number;
}

export interface ListMessageData {
  data: ChatV3Message[];
  first_id: string;
  last_id: string;
  has_more: boolean;
}
