import { APIResource } from '../../resource';
import {
  ChatEventType,
  type EnterMessage,
  handleAdditionalMessages,
  type StreamChatData,
} from '../../chat/chat';
import { CozeError } from '../../../error';
import { type RequestOptions } from '../../../core';

export class WorkflowChat extends APIResource {
  /**
   * Execute a chat workflow. | 执行对话流
   * @docs en: https://www.coze.cn/docs/developer_guides/workflow_chat?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/workflow_chat?_lang=zh
   * @param params.workflow_id - Required The ID of the workflow to chat with. | 必选 要对话的工作流 ID。
   * @param params.additional_messages - Required Array of messages for the chat. | 必选 对话的消息数组。
   * @param params.parameters - Required Parameters for the workflow execution. | 必选 工作流执行的参数。
   * @param params.app_id - Optional The ID of the app. | 可选 应用 ID。
   * @param params.bot_id - Optional The ID of the bot. | 可选 Bot ID。
   * @param params.conversation_id - Optional The ID of the conversation. | 可选 会话 ID。
   * @param params.ext - Optional Additional information for the chat. | 可选 对话的附加信息。
   * @returns AsyncGenerator<StreamChatData> | 对话数据流
   */
  async *stream(
    params: ChatWorkflowReq,
    options?: RequestOptions,
  ): AsyncIterable<StreamChatData> {
    const apiUrl = '/v1/workflows/chat';
    const payload = {
      ...params,
      additional_messages: handleAdditionalMessages(params.additional_messages),
    };

    const result = await this._client.post<
      unknown,
      AsyncGenerator<{ event: ChatEventType; data: string }>
    >(apiUrl, payload, true, options);

    for await (const message of result) {
      if (message.event === ChatEventType.DONE) {
        const ret: StreamChatData = {
          event: message.event,
          data: '[DONE]',
        };
        yield ret;
      } else {
        try {
          const ret: StreamChatData = {
            event: message.event,
            data: JSON.parse(message.data),
          };
          yield ret;
        } catch (error) {
          throw new CozeError(
            `Could not parse message into JSON:${message.data}`,
          );
        }
      }
    }
  }
}

export interface ChatWorkflowReq {
  workflow_id: string;
  additional_messages: EnterMessage[];
  parameters: Record<string, unknown>;
  app_id?: string;
  bot_id?: string;
  conversation_id?: string;
  ext?: Record<string, string>;
}
