import {
  type EnterMessage,
  ChatEventType,
  type StreamChatData,
  CreateChatData,
} from '@coze/api';

import { logger, MiniChatError, safeJSONParse } from '@/libs/utils';
import { ChatMessage, Language } from '@/libs/types';

import { MultiSendMessage } from './multi-send-message';

const errorCodeListToShowInMessage = ['4033', '4028', '4027', '4013'];
export class AsyncSendMessage extends MultiSendMessage {
  private chatStream?: AsyncIterable<StreamChatData>;

  async sendMessage(message: EnterMessage, historyMessages?: EnterMessage[]) {
    try {
      logger.debug('asyncChat start sendMessage: ', message);
      this._checkTimeout();
      const chatStream = await this.chatService.asyncChat(
        {
          bot_id: this.botId,
          user_id: this.userId,
          additional_messages: [...(historyMessages || []), message],
          conversation_id: this.conversationId,
          connector_id: this.connectorId,
          suggestPromoteInfo: this.chatInfo?.suggestPromoteInfo,
        },
        {
          headers: {
            'Accept-Language':
              this.i18n.language === Language.ZH_CN ? 'zh' : 'en',
          },
        },
      );
      logger.debug('asyncChat sendMessage stream: ', chatStream);
      this.chatStream = chatStream;
      this.pollAnswer();
    } catch (err) {
      logger.error('asyncChat sendMessage error', err);
      this.sendErrorEvent(new MiniChatError(-1, this.i18n.t('sendFailed')));
      this.close();
    }
  }
  // eslint-disable-next-line max-lines-per-function, complexity
  protected async pollAnswer() {
    if (!this.chatStream) {
      logger.error('asyncChat pollAnswer', 'chatStream is undefined');
      // 这里基本不会出现，下边方便通过语法结构
      this.sendErrorEvent(new MiniChatError(-1, this.i18n.t('sendFailed')));
      return;
    }

    logger.debug('asyncChat pollAnswer awaiting start');
    const messageList: ChatMessage[] = [];
    let messageInProcessing: ChatMessage | null = null;
    this._checkTimeout();
    try {
      for await (const eventData of this.chatStream) {
        logger.debug('asyncChat pollAnswer awaiting start2', eventData);
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
                this.messageSended.chat_id = chatId || '';
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
                    messageInProcessing.content || '';
                  messageInProcessing.content += messageNew.content || '';
                  if (
                    !messageInProcessing.content ||
                    !messageInProcessing.reasoning_content
                  ) {
                    messageInProcessing.reasoning_content =
                      messageInProcessing.reasoning_content || '';
                    messageInProcessing.reasoning_content +=
                      messageNew.reasoning_content || '';
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
            case ChatEventType.CONVERSATION_CHAT_REQUIRES_ACTION:
              {
                // 消息结束
                const actionEvent = safeJSONParse(data) as CreateChatData;
                this.sendRequireActionEvent(actionEvent);
              }
              break;
            case ChatEventType.ERROR: {
              const messageError = safeJSONParse(data) as {
                code: number;
                msg: string;
              };
              this.chatService.handleErrorCode(messageError.code || -1);

              this.sendHandledErrorEvent(
                messageError.code,
                messageError.msg,
                messageList,
              );
              return;
            }
            case ChatEventType.CONVERSATION_CHAT_FAILED: {
              const messageError = safeJSONParse(data) as CreateChatData;
              this.sendHandledErrorEvent(
                messageError.last_error?.code || -1,
                messageError.last_error?.msg || '',
                messageList,
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
      logger.error('asyncChat pollAnswer error', error);
      this.sendErrorEvent(new MiniChatError(-1, this.i18n.t('sendFailed')));
      return;
    }
  }
  private sendHandledErrorEvent(
    errorCode: number,
    errorMsg: string,
    messageList: ChatMessage[],
  ) {
    if (
      errorCodeListToShowInMessage.includes(errorCode.toString()) &&
      errorMsg
    ) {
      this.messageList = [this.messageSended, ...(messageList || [])];
      this.messageList.push(this.createAnswerTextMessage(errorMsg));
      this.sendCompleteEvent();
    } else {
      this.sendErrorEvent(
        new MiniChatError(
          errorCode || -1,
          errorMsg || this.i18n.t('sendFailed'),
        ),
      );
    }
  }
}
