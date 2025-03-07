import { useMemo } from 'react';

import { create } from 'zustand';

import { logger, nanoid } from '@/libs/utils';
import type {
  ConversationStore,
  ChatMessageGroup,
  ChatMessage,
  ChatFrameworkProps,
} from '@/libs/types';
import { SendMessageEvent } from '@/libs/types';
import { useUpdateEffect } from '@/libs/hooks';

import { useChatPropsContext } from '../context';

const packMessageToGroup = (
  newMessageList: ChatMessage[],
): ChatMessageGroup[] => {
  const groups: ChatMessageGroup[] = [];

  newMessageList.map(item => {
    const groupLocalIdCur = nanoid();
    //进入这里的必需有一个localId,用于定位;
    const { chat_id: curChatId, type } = item;
    if (groups.length > 0) {
      const lastGroup = groups[groups.length - 1];
      const { chatId: lastChatId } = lastGroup;

      if (type !== 'question' && lastChatId) {
        if (lastChatId === curChatId) {
          // 同一个对话中的消息放到一起。
          lastGroup.respMessages.push(item);
          return;
        }
      }
    }
    // 新的对话
    if (type !== 'question') {
      groups.push({
        id: groupLocalIdCur,
        chatId: curChatId,
        respMessages: [item],
        sectionId: item.section_id,
      });
    } else {
      groups.push({
        id: groupLocalIdCur,
        chatId: curChatId,
        query: item,
        respMessages: [],
        sectionId: item.section_id,
      });
    }
  });
  return groups;
};

// 两个消息的结合出，需要进行合并，因为 问题、回答可能会处于两个请求中。
const combineMessageGroup = (
  groupBefore: ChatMessageGroup[],
  groupAfter: ChatMessageGroup[],
) => {
  let messageGroupsToSave: ChatMessageGroup[] = [];
  const lastGroupInBefore = groupBefore[groupBefore.length - 1];
  const firstGroupInAfter = groupAfter[0];
  if (!firstGroupInAfter?.query && firstGroupInAfter) {
    // 新消息是回答，回答是一定会有chatId的。
    // 如果chatId一致，则将新消息合并到当前的消息中。
    // 如果上一个query没有chatId，就认为这两个对话被两个请求被截断了，需要合并到一起
    if (
      lastGroupInBefore?.chatId === firstGroupInAfter?.chatId ||
      !lastGroupInBefore?.chatId
    ) {
      lastGroupInBefore.chatId = firstGroupInAfter?.chatId;
      groupAfter.shift(); // 合并后，清除上一个数据
      lastGroupInBefore.respMessages = [
        ...lastGroupInBefore.respMessages,
        ...firstGroupInAfter.respMessages,
      ];
      groupBefore[groupBefore.length - 1] = { ...lastGroupInBefore };
    }
  }
  messageGroupsToSave = [...groupBefore, ...groupAfter];
  return messageGroupsToSave;
};

const defaultData = {
  id: '',
  sectionId: '',
  chatMessageGroups: [],

  prevCursorId: '',
  prevHasMore: false,
  prevError: undefined,

  nextCursorId: '',
  nextHasMore: false,
  nextError: undefined,
  sendMessageService: undefined,
  inProcessChatMessageGroup: undefined,
  isUnshiftingMessageFlag: false,
};
// eslint-disable-next-line max-lines-per-function
const createConversationStore = ({ eventCallbacks }: ChatFrameworkProps) => {
  let eventCallbacksAboutMessage = eventCallbacks?.message;
  // eslint-disable-next-line max-lines-per-function
  return create<ConversationStore>()((set, get) => {
    const clearConversation = () => {
      set({
        ...defaultData,
      });
      get().closeSendMessage();
    };
    return {
      ...defaultData,
      setEventCallbacksAboutMessage: callbacks => {
        eventCallbacksAboutMessage = callbacks;
      },
      setConversationDetail: (detail, messageList) => {
        clearConversation();
        set({
          ...detail,
          chatMessageGroups: packMessageToGroup(messageList),
        });
      },
      setNewConversationId: (id: string) => {
        clearConversation();
        // 新会话的时候，不需要向前翻页，且消息记录是空的。
        set({
          id,
        });
      },
      setSectionId: (id: string) => {
        set({
          sectionId: id,
        });
      },
      // 处于末尾，目前只会存在于新回复消息。
      pushMessageList: (list: ChatMessage[]) => {
        const curMessageGroups = get().chatMessageGroups;
        const newMessageGroups = packMessageToGroup(list);

        set({
          chatMessageGroups: combineMessageGroup(
            curMessageGroups,
            newMessageGroups,
          ),
        });
      },
      unshiftMessageList: (conversationId: string, list: ChatMessage[]) => {
        const { chatMessageGroups } = get();
        const conversationIdCur = get().id;
        if (conversationId !== conversationIdCur) {
          // 异常处理， 比如已经清空了数据，但是上一屏幕数据才到。
          return null;
        }

        let firstAnswerMessage: ChatMessageGroup | undefined;
        if (chatMessageGroups[0] && !chatMessageGroups?.[0]?.query) {
          firstAnswerMessage = chatMessageGroups.shift();
        }
        const topChatMessageGroups = combineMessageGroup(
          packMessageToGroup(list),
          firstAnswerMessage ? [firstAnswerMessage] : [],
        );

        set({
          isUnshiftingMessageFlag: true,
          chatMessageGroups: [...topChatMessageGroups, ...chatMessageGroups],
        });
      },
      setPrevInfo: (prevHasMore: boolean, prevCursorId: string) => {
        set({
          prevError: undefined,
          prevHasMore,
          prevCursorId,
        });
      },
      setNextInfo: (nextHasMore: boolean, nextCursorId: string) => {
        set({
          nextError: undefined,
          nextHasMore,
          nextCursorId,
        });
      },

      isShowOnBoarding: () => {
        const { chatMessageGroups, inProcessChatMessageGroup } = get();
        return chatMessageGroups.length === 0 && !inProcessChatMessageGroup;
      },
      clearUnshiftingMessageFlg: (scrollTop?: number) => {
        set({
          scrollTop,
          isUnshiftingMessageFlag: false,
        });
      },
      setPrevError: error => {
        set({
          prevError: error,
        });
      },
      setNextError: error => {
        set({
          nextError: error,
        });
      },
      setSendMessageService: service => {
        set({
          sendMessageService: service,
        });
        const groupLocalId = nanoid();
        service.on(SendMessageEvent.ReceiveMessage, event => {
          const group = packMessageToGroup(event.messages)[0];
          logger.debug(
            '[dev] ReceiveMessage',
            event.messages[event.messages.length - 1].content,
          );
          group.id = groupLocalId;
          group.isAWaiting = true;

          set({
            inProcessChatMessageGroup: group,
          });
        });

        service.on(SendMessageEvent.ReceiveComplete, event => {
          const { messages, error } = event;
          set({
            inProcessChatMessageGroup: undefined,
          });
          const curMessageGroups = get().chatMessageGroups;

          let messageList = event.messages;
          if (messages.length === 1 && error) {
            messageList = [{ ...messages[0], error }];
          }
          const newGroup = packMessageToGroup(messageList)[0];
          newGroup.id = groupLocalId;
          newGroup.sectionId;
          if (newGroup.sectionId) {
            get().setSectionId(newGroup.sectionId || '');
          } else {
            newGroup.sectionId = get().sectionId;
          }

          eventCallbacksAboutMessage?.afterMessageReceivedFinish?.({
            extra: {
              processChatMessageGroup: newGroup,
            },
          });
          set({
            chatMessageGroups: combineMessageGroup(curMessageGroups, [
              newGroup,
            ]),
          });
        });

        service.on(SendMessageEvent.Close, () => {
          set({
            inProcessChatMessageGroup: undefined,
            sendMessageService: undefined,
          });
        });
      },
      closeSendMessage: () => {
        const service = get().sendMessageService;
        service?.close();
      },
      popLastErrorChatGroup: () => {
        const { chatMessageGroups } = get();
        if (
          chatMessageGroups[chatMessageGroups.length - 1]?.query?.error &&
          chatMessageGroups[chatMessageGroups.length - 1]?.query?.rawMessage
        ) {
          const chatGroup = chatMessageGroups.pop();
          set({
            chatMessageGroups,
          });
          return chatGroup || null;
        }
        return null;
      },
    };
  });
};

export type CreateConversationStore = ReturnType<
  typeof createConversationStore
>;

export const useCreateConversationStore = () => {
  const chatProps = useChatPropsContext();
  const conversationStore = useMemo(
    () => createConversationStore(chatProps),
    [],
  );
  useUpdateEffect(() => {
    conversationStore
      .getState()
      .setEventCallbacksAboutMessage(chatProps?.eventCallbacks?.message);
  }, [chatProps?.eventCallbacks?.message]);
  return conversationStore;
};
