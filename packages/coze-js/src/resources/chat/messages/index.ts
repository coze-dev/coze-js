import { type ChatV3Message } from '../index.js';
import { APIResource } from '../../resource.js';
import { type RequestOptions } from '../../../core.js';

export class Messages extends APIResource {
  /**
   * Get the list of messages in a chat. | 获取对话中的消息列表。
   * @docs en:https://www.coze.com/docs/developer_guides/chat_message_list?_lang=en
   * @docs zh:https://www.coze.cn/docs/developer_guides/chat_message_list?_lang=zh
   * @param conversation_id - Required The ID of the conversation. | 会话 ID。
   * @param chat_id - Required The ID of the chat. | 对话 ID。
   * @returns An array of chat messages. | 对话消息数组。
   */
  async list(
    conversation_id: string,
    chat_id: string,
    options?: RequestOptions,
  ): Promise<ChatV3Message[]> {
    const apiUrl = `/v3/chat/message/list?conversation_id=${conversation_id}&chat_id=${chat_id}`;
    const result = await this._client.get<unknown, { data: ChatV3Message[] }>(
      apiUrl,
      undefined,
      false,
      options,
    );
    return result.data;
  }
}
