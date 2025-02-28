import { useCallback } from 'react';

import { type EnterMessage } from '@coze/api';

import { showToast } from '@/libs/utils';
import { useApiClientStore, useUserInfoStore } from '@/libs/provider';

import { AudioRaw, ChooseFileInfo, SendMessageEvent } from '../types';
import {
  useConversationStore,
  useChatStatusStore,
  useChatInfoStore,
  useI18n,
  useUiEventStore,
  useChatInputStore,
  useChatPropsStore,
} from '../provider/context/chat-store-context';
import {
  getSendMessageHandler,
  type RawMessage,
  RawMessageType,
} from './helper/message';
import { usePersistCallback } from '../hooks';
// eslint-disable-next-line max-lines-per-function
export const useSendMessage = () => {
  const {
    setSendMessageService,
    conversationId,
    sectionId,
    popLastErrorChatGroup,
  } = useConversationStore(store => ({
    setSendMessageService: store.setSendMessageService,
    conversationId: store.id,
    sectionId: store.sectionId,
    popLastErrorChatGroup: store.popLastErrorChatGroup,
  }));
  const i18n = useI18n();
  const userInfo = useUserInfoStore(store => store.info);
  const botId = useChatInfoStore(store => store.id);
  const { getOpDisabledState, setIsDeleting } = useChatStatusStore(store => ({
    setIsDeleting: store.setIsDeleting,
    getOpDisabledState: store.getOpDisabledState,
  }));
  const chatInfo = useChatInfoStore(store => store.info);
  const setTaskList = useChatInputStore(store => store.setTaskList);
  const { connectorId, chatService } = useApiClientStore(store => ({
    connectorId: store.connectorId,
    chatService: store.chatService,
  }));
  const targetEventCenter = useUiEventStore(store => store.event);
  const onRequiresAction = useChatPropsStore(
    store => store.eventCallbacks?.message?.onRequiresAction,
  );
  const sendMessage = usePersistCallback(
    (rawMessage: RawMessage, historyMessages?: EnterMessage[]) => {
      const { clearMessage: disableState } = getOpDisabledState();
      if (disableState) {
        return;
      }
      if (!botId || !conversationId) {
        return;
      }
      // Clear task message after message sended
      setTaskList({ taskList: [] });
      setIsDeleting(true);
      const sendMessageHandler = getSendMessageHandler({
        botId,
        chatService,
        conversationId,
        userId: userInfo?.id || '',
        connectorId,
        sectionId,
        chatInfo: chatInfo || undefined,
        i18n,
      });

      sendMessageHandler.on(SendMessageEvent.RequireAction, event => {
        onRequiresAction?.({
          extra: {
            requireAction: event.event,
          },
        });
      });
      sendMessageHandler.on(SendMessageEvent.Close, () => {
        setIsDeleting(false);
      });
      sendMessageHandler.on(SendMessageEvent.ReceiveComplete, event => {
        if (event.error) {
          showToast(
            {
              content:
                event.error?.getErrorMessageByI18n(i18n, {}) ||
                i18n.t('sendFailed'),
              icon: 'error',
              duration: 2000,
            },
            targetEventCenter,
          );
        }
      });
      setSendMessageService(sendMessageHandler);
      sendMessageHandler.sendRawMessage(rawMessage, historyMessages);
    },
  );

  const sendTextMessage = useCallback(
    (content: string) => {
      sendMessage({
        type: RawMessageType.TEXT,
        data: content,
      });
    },
    [sendMessage],
  );
  const sendFileMessage = useCallback(
    (files: ChooseFileInfo[]) => {
      sendMessage({
        type: RawMessageType.FILE,
        data: files,
      });
    },
    [sendMessage],
  );

  const sendAudioMessage = useCallback(
    (audio: AudioRaw) => {
      sendMessage({
        type: RawMessageType.AUDIO,
        data: audio,
      });
    },
    [sendMessage],
  );

  const reSendLastErrorMessage = useCallback(() => {
    const chatMessageGroup = popLastErrorChatGroup();
    if (chatMessageGroup?.query?.rawMessage) {
      sendMessage(chatMessageGroup?.query?.rawMessage);
    }
  }, [sendMessage]);

  return {
    sendMessage,
    sendTextMessage,
    sendFileMessage,
    sendAudioMessage,
    reSendLastErrorMessage,
  };
};
