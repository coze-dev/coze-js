import type { ChatV1Message } from "./v1.js";

export type ChatV2Message = ChatV1Message;

export interface ChatV2Req {
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
   * 标识当前与bot交互的用户，使用方自行维护此字段
   */
  user?: string;

  /**
   * 传递会话上下文
   */
  chat_history?: ChatV2Message[];

  /**
   * 是否采用流式返回，默认为 false
   */
  stream?: boolean;

  /**
   * Bot Prompt 配置了jinja语法的参数，通过这个字段传入
   */
  custom_variables?: Record<string, any>;
}

export interface ChatV2Resp {
  /**
   * 整个对话过程返回的消息
   */
  messages: ChatV2Message[];

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

export interface ChatV2StreamResp {
  /**
   * 增量返回的消息内容
   */
  message: ChatV2Message;

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
