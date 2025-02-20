import { FC, useMemo } from 'react';

import { View, Text } from '@tarojs/components';

import { Spacing } from '@/libs/ui-kit';
import { type ChatMessageGroup } from '@/libs/types';
import { useCreatePrologueMessage } from '@/libs/services';
import { useConversationStore, useI18n } from '@/libs/provider';

import { ChatGroup } from '../chat-group';

import styles from './index.module.less';
// section分隔线以及
export const SectionPrologueGroup: FC<{
  chatMessageGroupNow: ChatMessageGroup;
  chatMessageGroupNext?: ChatMessageGroup;
}> = ({ chatMessageGroupNow, chatMessageGroupNext }) => {
  const { hasInProcessChatMessageGroup, sectionId } = useConversationStore(
    store => ({
      hasInProcessChatMessageGroup: !!store.inProcessChatMessageGroup,
      sectionId: store.sectionId,
    }),
  );
  const isShowDivide = useMemo(() => {
    if (chatMessageGroupNext) {
      if (chatMessageGroupNext.sectionId !== chatMessageGroupNow.sectionId) {
        return true;
      }
    } else if (chatMessageGroupNow.sectionId !== sectionId) {
      return true;
    }
    return false;
  }, [chatMessageGroupNow, chatMessageGroupNext, sectionId]);
  const isShowSuggestion = useMemo(() => {
    if (
      isShowDivide &&
      !hasInProcessChatMessageGroup &&
      !chatMessageGroupNext
    ) {
      return true;
    }
    return false;
  }, [
    isShowDivide,
    hasInProcessChatMessageGroup,
    chatMessageGroupNext,
    sectionId,
  ]);

  const nextSectionId = chatMessageGroupNext?.sectionId || sectionId;

  if (!isShowDivide) {
    return null;
  }
  return (
    <PrologueChatMessage
      isShowDivide={isShowDivide}
      isShowSuggestion={isShowSuggestion}
      nextSectionId={nextSectionId}
    />
  );
};

const PrologueChatMessage: FC<{
  isShowDivide?: boolean;
  isShowSuggestion?: boolean;
  nextSectionId?: string;
}> = ({ isShowDivide, isShowSuggestion, nextSectionId }) => {
  const prologueChatGroup = useCreatePrologueMessage(nextSectionId);
  const i18n = useI18n();
  return (
    <View>
      {isShowDivide ? (
        <Spacing
          gap={20}
          className={styles['divide-container']}
          verticalCenter
          horizontalCenter
        >
          <View className={styles['divide-line']}></View>
          <Text>{i18n.t('clearContextDivide')}</Text>
          <View className={styles['divide-line']}></View>
        </Spacing>
      ) : null}

      {prologueChatGroup ? (
        <ChatGroup
          chatGroup={prologueChatGroup}
          isShowSuggestion={isShowSuggestion}
        />
      ) : null}
    </View>
  );
};

export const TopPrologueGroup = () => {
  const { isShowOnBoarding, prevHasMore } = useConversationStore(store => ({
    isShowOnBoarding: store.isShowOnBoarding,
    chatMessageGroups: store.chatMessageGroups,
    inProcessChatMessageGroup: store.inProcessChatMessageGroup,
    prevHasMore: store.prevHasMore,
  }));
  if (isShowOnBoarding() || prevHasMore) {
    return null;
  }
  return <PrologueChatMessage isShowDivide={false} isShowSuggestion={false} />;
};
