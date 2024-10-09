import Stream from '../../stream.js';
import { safeJsonParse } from '../../utils.js';
import { APIResource, type ErrorData } from '../resource.js';

export class Chat extends APIResource {
  async create(params: CreateChatReq): Promise<CreateChatData> {
    // TODO 这个接口需要特殊处理, 通常一个POST请求，URL不应该包含查询参数的
    const { conversation_id, ...rest } = params;
    const apiUrl = `/v3/chat${conversation_id ? `?conversation_id=${conversation_id}` : ''}`;
    const payload = {
      ...rest,
      stream: false,
    };
    const result = (await this._client.post(apiUrl, payload)) as CreateChatRes;
    return result.data;
  }

  async stream(params: StreamChatReq): Promise<Stream<StreamChatData, { event: string; data: string }>> {
    // TODO 这个接口需要特殊处理
    const { conversation_id, ...rest } = params;
    const apiUrl = `/v3/chat${conversation_id ? `?conversation_id=${conversation_id}` : ''}`;
    const payload = {
      ...rest,
      stream: true,
    };

    const response = (await this._client.post(apiUrl, payload, true)) as Response;

    return new Stream<StreamChatData, { event: string; data: string }>(
      response.body as ReadableStream,
      {
        event: 'event:',
        data: 'data:',
      },
      message => {
        if (message.event === 'done') {
          return { event: message.event, data: message.data } as StreamChatData;
        } else if (message.event === 'error') {
          throw new Error(message.data as string);
        }
        return { event: message.event, data: JSON.parse(message.data) } as StreamChatData;
      },
    );
  }

  async retrieve(conversation_id: string, chat_id: string): Promise<CreateChatData> {
    // TODO 这个接口需要特殊处理, 通常一个POST请求，URL不应该包含查询参数的
    const apiUrl = `/v3/chat/retrieve?conversation_id=${conversation_id}&chat_id=${chat_id}`;
    const result = await this._client.post<unknown, { data: CreateChatData }>(apiUrl);
    return result.data;
  }

  async history(conversation_id: string, chat_id: string): Promise<ChatV3Message[]> {
    // TODO 这个接口需要特殊处理, 通常一个POST请求，URL不应该包含查询参数的
    const apiUrl = `/v3/chat/message/list?conversation_id=${conversation_id}&chat_id=${chat_id}`;
    const result = await this._client.get<unknown, { data: ChatV3Message[] }>(apiUrl);
    return result.data;
  }

  async cancel(conversation_id: string, chat_id: string): Promise<CreateChatData> {
    const apiUrl = `/v3/chat/cancel`;
    const payload = { conversation_id, chat_id };
    const result = await this._client.post<unknown, { data: CreateChatData }>(apiUrl, payload);
    return result.data;
  }

  async submitToolOutputs(params: SubmitToolOutputsReq) {
    // TODO 这个接口需要特殊处理
    const { conversation_id, chat_id, ...rest } = params;
    const apiUrl = `/v3/chat/submit_tool_outputs?conversation_id=${params.conversation_id}&chat_id=${params.chat_id}`;
    const payload = { ...rest };
    if (params.stream === false) {
      const response = await this._client.post<unknown, { data: CreateChatData }>(apiUrl, payload);
      return response.data;
    } else {
      const response = await this._client.post<unknown, Response>(apiUrl, payload, true);
      return new Stream<StreamChatData, { event: string; data: string }>(
        response.body as ReadableStream,
        {
          event: 'event:',
          data: 'data:',
        },
        message => {
          if (message.event === 'done') {
            return { event: message.event, data: message.data } as StreamChatData;
          } else {
            return { event: message.event, data: safeJsonParse(message.data) } as StreamChatData;
          }
        },
      );
    }
  }
}

export interface SubmitToolOutputsReq {
  conversation_id: string;
  chat_id: string;
  tool_outputs: ToolOutputType[];
  stream: boolean;
}

export interface ToolOutputType {
  /**
   * 上报运行结果的 ID。
   */
  tool_call_id: string;

  /**
   * 上报运行结果的输出。
   */
  output: string;
}

export interface CreateChatReq {
  /**
   * 要进行会话聊天的 Bot ID。
   */
  bot_id: string;

  /**
   * 标识当前与 Bot 交互的用户，由使用方在业务系统中自行定义、生成与维护。
   */
  user_id: string;

  /**
   * 对话的附加信息。你可以通过此字段传入本次对话中用户的问题。数组长度限制为 100，即最多传入 100 条消息。
   *
   * - 当 auto_save_history=true 时，additional_messages 会作为消息先添加到会话中，然后作为上下文传给大模型。
   * - 当 auto_save_history=false 时，additional_messages 只会作为附加信息传给大模型，additional_messages 和模型返回等本次对话的所有消息均不会添加到会话中。
   *
   * 为了保证模型效果，additional_messages 最后一条消息会作为本次对话的用户输入内容传给模型，所以最后一条消息建议传 role=user 的记录，以免影响模型效果。
   *
   * 如果本次对话未指定会话或指定的会话中无消息时，必须通过此参数传入 Bot 用户的问题。
   */
  additional_messages?: EnterMessage[];

  /**
   * Bot 中定义的变量。在 Bot prompt 中设置变量 {{key}} 后，可以通过该参数传入变量值，同时支持 Jinja2 语法。详细说明可参考变量示例。
   */
  custom_variables?: Record<string, string>;

  /**
   * 是否自动保存历史对话记录：
   *
   * - true：（默认）保存此次模型回复结果和模型执行中间结果。
   * - false：系统不保存历史对话记录，后续无法查看本次对话的基础信息或消息详情。
   */
  auto_save_history?: boolean;

  /**
   * 创建消息时的附加消息，获取消息时也会返回此附加消息。
   * 自定义键值对，应指定为 Map 对象格式。长度为 16 对键值对，其中键（key）的长度范围为 1～64 个字符，值（value）的长度范围为 1～512 个字符。
   */
  meta_data?: MetaDataType;

  /**
   * 标识对话发生在哪一次会话中。
   *
   * 会话是 Bot 和用户之间的一段问答交互。一个会话包含一条或多条消息。对话是会话中对 Bot 的一次调用，Bot 会将对话中产生的消息添加到会话中。
   *
   * - 可以使用已创建的会话，会话中已存在的消息将作为上下文传递给模型。创建会话的方式可参考创建会话。
   * - 对于一问一答等不需要区分 conversation 的场合可不传该参数，系统会自动生成一个会话。
   */
  conversation_id?: string;

  extra_params?: string[];
}

export interface CreateChatRes {
  code: number;
  msg?: string;
  data: CreateChatData;
  error?: ErrorData;
}

export interface CreateChatData {
  /**
   * 对话 ID，即对话的唯一标识。
   */
  id: string;

  /**
   * 会话 ID，即会话的唯一标识。
   */
  conversation_id: string;

  /**
   * 要进行会话聊天的 Bot ID。
   */
  bot_id: string;

  /**
   * 会话的运行状态。取值为：
   */
  status: 'created' | 'in_progress' | 'completed' | 'failed' | 'requires_action';

  /**
   * 对话创建的时间。格式为 10 位的 Unixtime 时间戳，单位为秒。
   */
  created_at?: number;

  /**
   * 对话结束的时间。格式为 10 位的 Unixtime 时间戳，单位为秒。
   */
  completed_at?: number;

  /**
   * 对话结束的时间。格式为 10 位的 Unixtime 时间戳，单位为秒。
   */
  failed_at?: number;

  /**
   * 创建消息时的附加消息，用于传入使用方的自定义数据，获取消息时也会返回此附加消息。
   * 自定义键值对，应指定为 Map 对象格式。长度为 16 对键值对，其中键（key）的长度范围为 1～64 个字符，值（value）的长度范围为 1～512 个字符。
   */
  meta_data?: MetaDataType;

  /**
   * 对话运行异常时，此字段中返回详细的错误信息。
   */
  last_error?: {
    /**
     * 错误码。0 表示成功，其他值表示失败。
     */
    code: number;

    /**
     * 错误信息。
     */
    msg: string;
  };

  /**
   * 需要运行的信息详情。
   */
  required_action?: RequiredActionType;

  /**
   * Token 消耗的详细信息。实际的 Token 消耗以对话结束后返回的值为准。
   */
  usage?: {
    /**
     * 本次对话消耗的 Token 总数，包括 input 和 output 部分的消耗。
     */
    token_count: number;

    /**
     * output 部分消耗的 Token 总数。
     */
    output_count: number;

    /**
     * input 部分消耗的 Token 总数。
     */
    input_count: number;
  };
}

export interface StreamChatReq {
  /**
   * 要进行会话聊天的 Bot ID。
   */
  bot_id: string;

  /**
   * 标识当前与 Bot 交互的用户，由使用方在业务系统中自行定义、生成与维护。
   */
  user_id: string;

  /**
   * 对话的附加信息。你可以通过此字段传入本次对话中用户的问题。数组长度限制为 100，即最多传入 100 条消息。
   *
   * - 当 auto_save_history=true 时，additional_messages 会作为消息先添加到会话中，然后作为上下文传给大模型。
   * - 当 auto_save_history=false 时，additional_messages 只会作为附加信息传给大模型，additional_messages 和模型返回等本次对话的所有消息均不会添加到会话中。
   *
   * 为了保证模型效果，additional_messages 最后一条消息会作为本次对话的用户输入内容传给模型，所以最后一条消息建议传 role=user 的记录，以免影响模型效果。
   *
   * 如果本次对话未指定会话或指定的会话中无消息时，必须通过此参数传入 Bot 用户的问题。
   */
  additional_messages?: EnterMessage[];

  /**
   * Bot 中定义的变量。在 Bot prompt 中设置变量 {{key}} 后，可以通过该参数传入变量值，同时支持 Jinja2 语法。详细说明可参考变量示例。
   */
  custom_variables?: Record<string, string>;

  /**
   * 是否自动保存历史对话记录：
   *
   * - true：（默认）保存此次模型回复结果和模型执行中间结果。
   * - false：系统不保存历史对话记录，后续无法查看本次对话的基础信息或消息详情。
   */
  auto_save_history?: boolean;

  /**
   * 创建消息时的附加消息，获取消息时也会返回此附加消息。
   * 自定义键值对，应指定为 Map 对象格式。长度为 16 对键值对，其中键（key）的长度范围为 1～64 个字符，值（value）的长度范围为 1～512 个字符。
   */
  meta_data?: MetaDataType;

  /**
   * 标识对话发生在哪一次会话中。
   *
   * 会话是 Bot 和用户之间的一段问答交互。一个会话包含一条或多条消息。对话是会话中对 Bot 的一次调用，Bot 会将对话中产生的消息添加到会话中。
   *
   * - 可以使用已创建的会话，会话中已存在的消息将作为上下文传递给模型。创建会话的方式可参考创建会话。
   * - 对于一问一答等不需要区分 conversation 的场合可不传该参数，系统会自动生成一个会话。
   */
  conversation_id?: string;

  extra_params?: string[];
}

export type StreamChatData =
  | {
      event:
        | 'conversation.chat.created'
        | 'conversation.chat.in_progress'
        | 'conversation.chat.completed'
        | 'conversation.chat.failed'
        | 'conversation.chat.requires_action';
      data: CreateChatData;
    }
  | {
      event: 'conversation.message.delta' | 'conversation.message.completed';
      data: ChatV3Message;
    }
  | { event: 'done'; data: '[DONE]' }
  | { event: 'error'; data: { code: number; msg: string } };

export interface RetrieveChatReq {
  /**
   * 要查询的会话 ID。
   */
  conversation_id: string;

  /**
   * 要查询的会话 ID。
   */
  chat_id: string;
}

interface RequiredActionType {
  /**
   * 额外操作的类型，枚举值为 submit_tool_outputs。
   */
  type: string;

  /**
   * 需要提交的结果详情，通过提交接口上传，并可以继续聊天
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
   * Message ID，即消息的唯一标识。
   */
  id: string;

  /**
   * 此消息所在的会话 ID。
   */
  conversation_id: string;

  /**
   * 编写此消息的 Bot ID。此参数仅在对话产生的消息中返回。
   */
  bot_id: string;

  /**
   * Chat ID。此参数仅在对话产生的消息中返回。
   */
  chat_id: string;

  /**
   * 创建消息时的附加消息，获取消息时也会返回此附加消息。
   */
  meta_data: MetaDataType;

  /**
   * 发送这条消息的实体。取值：
   * - user：代表该条消息内容是用户发送的。
   * - assistant：代表该条消息内容是 Bot 发送的。
   */
  role: RoleType;

  /**
   * 消息的内容，支持纯文本、多模态（文本、图片、文件混合输入）、卡片等多种类型的内容。
   */
  content: string | ObjectStringItem[];

  /**
   * 消息内容的类型，取值包括：
   * - text：文本。
   * - object_string：多模态内容，即文本和文件的组合、文本和图片的组合。
   * - card：卡片。
   *
   * 此枚举值仅在接口响应中出现，不支持作为入参。
   */
  content_type: ContentType;

  /**
   * 消息的创建时间，格式为 10 位的 Unixtime 时间戳，单位为秒（s）。
   */
  created_at: number;

  /**
   * 消息的更新时间，格式为 10 位的 Unixtime 时间戳，单位为秒（s）。
   */
  updated_at: number;

  /**
   * 消息类型。
   */
  type: MessageType;
}

interface ToolCallType {
  /**
   * 上报运行结果的 ID。
   */
  id: string;

  /**
   * 工具类型，枚举值为 function。
   */
  type: string;

  /**
   * 执行方法 function 的定义。
   */
  function: {
    /**
     * 方法名。
     */
    name: string;

    /**
     * 方法参数。
     */
    argument: string;
  };
}

/**
 * https://www.coze.cn/docs/developer_guides/create_conversation#cde8cc95
 */
export interface EnterMessage {
  /**
   * 发送这条消息的实体。取值：
   * - user：代表该条消息内容是用户发送的。
   * - assistant：代表该条消息内容是 Bot 发送的。
   */
  role: RoleType;

  /**
   * 消息类型。
   * - query：用户输入内容。
   * - answer：Bot 返回给用户的消息内容，支持增量返回。如果工作流绑定了 message 节点，可能会存在多 answer 场景，此时可以用流式返回的结束标志来判断所有 answer 完成。
   * - function_call：Bot 对话过程中调用函数（function call）的中间结果。
   * - tool_output：调用工具 （function call）后返回的结果。
   * - tool_response：调用工具 （function call）后返回的结果。
   * - follow_up：如果在 Bot 上配置打开了用户问题建议开关，则会返回推荐问题相关的回复内容。
   * - verbose：多 answer 场景下，服务端会返回一个 verbose 包，对应的 content 为 JSON 格式，content.msg_type =generate_answer_finish 代表全部 answer 回复完成。
   */
  type?: MessageType;

  /**
   * 消息的内容，支持纯文本、多模态（文本、图片、文件混合输入）、卡片等多种类型的内容。
   * - content_type 为 object_string 时，content 为 ObjectStringItem 的数组，详细说明可参考 Object_string object。
   * - 当 content_type = text 时，content 格式为 Markdown。
   */
  content?: string | ObjectStringItem[];

  /**
   * 消息内容的类型，支持设置为：
   * - text：文本。
   * - object_string：多模态内容，即文本和文件的组合、文本和图片的组合。
   * - card：卡片。
   *
   * 此枚举值仅在接口响应中出现，不支持作为入参。
   *
   * content 不为空时，此参数为必选。
   */
  content_type?: ContentType;

  /**
   * 创建消息时的附加消息，获取消息时也会返回此附加消息。
   *
   * 自定义键值对，应指定为 Map 对象格式。长度为 16 对键值对，其中键（key）的长度范围为 1～64 个字符，值（value）的长度范围为 1～512 个字符。
   */
  meta_data?: MetaDataType;
}

/**
 * 创建消息时的附加消息，获取消息时也会返回此附加消息。
 *
 * 自定义键值对，应指定为 Map 对象格式。长度为 16 对键值对，其中键（key）的长度范围为 1～64 个字符，值（value）的长度范围为 1～512 个字符。
 */
export type MetaDataType = Record<string, string>;

/**
 * Bot 模式，取值：
 * - 0：单 Agent 模式
 * - 1：多 Agent 模式
 */
export type BotModeType = 0 | 1;

export enum RoleType {
  User = 'user',
  Assistant = 'assistant',
}

/**
 * 对于 `text` 类型，`content` 除了是普通的文本之外，也可能也是一个 JSON 的字符串。
 *
 * 例如：
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
 * 对于 `object_string` 类型， `content` 是一个 JSON 的字符串的格式。
 *
 * 例如：
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

export type MessageType = 'query' | 'answer' | 'function_call' | 'tool_output' | 'tool_response' | 'follow_up' | 'verbose';

export type ObjectStringItem =
  | { type: 'text'; text: string }
  | { type: 'file'; file_id: string }
  | { type: 'file'; file_url: string }
  | { type: 'image'; file_id: string }
  | { type: 'image'; file_url: string };
