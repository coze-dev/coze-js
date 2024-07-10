export type Fetch = typeof fetch;

export interface Config {
  endpoint?: string;
  api_key: string;
  fetch?: Fetch;
}

export interface ChatV1Req {
  /**
   * 标识API背后的具体交互bot
   */
  bot_id: string;

  /**
   * 用户输入内容
   */
  query: string;

  /**
   * 标识对话发生在哪一次会话中，使用方自行维护此字段
   */
  conversation_id?: string;

  /**
   * 指定所使用的bot版本，默认最新
   */
  bot_version?: string;

  /**
   * 标识当前与bot交互的用户，使用方自行维护此字段
   */
  user?: string;

  /**
   * 传递会话上下文
   */
  chat_history?: ChatV1Message[];

  /**
   * 扩展参数，目前暂未使用
   */
  extra?: Record<string, string>;

  /**
   * 是否采用流式返回，默认为 false
   */
  stream?: boolean;

  /**
   * 自定义变量，key=变量名，value=变量值
   */
  custom_variables?: Record<string, any>;
}

/**
 * 非流式返回结构
 */
export interface ChatV1Resp {
  /**
   * 整个对话过程返回的消息
   */
  messages: ChatV1Message[];

  /**
   * 当前对话的标识
   */
  conversation_id: string;

  /**
   * 状态码，非0标识对话过程出现错误
   * - 对于非流式返回，只有code=0才会返回messages
   */
  code: number;

  /**
   * 状态信息，成功请求为"success"，错误请求为error信息
   */
  msg: string;
}

/**
 * 流式返回结构
 */
export interface ChatV1StreamResp {
  /**
   * 增量返回的消息内容
   */
  message: ChatV1Message;

  /**
   * 标识当前message是否结束
   *
   * message结束不一定代表整个流结束，bot返回的message会有不同的type，可见 ChatMessage 的介绍
   */
  is_finish?: boolean;

  /**
   * 当前的会话id
   */
  conversation_id: string;

  /**
   * 返回message的标识，一个index唯一对应一条message
   */
  index: number;
}

export interface ChatV1Message {
  /**
   * 标识发送消息的角色：用户或机器人
   * - user：用户输入内容
   * - assistant：返回内容
   */
  role: string;

  /**
   * 标识消息类型，主要用于区分role=assistant时bot返回的消息：
   * - answer：bot最终返回给用户的消息内容
   * - function_cal： bot对话过程中决定调用function_call的中间结果
   * - tool_response：function_call调用工具后返回的结果
   * - follow_up：如果在bot上配置打开了Auto-Suggestion开关，则会返回flow_up内容
   */
  type: string;

  /**
   * 消息的内容
   */
  content: string;

  /**
   * 消息内容的类型
   * - text 文本类型，bot返回type=answer时采用markdown语法返回
   * - 其他类型目前暂未上线，后续扩展
   */
  content_type: string;
}
