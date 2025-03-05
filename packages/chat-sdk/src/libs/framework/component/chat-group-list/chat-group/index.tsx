import { FC, memo } from 'react';

import cls from 'classnames';

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
    <Spacing
      vertical
      gap={16}
      className={cls(styles['chat-group'], 'chat-group-for-query')}
      data-groupId={chatGroup.id}
    >
      {chatGroup.query ? (
        <QueryMessage
          message={chatGroup.query}
          isAWaiting={isProcessing || false}
          hasRespMessage={!!chatGroup.respMessages.length}
          isLastMessage={isLastMessage}
          chatGroup={chatGroup}
        />
      ) : null}
      <RespMessageList
        messages={chatGroup.respMessages}
        isLastMessage={isLastMessage}
        // 当进行中，同时已经消息有返回了，则认为等待接收消息中
        isAWaiting={isProcessing && !!chatGroup.query?.chat_id}
        isShowSuggestion={isShowSuggestion}
        chatGroup={chatGroup}
      />
    </Spacing>
  ),
);
