import { FC, memo } from 'react';

import cls from 'classnames';
import { View } from '@tarojs/components';

import {
  MessageContent,
  MessageContainer,
  Spinning,
  SvgError,
} from '@/libs/ui-kit';
import { ChatMessage, ChatMessageGroup } from '@/libs/types';
import { useSendMessage } from '@/libs/services';
import { useChatPropsStore, useUserInfoStore } from '@/libs/provider';

import { CommandTooltip } from '../command/comman-tooltip';

import styles from './index.module.less';
export const QueryMessage: FC<{
  message: ChatMessage;
  isAWaiting?: boolean;
  isLastMessage?: boolean;
  hasRespMessage?: boolean;
  chatGroup?: ChatMessageGroup;
}> = memo(
  ({
    message,
    isAWaiting = false,
    hasRespMessage,
    isLastMessage = false,
    chatGroup,
  }) => {
    const userInfo = useUserInfoStore(store => store.info);
    const { reSendLastErrorMessage } = useSendMessage();
    const isShowError = message.error && !hasRespMessage;
    const isShowLoading = !isShowError && isAWaiting && !message.chat_id;
    const { sendTextMessage } = useSendMessage();
    const onImageClick = useChatPropsStore(
      store => store.eventCallbacks?.onImageClick,
    );
    const messageWrapperConf = useChatPropsStore(
      store => store.ui?.chatSlot?.messageWrapper,
    );
    return (
      <MessageContainer
        senderInfo={userInfo || undefined}
        className={styles['query-container']}
        isQuery={true}
        chatGroup={chatGroup}
        messageWrapperConf={messageWrapperConf}
      >
        <View className={styles['query-message']}>
          <CommandTooltip
            message={message}
            isActive={!message.isAudioTranslatingToText}
          >
            <MessageContent
              message={message}
              onImageClick={onImageClick}
              sendTextMessage={sendTextMessage}
            />
          </CommandTooltip>
          {isShowLoading ? (
            <Spinning className={styles['state-slot']} size="small" />
          ) : null}
          {isShowError ? (
            <SvgError
              className={cls(styles['state-slot'], {
                [styles.disable]: !isLastMessage,
              })}
              onClick={() => isLastMessage && reSendLastErrorMessage?.()}
            />
          ) : null}
        </View>
      </MessageContainer>
    );
  },
);
