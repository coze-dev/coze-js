import { FC, memo } from 'react';

import { Spacing } from '@/libs/ui-kit';
import { type ChatMessageGroup } from '@/libs/types';

import { RespMessageList } from '../resp-message-list';
import { QueryMessage } from '../query-message';

import styles from './index.module.less';

export const ChatGroup: FC<{
  chatGroup: ChatMessageGroup;
  isProcessing?: boolean;
  isLastMessage?: boolean;
  isShowSuggestion?: boolean;
}> = memo(
  ({
    chatGroup,
    isProcessing = false,
    isLastMessage = false,
    isShowSuggestion = false,
  }) => (
    <Spacing vertical gap={16} className={styles['chat-group']}>
      {chatGroup.query ? (
        <QueryMessage
          message={chatGroup.query}
          isAWaiting={isProcessing || false}
          hasRespMessage={!!chatGroup.respMessages.length}
          isLastMessage={isLastMessage}
        />
      ) : null}
      <RespMessageList
        messages={chatGroup.respMessages}
        isLastMessage={isLastMessage}
        // 当进行中，同时已经消息有返回了，则认为等待接收消息中
        isAWaiting={isProcessing && !!chatGroup.query?.chat_id}
        isShowSuggestion={isShowSuggestion}
      />
    </Spacing>
  ),
);
