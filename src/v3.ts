import type {
  MetaDataType,
  MessageType,
  RoleType,
  ObjectStringItem,
  ContentType,
  EnterMessage,
} from "./v2.js";

export type ChatV3StreamingEventType =
  | "conversation.chat.created"
  | "conversation.chat.in_progress"
  | "conversation.message.delta"
  | "conversation.message.completed"
  | "conversation.chat.completed"
  | "conversation.chat.failed"
  | "conversation.chat.requires_action"
  | "done";

export interface ChatV3Req {
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
   * 是否启用流式返回，默认值 false。
   *
   * - true：采用流式响应。 “流式响应”将模型的实时响应提供给客户端，你可以实时获取服务端返回的对话、消息事件，并在客户端中同步处理、实时展示，也可以在 completed 事件中获取 Bot 最终的回复。
   * - false：（默认）采用非流式响应。 “非流式响应”是指响应中仅包含本次对话的状态等元数据。此时应同时开启 auto_save_history，在本次对话处理结束后再查看模型回复等完整响应内容。可以参考以下业务流程：
   *     - 调用发起会话接口，并设置 stream = false，auto_save_history=true，表示使用非流式响应，并记录历史消息。你需要记录会话的 Conversation ID 和 Chat ID，用于后续查看详细信息。
   *     - 定期轮询查看对话详情接口，直到会话状态流转为终态，即 status 为 completed 或 required_action。
   *     - 调用查看对话消息详情接口，查询大模型生成的最终结果。
   */
  stream?: boolean;

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

export type ChatV3StreamResp =
  | {
      event:
        | "conversation.chat.created"
        | "conversation.chat.in_progress"
        | "conversation.chat.completed"
        | "conversation.chat.failed"
        | "conversation.chat.requires_action";
      data: ChatV3Resp;
    }
  | {
      event: "conversation.message.delta" | "conversation.message.completed";
      data: ChatV3Message;
    }
  | { event: "done"; data: "[DONE]" };

export interface ChatV3Resp {
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
  status:
    | "created"
    | "in_progress"
    | "completed"
    | "failed"
    | "requires_action";

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
