import { APIResource, type ErrorData } from '../resource';
import { sleep } from '../../utils';
import { CozeError } from '../../error';
import { type RequestOptions } from '../../core';
import { Messages } from './messages/index';

const uuid = () => (Math.random() * new Date().getTime()).toString();

export const handleAdditionalMessages = (
  additional_messages?: EnterMessage[],
) =>
  additional_messages?.map(i => ({
    ...i,
    content:
      typeof i.content === 'object' ? JSON.stringify(i.content) : i.content,
  }));

export const handleParameters = (
  parameters?: Record<string, ObjectStringItem | string>,
) => {
  if (parameters) {
    for (const [key, value] of Object.entries(parameters)) {
      if (typeof value === 'object') {
        parameters[key] = JSON.stringify(value);
      }
    }
  }
  return parameters;
};

export class Chat extends APIResource {
  messages: Messages = new Messages(this._client);

  /**
   * Call the Chat API to send messages to a published Coze agent. | 调用此接口发起一次对话，支持添加上下文
   * @docs en:https://www.coze.com/docs/developer_guides/chat_v3?_lang=en
   * @docs zh:https://www.coze.cn/docs/developer_guides/chat_v3?_lang=zh
   * @param params - Required The parameters for creating a chat session. | 创建会话的参数。
   * @param params.bot_id - Required The ID of the agent. | 要进行会话聊天的 Bot ID。
   * @param params.user_id - Optional The ID of the user interacting with the Bot. | 标识当前与 Bot 交互的用户。
   * @param params.additional_messages - Optional Additional messages for the conversation. | 对话的附加信息。
   * @param params.custom_variables - Optional Variables defined in the Bot. | Bot 中定义变量。
   * @param params.auto_save_history - Optional Whether to automatically save the conversation history. | 是否自动保存历史对话记录。
   * @param params.meta_data - Optional Additional metadata for the message. | 创建消息时的附加消息。
   * @param params.conversation_id - Optional The ID of the conversation. | 标识对话发生在哪一次会话中。
   * @param params.extra_params - Optional Extra parameters for the conversation. | 附加参数。
   * @param params.shortcut_command - Optional The shortcut command information. | 快捷指令信息。
   * @param params.parameters - Optional custom parameters. | 自定义参数。
   * @returns The data of the created chat. | 创建的对话数据。
   */
  async create(
    params: CreateChatReq,
    options?: RequestOptions,
  ): Promise<CreateChatData> {
    if (!params.user_id) {
      params.user_id = uuid();
    }
    const { conversation_id, ...rest } = params;
    const apiUrl = `/v3/chat${conversation_id ? `?conversation_id=${conversation_id}` : ''}`;
    const payload = {
      ...rest,
      additional_messages: handleAdditionalMessages(params.additional_messages),
      shortcut_command: params.shortcut_command
        ? {
            ...params.shortcut_command,
            parameters: handleParameters(params.shortcut_command.parameters),
          }
        : undefined,
      stream: false,
    };
    const result = (await this._client.post(
      apiUrl,
      payload,
      false,
      options,
    )) as CreateChatRes;
    return result.data;
  }

  /**
   * Call the Chat API to send messages to a published Coze agent. | 调用此接口发起一次对话，支持添加上下文
   * @docs en:https://www.coze.com/docs/developer_guides/chat_v3?_lang=en
   * @docs zh:https://www.coze.cn/docs/developer_guides/chat_v3?_lang=zh
   * @param params - Required The parameters for creating a chat session. | 创建会话的参数。
   * @param params.bot_id - Required The ID of the agent. | 要进行会话聊天的 Bot ID。
   * @param params.user_id - Optional The ID of the user interacting with the Bot. | 标识当前与 Bot 交互的用户。
   * @param params.additional_messages - Optional Additional messages for the conversation. | 对话的附加信息。
   * @param params.custom_variables - Optional Variables defined in the Bot. | Bot 中定义的变量。
   * @param params.auto_save_history - Optional Whether to automatically save the conversation history. | 是否自动保存历史对话记录。
   * @param params.meta_data - Optional Additional metadata for the message. | 创建消息时的附加消息。
   * @param params.conversation_id - Optional The ID of the conversation. | 标识对话发生在哪一次会话中。
   * @param params.extra_params - Optional Extra parameters for the conversation. | 附加参数。
   * @param params.shortcut_command - Optional The shortcut command information. | 快捷指令信息。
   * @param params.parameters - Optional custom parameters. | 自定义参数。
   * @returns
   */
  async createAndPoll(
    params: CreateChatReq,
    options?: RequestOptions,
  ): Promise<CreateChatPollData> {
    if (!params.user_id) {
      params.user_id = uuid();
    }
    const { conversation_id, ...rest } = params;
    const apiUrl = `/v3/chat${conversation_id ? `?conversation_id=${conversation_id}` : ''}`;
    const payload = {
      ...rest,
      additional_messages: handleAdditionalMessages(params.additional_messages),
      shortcut_command: params.shortcut_command
        ? {
            ...params.shortcut_command,
            parameters: handleParameters(params.shortcut_command.parameters),
          }
        : undefined,
      stream: false,
    };
    const result = (await this._client.post(
      apiUrl,
      payload,
      false,
      options,
    )) as CreateChatRes;

    const chatId = result.data.id;
    const conversationId = result.data.conversation_id;
    let chat: CreateChatData | undefined;

    while (true) {
      await sleep(100);
      chat = await this.retrieve(conversationId, chatId);
      if (
        chat.status === 'completed' ||
        chat.status === 'failed' ||
        chat.status === 'requires_action'
      ) {
        break;
      }
    }
    const messageList = await this.messages.list(conversationId, chatId);
    return {
      chat,
      messages: messageList,
    };
  }

  /**
   * Call the Chat API to send messages to a published Coze agent with streaming response. | 调用此接口发起一次对话，支持流式响应。
   * @docs en:https://www.coze.com/docs/developer_guides/chat_v3?_lang=en
   * @docs zh:https://www.coze.cn/docs/developer_guides/chat_v3?_lang=zh
   * @param params - Required The parameters for streaming a chat session. | 流式会话的参数。
   * @param params.bot_id - Required The ID of the agent. | 要进行会话聊天的 Bot ID。
   * @param params.user_id - Optional The ID of the user interacting with the Bot. | 标识当前与 Bot 交互的用户。
   * @param params.additional_messages - Optional Additional messages for the conversation. | 对话的附加信息。
   * @param params.custom_variables - Optional Variables defined in the Bot. | Bot 中定义的变量。
   * @param params.auto_save_history - Optional Whether to automatically save the conversation history. | 是否自动保存历史对话记录。
   * @param params.meta_data - Optional Additional metadata for the message. | 创建消息时的附加消息。
   * @param params.conversation_id - Optional The ID of the conversation. | 标识对话发生在哪一次会话中。
   * @param params.extra_params - Optional Extra parameters for the conversation. | 附加参数。
   * @param params.shortcut_command - Optional The shortcut command information. | 快捷指令信息。
   * @param params.parameters - Optional custom parameters. | 自定义参数。
   * @returns A stream of chat data. | 对话数据流。
   */
  async *stream(
    params: StreamChatReq,
    options?: RequestOptions,
  ): AsyncIterable<StreamChatData> {
    if (!params.user_id) {
      params.user_id = uuid();
    }
    const { conversation_id, ...rest } = params;
    const apiUrl = `/v3/chat${conversation_id ? `?conversation_id=${conversation_id}` : ''}`;
    const payload = {
      ...rest,
      additional_messages: handleAdditionalMessages(params.additional_messages),
      shortcut_command: params.shortcut_command
        ? {
            ...params.shortcut_command,
            parameters: handleParameters(params.shortcut_command.parameters),
          }
        : undefined,
      stream: true,
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

  /**
   * Get the detailed information of the chat. | 查看对话的详细信息。
   * @docs en:https://www.coze.com/docs/developer_guides/retrieve_chat?_lang=en
   * @docs zh:https://www.coze.cn/docs/developer_guides/retrieve_chat?_lang=zh
   * @param conversation_id - Required The ID of the conversation. | 会话 ID。
   * @param chat_id - Required The ID of the chat. | 对话 ID。
   * @returns The data of the retrieved chat. | 检索到的对话数据。
   */
  async retrieve(
    conversation_id: string,
    chat_id: string,
    options?: RequestOptions,
  ): Promise<CreateChatData> {
    const apiUrl = `/v3/chat/retrieve?conversation_id=${conversation_id}&chat_id=${chat_id}`;
    const result = await this._client.post<unknown, { data: CreateChatData }>(
      apiUrl,
      undefined,
      false,
      options,
    );
    return result.data;
  }

  /**
   * Cancel a chat session. | 取消对话会话。
   * @docs en:https://www.coze.com/docs/developer_guides/cancel_chat?_lang=en
   * @docs zh:https://www.coze.cn/docs/developer_guides/cancel_chat?_lang=zh
   * @param conversation_id - Required The ID of the conversation. | 会话 ID。
   * @param chat_id - Required The ID of the chat. | 对话 ID。
   * @returns The data of the canceled chat. | 取消的对话数据。
   */
  async cancel(
    conversation_id: string,
    chat_id: string,
    options?: RequestOptions,
  ): Promise<CreateChatData> {
    const apiUrl = '/v3/chat/cancel';
    const payload = { conversation_id, chat_id };
    const result = await this._client.post<unknown, { data: CreateChatData }>(
      apiUrl,
      payload,
      false,
      options,
    );
    return result.data;
  }

  /**
   * Submit tool outputs for a chat session. | 提交对话会话的工具输出。
   * @docs en:https://www.coze.com/docs/developer_guides/chat_submit_tool_outputs?_lang=en
   * @docs zh:https://www.coze.cn/docs/developer_guides/chat_submit_tool_outputs?_lang=zh
   * @param params - Required Parameters for submitting tool outputs. | 提交工具输出的参数。
   * @param params.conversation_id - Required The ID of the conversation. | 会话 ID。
   * @param params.chat_id - Required The ID of the chat. | 对话 ID。
   * @param params.tool_outputs - Required The outputs of the tool. | 工具的输出。
   * @param params.stream - Optional Whether to use streaming response. | 是否使用流式响应。
   * @returns The data of the submitted tool outputs or a stream of chat data. | 提交的工具输出数据或对话数据流。
   */
  async *submitToolOutputs(
    params: SubmitToolOutputsReq,
    options?: RequestOptions,
  ) {
    const { conversation_id, chat_id, ...rest } = params;
    const apiUrl = `/v3/chat/submit_tool_outputs?conversation_id=${params.conversation_id}&chat_id=${params.chat_id}`;
    const payload = { ...rest };
    if (params.stream === false) {
      const response = await this._client.post<
        unknown,
        { data: CreateChatData }
      >(apiUrl, payload, false, options);
      return response.data;
    } else {
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
}

export interface SubmitToolOutputsReq {
  conversation_id: string;
  chat_id: string;
  tool_outputs: ToolOutputType[];
  auto_save_history?: boolean;
  stream: boolean;
}

export interface ToolOutputType {
  /**
   * The ID of the run result.
   */
  tool_call_id: string;

  /**
   * The output of the run result.
   */
  output: string;
}

export interface CreateChatReq {
  /**
   * The Bot ID for the chat session.
   */
  bot_id: string;

  /**
   * The user ID interacting with the Bot, defined, generated, and maintained by the user in their business system.
   */
  user_id?: string;

  /**
   * Additional information for the conversation. You can pass the user's question in this field. The array length is limited to 100, allowing up to 100 messages.
   *
   * - When auto_save_history=true, additional_messages will be added to the session as messages first, then passed to the model as context.
   * - When auto_save_history=false, additional_messages will only be passed to the model as additional information, and neither additional_messages nor any messages returned by the model will be added to the session.
   *
   * To ensure model effectiveness, the last message in additional_messages will be passed to the model as the user's input for this conversation, so it is recommended to pass a record with role=user for the last message to avoid affecting the model's performance.
   *
   * If no session is specified for this conversation or if there are no messages in the specified session, the user's question must be passed through this parameter.
   */
  additional_messages?: EnterMessage[];

  /**
   * Variables defined in the Bot. After setting variables {{key}} in the Bot prompt, you can pass variable values through this parameter, supporting Jinja2 syntax. For detailed instructions, refer to the variable example.
   */
  custom_variables?: Record<string, string>;

  /**
   * Whether to automatically save the conversation history:
   *
   * - true: (default) Save the model's reply results and intermediate results.
   * - false: The system does not save the conversation history, and subsequent access to the basic information or message details of this conversation is not possible.
   */
  auto_save_history?: boolean;

  /**
   * Additional message when creating a message, which will also be returned when retrieving the message.
   * Custom key-value pairs should be specified as a Map object format. The length is 16 key-value pairs, with the key length ranging from 1 to 64 characters, and the value length ranging from 1 to 512 characters.
   */
  meta_data?: MetaDataType;

  /**
   * Identifies which session the conversation occurs in.
   *
   * A session is a series of Q&A interactions between the Bot and the user. A session contains one or more messages. A conversation is a call to the Bot within a session, and the messages generated in the conversation are added to the session.
   *
   * - You can use an already created session, and the existing messages in the session will be passed to the model as context. For how to create a session, refer to creating a session.
   * - For scenarios like one-question-one-answer where distinguishing conversations is not necessary, this parameter can be omitted, and the system will automatically generate a session.
   */
  conversation_id?: string;

  extra_params?: Record<string, string>;

  /**
   * Shortcut command information for executing a shortcut command in the conversation.
   */
  shortcut_command?: ShortcutCommand;

  /**
   * Assign values to custom parameters.
   *
   * You can set custom parameters in the input parameters of the starting node of the chat flow.
   */
  parameters?: Record<string, unknown>;
}

export interface CreateChatRes {
  code: number;
  msg?: string;
  data: CreateChatData;
  error?: ErrorData;
}

export interface CreateChatPollData {
  chat: CreateChatData;
  usage?: {
    /**
     * The total number of tokens consumed in this conversation, including both input and output parts.
     */
    token_count: number;

    /**
     * The total number of tokens consumed in the output part.
     */
    output_count: number;

    /**
     * The total number of tokens consumed in the input part.
     */
    input_count: number;
  };
  messages?: ChatV3Message[];
}

export enum ChatStatus {
  CREATED = 'created',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REQUIRES_ACTION = 'requires_action',
  CANCELED = 'canceled',
}

export interface CreateChatData {
  /**
   * The unique identifier of the conversation.
   */
  id: string;

  /**
   * The unique identifier of the session.
   */
  conversation_id: string;

  /**
   * The Bot ID for the chat session.
   */
  bot_id: string;

  /**
   * The running status of the session. Values are:
   */
  status: ChatStatus;

  /**
   * The creation time of the conversation, formatted as a 10-digit Unix timestamp, in seconds.
   */
  created_at?: number;

  /**
   * The end time of the conversation, formatted as a 10-digit Unix timestamp, in seconds.
   */
  completed_at?: number;

  /**
   * The end time of the conversation, formatted as a 10-digit Unix timestamp, in seconds.
   */
  failed_at?: number;

  /**
   * Additional message when creating a message, used to pass custom data from the user, and will also be returned when retrieving the message.
   * Custom key-value pairs should be specified as a Map object format. The length is 16 key-value pairs, with the key length ranging from 1 to 64 characters, and the value length ranging from 1 to 512 characters.
   */
  meta_data?: MetaDataType;

  /**
   * When the conversation runs into an exception, this field returns detailed error information.
   */
  last_error?: {
    /**
     * Error code. 0 indicates success, other values indicate failure.
     */
    code: number;

    /**
     * Error message.
     */
    msg: string;
  };

  /**
   * Details of the required action.
   */
  required_action?: RequiredActionType;

  /**
   * Detailed information on token consumption. The actual token consumption is based on the value returned after the conversation ends.
   */
  usage?: {
    /**
     * The total number of tokens consumed in this conversation, including both input and output parts.
     */
    token_count: number;

    /**
     * The total number of tokens consumed in the output part.
     */
    output_count: number;

    /**
     * The total number of tokens consumed in the input part.
     */
    input_count: number;
  };
}

export interface StreamChatReq {
  /**
   * The Bot ID for the chat session.
   */
  bot_id: string;

  /**
   * The user ID interacting with the Bot, defined, generated, and maintained by the user in their business system.
   */
  user_id?: string;

  /**
   * Additional information for the conversation. You can pass the user's question in this field. The array length is limited to 100, allowing up to 100 messages.
   *
   * - When auto_save_history=true, additional_messages will be added to the session as messages first, then passed to the model as context.
   * - When auto_save_history=false, additional_messages will only be passed to the model as additional information, and neither additional_messages nor any messages returned by the model will be added to the session.
   *
   * To ensure model effectiveness, the last message in additional_messages will be passed to the model as the user's input for this conversation, so it is recommended to pass a record with role=user for the last message to avoid affecting the model's performance.
   *
   * If no session is specified for this conversation or if there are no messages in the specified session, the user's question must be passed through this parameter.
   */
  additional_messages?: EnterMessage[];

  /**
   * Variables defined in the Bot. After setting variables {{key}} in the Bot prompt, you can pass variable values through this parameter, supporting Jinja2 syntax. For detailed instructions, refer to the variable example.
   */
  custom_variables?: Record<string, string>;

  /**
   * Whether to automatically save the conversation history:
   *
   * - true: (default) Save the model's reply results and intermediate results.
   * - false: The system does not save the conversation history, and subsequent access to the basic information or message details of this conversation is not possible.
   */
  auto_save_history?: boolean;

  /**
   * Additional message when creating a message, which will also be returned when retrieving the message.
   * Custom key-value pairs should be specified as a Map object format. The length is 16 key-value pairs, with the key length ranging from 1 to 64 characters, and the value length ranging from 1 to 512 characters.
   */
  meta_data?: MetaDataType;

  /**
   * Identifies which session the conversation occurs in.
   *
   * A session is a series of Q&A interactions between the Bot and the user. A session contains one or more messages. A conversation is a call to the Bot within a session, and the messages generated in the conversation are added to the session.
   *
   * - You can use an already created session, and the existing messages in the session will be passed to the model as context. For how to create a session, refer to creating a session.
   * - For scenarios like one-question-one-answer where distinguishing conversations is not necessary, this parameter can be omitted, and the system will automatically generate a session.
   */
  conversation_id?: string;

  extra_params?: Record<string, string>;

  /**
   * Shortcut command information for executing a shortcut command in the conversation.
   */
  shortcut_command?: ShortcutCommand;

  /**
   * Assign values to custom parameters.
   *
   * You can set custom parameters in the input parameters of the starting node of the chat flow.
   */
  parameters?: Record<string, unknown>;
}

export enum ChatEventType {
  CONVERSATION_CHAT_CREATED = 'conversation.chat.created',
  CONVERSATION_CHAT_IN_PROGRESS = 'conversation.chat.in_progress',
  CONVERSATION_CHAT_COMPLETED = 'conversation.chat.completed',
  CONVERSATION_CHAT_FAILED = 'conversation.chat.failed',
  CONVERSATION_CHAT_REQUIRES_ACTION = 'conversation.chat.requires_action',
  CONVERSATION_MESSAGE_DELTA = 'conversation.message.delta',
  CONVERSATION_MESSAGE_COMPLETED = 'conversation.message.completed',
  CONVERSATION_AUDIO_DELTA = 'conversation.audio.delta',
  DONE = 'done',
  ERROR = 'error',
}

export type StreamChatData =
  | {
      event:
        | ChatEventType.CONVERSATION_CHAT_CREATED
        | ChatEventType.CONVERSATION_CHAT_IN_PROGRESS
        | ChatEventType.CONVERSATION_CHAT_COMPLETED
        | ChatEventType.CONVERSATION_CHAT_FAILED
        | ChatEventType.CONVERSATION_CHAT_REQUIRES_ACTION;
      data: CreateChatData;
    }
  | {
      event:
        | ChatEventType.CONVERSATION_MESSAGE_DELTA
        | ChatEventType.CONVERSATION_MESSAGE_COMPLETED
        | ChatEventType.CONVERSATION_AUDIO_DELTA;
      data: ChatV3Message;
    }
  | { event: ChatEventType.DONE; data: '[DONE]' }
  | { event: ChatEventType.ERROR; data: { code: number; msg: string } };

export interface RetrieveChatReq {
  /**
   * The ID of the conversation to query.
   */
  conversation_id: string;

  /**
   * The ID of the chat to query.
   */
  chat_id: string;
}

interface RequiredActionType {
  /**
   * The type of the additional operation, the enumeration value is submit_tool_outputs.
   */
  type: string;

  /**
   * The details of the result to be submitted, uploaded through the submission interface, and can continue to chat.
   */
  submit_tool_outputs: {
    /**
     *
     */
    tool_calls: ToolCallType[];
  };
}

export interface ChatV3Message {
  /**
   * Message ID, which is the unique identifier of the message.
   */
  id: string;

  /**
   * The ID of the conversation that contains this message.
   */
  conversation_id: string;

  /**
   * The Bot ID that writes this message. This parameter is only returned in messages generated by the conversation.
   */
  bot_id: string;

  /**
   * Chat ID. This parameter is only returned in messages generated by the conversation.
   */
  chat_id: string;

  /**
   * The additional message when creating a message, which will also be returned when getting a message.
   */
  meta_data: MetaDataType;

  /**
   * The entity that sends this message.
   * - user: Represents that the message content is sent by the user.
   * - assistant: Represents that the message content is sent by the Bot.
   */
  role: RoleType;

  /**
   * The content of the message, supports plain text, multimodal (text, image, file mixed input), and card types.
   */
  content: string;

  /**
   * The type of the message content, including:
   * - text: Text.
   * - object_string: Multimodal content, including the combination of text and files, and the combination of text and images.
   * - card: Card.
   *
   * This enumeration value only appears in the interface response and is not supported as a parameter.
   */
  content_type: ContentType;

  /**
   * The creation time of the message, formatted as a 10-digit Unix timestamp, in seconds (s).
   */
  created_at: number;

  /**
   * The update time of the message, formatted as a 10-digit Unix timestamp, in seconds (s).
   */
  updated_at: number;

  /**
   * Message type.
   */
  type: MessageType;
}

export interface ToolCallType {
  /**
   * The ID of the run result.
   */
  id: string;

  /**
   * The type of the tool.
   */
  type: string;

  /**
   * The definition of the function.
   */
  function: {
    /**
     * The name of the function.
     */
    name: string;

    /**
     * The arguments of the function.
     */
    arguments: string;
  };
}

/**
 * https://www.coze.cn/docs/developer_guides/create_conversation#cde8cc95
 */
export interface EnterMessage {
  /**
   * The entity that sends this message.
   * - user: The message content is sent by the user.
   * - assistant: The message content is sent by the Bot.
   */
  role: RoleType;

  /**
   * The type of the message.
   * - query: User input.
   * - answer: Bot's message to the user, supports incremental return. If a workflow is bound to the message node, there may be multiple answer scenarios, in which case the stream end flag can be used to determine that all answers are complete.
   * - function_call: The intermediate result of the function call during the Bot conversation.
   * - tool_output: The result after calling the tool (function call).
   * - tool_response: The result after calling the tool (function call).
   * - follow_up: If the user question suggestion switch is turned on in the Bot, the recommended question related reply content will be returned.
   * - verbose: In the case of multiple answer scenarios, the server will return a verbose package, the corresponding content is in JSON format, and content.msg_type =generate_answer_finish represents that all answer replies are complete.
   */
  type?: MessageType;

  /**
   * The content of the message, supports plain text, multimodal (text, image, file mixed input), and card types.
   * - When content_type is object_string, content is an array of ObjectStringItem, detailed information can be found in the Object_string object.
   * - When content_type = text, content is in Markdown format.
   */
  content?: string | ObjectStringItem[];

  /**
   * The type of the message content, supports setting to:
   * - text: Text.
   * - object_string: Multimodal content, including the combination of text and files, and the combination of text and images.
   * - card: Card.
   *
   * This enumeration value only appears in the interface response and is not supported as a parameter.
   *
   * This parameter is required when content is not empty.
   */
  content_type?: ContentType;

  /**
   * The additional message when creating a message, which will also be returned when getting a message.
   *
   * Custom key-value pairs, specified as a Map object format. The length of the key-value pair is 16 pairs, where the key (key) length ranges from 1 to 64 characters, and the value (value) length ranges from 1 to 512 characters.
   */
  meta_data?: MetaDataType;
}

/**
 * The additional message when creating a message, which will also be returned when getting a message.
 *
 * Custom key-value pairs, specified as a Map object format. The length of the key-value pair is 16 pairs, where the key (key) length ranges from 1 to 64 characters, and the value (value) length ranges from 1 to 512 characters.
 */
export type MetaDataType = Record<string, string>;

/**
 * Bot mode, supports setting to:
 * - 0：Single Agent mode
 * - 1：Multi Agent mode
 */
export type BotModeType = 0 | 1;

export enum RoleType {
  User = 'user',
  Assistant = 'assistant',
}

/**
 * For `text` type, `content` is not only a plain text, but also a JSON string.
 *
 * For example:
 * ```json
 * {
 *   "content_type": "text",
 *   "type": "tool_output",
 *   "content": "{\"news\": [{...}]}"
 * }
 * ```
 *
 * ---
 *
 * For `object_string` type, `content` is a JSON string format.
 *
 * For example:
 * ```json
 * {
 *   "content_type": "object_string",
 *   "content": [
 *     {"type": "text", "text": "...."},
 *     {"type": "image": "file_id": "..."},
 *     {"type": "file": "file_url": "..."},
 *   ]
 * }
 * ```
 */
export type ContentType = 'text' | 'object_string' | 'card';

export type MessageType =
  | 'question'
  | 'answer'
  | 'function_call'
  | 'tool_output'
  | 'tool_response'
  | 'follow_up'
  | 'verbose';

export type ObjectStringItem =
  | { type: 'text'; text: string }
  | { type: 'file'; file_id: string; file_url?: string }
  | { type: 'file'; file_url: string; file_id?: string }
  | { type: 'image'; file_id: string; file_url?: string }
  | { type: 'image'; file_url: string; file_id?: string }
  | { type: 'audio'; file_id: string; file_url?: string }
  | { type: 'audio'; file_url: string; file_id?: string };

export interface ShortcutCommand {
  /**
   * Required. The ID of the shortcut command to execute. Must be a shortcut command that is bound to the agent.
   */
  command_id: string;

  /**
   * Optional. Parameters for the shortcut command components.
   * Custom key-value pairs where the key is the name of the shortcut command component,
   * and the value is the user input for the component, serialized as a JSON string of object_string objects.
   */
  parameters?: Record<string, ObjectStringItem | string>;
}
