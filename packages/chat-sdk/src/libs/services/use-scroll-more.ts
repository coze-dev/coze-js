import { useCallback, useRef } from 'react';

import { useApiClientStore } from '@/libs/provider';

import { logger } from '../utils';
import { useConversationStore } from '../provider/context/chat-store-context';
const UPPER_THRESHOLD = 100;
export const useScrollMore = () => {
  const refLoading = useRef<boolean>(false);
  const refDebounce = useRef<number>(Date.now());
  const {
    conversationId,
    unshiftMessageList,

    prevError,
    prevHasMore,
    prevCursorId,

    setPrevInfo,
    setPrevError,
  } = useConversationStore(store => ({
    conversationId: store.id,
    unshiftMessageList: store.unshiftMessageList,

    prevError: store.prevError,
    prevHasMore: store.prevHasMore,
    prevCursorId: store.prevCursorId,

    setPrevInfo: store.setPrevInfo,
    setPrevError: store.setPrevError,
  }));
  const chatService = useApiClientStore(store => store.chatService);

  const onScrollToUpper = useCallback(async () => {
    if (refLoading.current || !conversationId) {
      return;
    }
    logger.debug('onScrollToUpper currentTime', {
      currentTime: refDebounce.current,
      time: Date.now() - refDebounce.current,
    });
    if (Date.now() - refDebounce.current < 1500) {
      return;
    }
    refLoading.current = true;

    // chatService.getMessageList will never throw error, so don't need to catch error
    const {
      messages: messageList,
      error,
      ...rest
    } = await chatService.getMessageList({
      conversationId: conversationId || '',
      prevCursorId,
    });
    unshiftMessageList(conversationId, messageList);
    if (error) {
      setPrevError(error);
    } else {
      setPrevInfo(rest.prevHasMore || false, rest.prevCursorId || '');
    }
    refDebounce.current = Date.now();
    refLoading.current = false;
  }, [prevCursorId, chatService, conversationId, unshiftMessageList]);

  return {
    prevError,
    isNeedPrevLoadMore: prevHasMore,
    upperThreshold: UPPER_THRESHOLD,
    onScrollToUpper: prevHasMore ? onScrollToUpper : undefined,
  };
};
