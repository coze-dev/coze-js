import { Events, type TaroStatic } from "@tarojs/taro";
import { type EnterMessage, RoleType, type ContentType } from "@coze/api";
import { MiniChatError, logger, nanoid } from "@/libs/utils";
import {
  type ChatMessage,
  ISendMessage,
  SendMessageEvent,
  type RawMessage,
  type SendMessageEventData,
  IChatService,
  ChatInfo,
} from "@/libs/types";
import { I18n } from "@/libs/i18n";

export interface SendMessageOptions {
  conversationId: string;
  botId: string;
  chatService: IChatService;
  chatInfo?: ChatInfo;
  userId: string;
  connectorId: string;
  sectionId?: string;
  i18n: I18n;
}

export abstract class RawSendMessage implements ISendMessage {
  protected botId: string;
  protected userId: string;
  protected conversationId: string;
  protected sectionId?: string;

  private timeoutId?: number;
  protected chatId: string;
  protected connectorId: string;
  protected isAbort: boolean;
  protected chatService: IChatService;
  protected event: InstanceType<TaroStatic["Events"]>;
  protected messageSended: ChatMessage; // 发送出去的消息
  protected messageList: ChatMessage[]; // 当前的消息列表
  protected chatInfo?: ChatInfo;
  protected i18n: I18n;
  constructor({
    conversationId,
    botId,
    chatService,
    userId,
    connectorId,
    sectionId,
    chatInfo,
    i18n,
  }: SendMessageOptions) {
    this.botId = botId;
    this.conversationId = conversationId;
    this.chatInfo = chatInfo;
    this.isAbort = false;
    this.chatService = chatService;

    this.event = new Events();
    this.messageList = [];
    this.userId = userId;
    this.chatId = "";
    this.connectorId = connectorId;
    this.sectionId = sectionId;
    this.i18n = i18n;

    //默认值，初始化使用
    this.messageSended = {
      id: "",
      role: RoleType.User,
      conversation_id: this.conversationId,
      section_id: this.sectionId,
      bot_id: this.botId,
      chat_id: "",
      localId: nanoid(),
      meta_data: {},
      content: "",
      content_type: "text",
      created_at: Date.now(),
      updated_at: Date.now(),
      type: "question",
    };
  }
  abstract sendRawMessage(
    _rawMessage: RawMessage,
    _historyMessages?: EnterMessage[]
  );

  sendMessage(_message: EnterMessage, _historyMessages?: EnterMessage[]) {
    throw new Error("Un implement sendMessage");
  }

  on(
    eventName: SendMessageEvent,
    callback: (args: SendMessageEventData) => void
  ) {
    this.event.on(eventName, callback);
  }
  off(
    eventName: SendMessageEvent,
    callback: (args: SendMessageEventData) => void
  ) {
    this.event.off(eventName, callback);
  }
  protected emit(eventName: SendMessageEvent, data: SendMessageEventData) {
    if (eventName === SendMessageEvent.ReceiveComplete) {
      // 调用结束，关闭对话
      this.close(data);
    } else {
      this.event.trigger(eventName, data);
    }
  }

  // 结束的时候，一定要调用该位置。
  close(data?: SendMessageEventData) {
    this._clearTimeout();
    if (this.isAbort) {
      return false;
    }
    // 关闭轮询
    const eventData = data || {
      messages: this.messageList,
      status: "complete",
    };
    this.isAbort = true;
    this.event.trigger(SendMessageEvent.ReceiveComplete, eventData);
    this.event.trigger(SendMessageEvent.Close, eventData);
    this.event.off();
    return true;
  }
  break() {
    this.close();
    // 取消后续的模型回答，并关闭轮询
    // todo: 暂时无此场景，不处理
  }

  // question消息发送成功事件
  protected sendStartMessage(message: Partial<ChatMessage | EnterMessage>) {
    this.packMessage(message);
    this.sendProcessEvent();
  }

  private packMessage(message: Partial<ChatMessage | EnterMessage>) {
    this.messageSended = {
      ...this.messageSended,
      ...{
        content: message.content as string,
        content_type: message.content_type as ContentType,
        // @ts-expect-error -- linter-disable-autofix
        isAudioTranslatingToText: message.isAudioTranslatingToText,
      },
    };
    this.messageList = [this.messageSended];
  }

  // 消息打断事件，暂时未使用
  protected sendBreakEvent() {
    this.emit(SendMessageEvent.ReceiveComplete, {
      status: "break",
      messages: this.messageList,
    });
  }
  // 消息进行中事件，
  protected sendProcessEvent() {
    logger.debug(
      "[dev] in_process",
      this.messageList[this.messageList.length - 1].content
    );
    this.emit(SendMessageEvent.ReceiveMessage, {
      status: "in_process",
      messages: this.messageList,
    });
  }

  // 消息完成事件
  protected sendCompleteEvent() {
    this.emit(SendMessageEvent.ReceiveComplete, {
      status: "complete",
      messages: this.messageList,
    });
  }
  // 消息失败事件
  protected sendErrorEvent(
    error: MiniChatError = new MiniChatError(-1, "对话失败")
  ) {
    this.emit(SendMessageEvent.ReceiveComplete, {
      status: "error",
      messages: this.messageList,
      error,
    });
  }

  protected _checkTimeout(timeout = 210000) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      logger.error("send message timeout");
      this.sendErrorEvent(new MiniChatError(-1, "timeout"));
    }, timeout) as unknown as number;
  }
  protected _clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
