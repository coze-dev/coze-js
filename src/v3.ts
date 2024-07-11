import type {
  MetaDataType,
  MessageType,
  RoleType,
  ObjectStringItem,
  ContentType,
} from "./v2.js";

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
