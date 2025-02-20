import { useCallback } from 'react';

import { logger, showToast } from '@/libs/utils';
import { useApiClientStore } from '@/libs/provider';

import { UIEventType } from '../types';
import {
  useConversationStore,
  useChatStatusStore,
  useI18n,
  useUiEventStore,
} from '../provider/context/chat-store-context';
export const useClearContext = () => {
  const { conversationId, setSectionId } = useConversationStore(store => ({
    conversationId: store.id,
    setSectionId: store.setSectionId,
  }));
  const { getOpDisabledState, setIsClearingContext } = useChatStatusStore(
    store => ({
      setIsClearingContext: store.setIsClearingContext,
      getOpDisabledState: store.getOpDisabledState,
    }),
  );
  const targetEventCenter = useUiEventStore(store => store.event);
  const chatEvent = useUiEventStore(store => store.event);
  const chatService = useApiClientStore(store => store.chatService);
  const i18n = useI18n();
  const clearContext = useCallback(async () => {
    const { clearContext: disableState } = getOpDisabledState();
    if (!conversationId) {
      logger.error('clearContext, conversationId is empty');
      return;
    }
    if (disableState) {
      return;
    }
    setIsClearingContext(true);
    chatEvent.trigger(UIEventType.ChatSlotScrollToAnchorBottom);
    try {
      const { sectionId } = await chatService.createNewSection(conversationId);

      setSectionId(sectionId);
    } catch (err) {
      showToast(
        {
          content: i18n.t('clearContextFailed'),
          icon: 'error',
        },
        targetEventCenter,
      );
    }
    chatEvent.trigger(UIEventType.ChatSlotRemoveAnchorBottom);

    setIsClearingContext(false);
  }, [conversationId, targetEventCenter]);

  return {
    clearContext,
  };
};
