import { FC, PropsWithChildren, useEffect, useMemo, useRef } from 'react';

import cls from 'classnames';

import { logger } from '@/libs/utils';
import {
  ScrollView,
  Spinning,
  ErrorRetry,
  ErrorRetryBtn,
  ScrollViewRef,
} from '@/libs/ui-kit';
import { UIEventType } from '@/libs/types';
import { useScrollMore } from '@/libs/services';
import { useUiEventStore } from '@/libs/provider/context/chat-store-context';
import { useConversationStore, useI18n } from '@/libs/provider';
import { useUpdateEffect } from '@/libs/hooks';

import styles from './index.module.less';

const ChatTopStatus: FC<{
  onScrollToUpper?: () => void;
}> = ({ onScrollToUpper }) => {
  const i18n = useI18n();

  const { prevError, prevHasMore } = useConversationStore(store => ({
    prevError: store.prevError,
    prevHasMore: store.prevHasMore,
  }));
  const isNeedPrevLoadMore = prevHasMore;
  return (
    <>
      {prevError ? (
        <ErrorRetry
          errorText={i18n.t('messageListRetry', {
            retry: (
              <ErrorRetryBtn
                retryText={i18n.t('retryBtn')}
                onClick={() => {
                  onScrollToUpper?.();
                }}
              />
            ),
          })}
        />
      ) : isNeedPrevLoadMore ? (
        <Spinning
          text={i18n.t('messageListLoading')}
          className={styles.loading}
          size={'small'}
        />
      ) : null}
    </>
  );
};

export const ChatScrollView: FC<PropsWithChildren> = ({ children }) => {
  const refScroll = useRef<ScrollViewRef>(null);
  const { upperThreshold, onScrollToUpper } = useScrollMore();
  const { isUnshiftingMessageFlag, clearUnshiftingMessageFlg } =
    useConversationStore(store => ({
      isUnshiftingMessageFlag: store.isUnshiftingMessageFlag,
      clearUnshiftingMessageFlg: store.clearUnshiftingMessageFlg,
    }));
  const hasProcessChatMessageGroup = useConversationStore(
    store => !!store.inProcessChatMessageGroup,
  );

  const chatEvent = useUiEventStore(store => store.event);

  useEffect(() => {
    if (isUnshiftingMessageFlag) {
      clearUnshiftingMessageFlg();
    }
  }, [isUnshiftingMessageFlag]);

  const chatContent = useMemo(
    () => (
      <>
        <ChatTopStatus {...{ onScrollToUpper }} />
        {children}
      </>
    ),
    [children, onScrollToUpper],
  );

  useEffect(() => {
    chatEvent.on(UIEventType.ChatSlotToBottom, () => {
      refScroll.current?.scrollToBottom();
    });
    chatEvent.on(UIEventType.ChatSlotScrollToAnchorBottom, () => {
      refScroll.current?.scrollToAnchorBottom();
    });
    chatEvent.on(UIEventType.ChatSlotRemoveAnchorBottom, () => {
      refScroll.current?.removeAnchorBottom();
    });
  }, []);
  useUpdateEffect(() => {
    if (hasProcessChatMessageGroup) {
      refScroll.current?.scrollToAnchorBottom();
    } else {
      refScroll.current?.removeAnchorBottom();
    }
  }, [hasProcessChatMessageGroup]);
  logger.debug('ScrollView props isUnshiftingMessageFlag', {
    isUnshiftingMessageFlag,
  });

  return (
    <ScrollView
      ref={refScroll}
      className={cls(styles['scroll-container'])}
      scrollY={true}
      isLoadMore={isUnshiftingMessageFlag}
      lowerThreshold={upperThreshold}
      onScrollToLower={onScrollToUpper}
      isNeedHelper={true}
    >
      {chatContent}
    </ScrollView>
  );
};
