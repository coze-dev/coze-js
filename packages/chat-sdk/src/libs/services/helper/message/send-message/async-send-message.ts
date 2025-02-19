import {
  type EnterMessage,
  ChatEventType,
  type StreamChatData,
  CreateChatData,
} from "@coze/api";

import { logger, MiniChatError, safeJSONParse } from "@/libs/utils";
import { ChatMessage } from "@/libs/types";
import { MultiSendMessage } from "./multi-send-message";
import { SendMessageOptions } from "./raw-send-message";

export class AsyncSendMessage extends MultiSendMessage {
  private chatStream?: AsyncIterable<StreamChatData>;

  constructor(props: SendMessageOptions) {
    super(props);
  }

  async sendMessage(message: EnterMessage, historyMessages?: EnterMessage[]) {
    try {
      logger.debug("asyncChat start sendMessage: ", message);
      this._checkTimeout();
      const chatStream = await this.chatService.asyncChat({
        bot_id: this.botId,
        user_id: this.userId,
        additional_messages: [...(historyMessages || []), message],
        conversation_id: this.conversationId,
        connector_id: this.connectorId,
        suggestPromoteInfo: this.chatInfo?.suggestPromoteInfo,
      });
      logger.debug("asyncChat sendMessage stream: ", chatStream);
      this.chatStream = chatStream;
      this.pollAnswer();
    } catch (err) {
      logger.error("asyncChat sendMessage error", err);
      this.sendErrorEvent(new MiniChatError(-1, this.i18n.t("sendFailed")));
      this.close();
    }
  }

  protected async pollAnswer() {
    if (!this.chatStream) {
      logger.error("asyncChat pollAnswer", "chatStream is undefined");
      // 这里基本不会出现，下边方便通过语法结构
      this.sendErrorEvent(new MiniChatError(-1, this.i18n.t("sendFailed")));
      return;
    }

    logger.debug("asyncChat pollAnswer awaiting start");
    const messageList: ChatMessage[] = [];
    let messageInProcessing: ChatMessage | null = null;
    this._checkTimeout();
    try {
      for await (let eventData of this.chatStream) {
        this._checkTimeout();
        if (!this.isAbort) {
          const { event, data } = eventData;
          /*
           * 未做处理消息
           * CONVERSATION_CHAT_REQUIRES_ACTION
           * CONVERSATION_CHAT_IN_PROGRESS
           * CONVERSATION_AUDIO_DELTA
           * CONVERSATION_CHAT_COMPLETED
           */
          switch (event) {
            case ChatEventType.CONVERSATION_CHAT_CREATED:
              {
                const messageNew = safeJSONParse(eventData.data);
                // @ts-expect-error -- linter-disable-autofix
                const { id: chatId, section_id: sectionId } = messageNew || {};
                this.messageSended.chat_id = chatId || "";
                this.messageSended.section_id = sectionId;
                this.messageSended.extData = {
                  // @ts-expect-error -- linter-disable-autofix
                  executeId: data?.execute_id,
                };
                this.messageSended = { ...this.messageSended };
                this.messageList = [this.messageSended, ...(messageList || [])];

                this.sendProcessEvent();
              }
              break;
            case ChatEventType.CONVERSATION_MESSAGE_DELTA:
              {
                const messageNew = safeJSONParse(data) as ChatMessage;
                if (!messageNew) {
                  break;
                }
                if (!messageInProcessing) {
                  messageInProcessing = messageNew;
                } else {
                  messageInProcessing.content =
                    messageInProcessing.content || "";
                  messageInProcessing.content += messageNew.content || "";
                  if (
                    !messageInProcessing.content ||
                    !messageInProcessing.reasoning_content
                  ) {
                    messageInProcessing.reasoning_content =
                      messageInProcessing.reasoning_content || "";
                    messageInProcessing.reasoning_content +=
                      messageNew.reasoning_content || "";
                  }
                }
                messageInProcessing.isComplete = false;
                this.messageList = [
                  this.messageSended,
                  ...(messageList || []),
                  messageInProcessing,
                ];

                this.sendProcessEvent();
              }
              break;
            case ChatEventType.CONVERSATION_MESSAGE_COMPLETED:
              {
                // 消息结束
                const messageNew = safeJSONParse(data) as ChatMessage;

                if (messageInProcessing) {
                  messageInProcessing.isComplete = true;
                  messageList.push(messageInProcessing);
                  messageInProcessing = null;
                } else {
                  if (!messageNew) {
                    break;
                  }
                  messageNew.isComplete = true;
                  messageList.push(messageNew);
                }

                this.messageList = [this.messageSended, ...(messageList || [])];
                this.sendProcessEvent();
              }
              break;
            case ChatEventType.ERROR: {
              const messageError = safeJSONParse(data) as {
                code: number;
                msg: string;
              };
              this.sendErrorEvent(
                new MiniChatError(
                  messageError.code || -1,
                  messageError.msg || this.i18n.t("sendFailed")
                )
              );
              return;
            }
            case ChatEventType.CONVERSATION_CHAT_FAILED: {
              const messageError = safeJSONParse(data) as CreateChatData;

              this.sendErrorEvent(
                new MiniChatError(
                  messageError.last_error?.code || -1,
                  messageError.last_error?.msg || this.i18n.t("sendFailed")
                )
              );
              return;
            }
            case ChatEventType.DONE: {
              this.messageList = [this.messageSended, ...(messageList || [])];
              this.sendCompleteEvent();
              return;
            }
            default:
              break;
          }
        } else {
          return;
        }
      }
    } catch (error) {
      logger.error("asyncChat pollAnswer error", error);
      this.sendErrorEvent(new MiniChatError(-1, this.i18n.t("sendFailed")));
      return;
    }
  }
}
