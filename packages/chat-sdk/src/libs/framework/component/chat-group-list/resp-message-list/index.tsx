import { FC, useMemo } from 'react';

import { getCdnUrl, logger } from '@/libs/utils';
import {
  Spacing,
  MessageContent,
  WaitingMessage,
  isSupportAnswerMessage,
  MessageContainer,
} from '@/libs/ui-kit';
import {
  ChatMessage,
  ChatMessageGroup,
  IOnTaskListChange,
  IOnTaskListChangeProps,
} from '@/libs/types';
import { useSendMessage } from '@/libs/services';
import { useChatInputStore } from '@/libs/provider/context';
import {
  useChatInfoStore,
  useChatPropsStore,
  useI18n,
  useIsNeedTextToAudio,
  useThemeType,
} from '@/libs/provider';
import { usePersistCallback } from '@/libs/hooks';

import { SuggestionList } from '../suggestion-list';
import { CommandCopy } from '../command/command-copy';
import { CommandAudio } from '../command/command-audio';
import { CommandTooltip } from '../command/comman-tooltip';

import styles from './index.module.less';
export const RespMessageList: FC<{
  messages: ChatMessage[];
  isAWaiting: boolean;
  isShowSuggestion?: boolean;
  isLastMessage?: boolean;
  chatGroup?: ChatMessageGroup;
}> = ({ messages, isAWaiting, isShowSuggestion, isLastMessage, chatGroup }) => {
  const appInfo = useChatInfoStore(info => info.info);
  const cdnBaseUrlPath = useChatPropsStore(
    store => store.setting?.cdnBaseUrlPath,
  );
  const messageUiConfigMap = useChatPropsStore(
    store => store.ui?.chatSlot?.message,
  );
  const messageWrapperConf = useChatPropsStore(
    store => store.ui?.chatSlot?.messageWrapper,
  );
  const answerMessages = useMemo(
    () =>
      messages.filter(item => isSupportAnswerMessage(item, messageUiConfigMap)),
    [messages],
  );

  const followUpMessages = useMemo(
    () =>
      messages
        .filter(item => item.type === 'follow_up' && item.content)
        .slice(0, 3),
    [messages],
  );
  if (
    !isAWaiting &&
    answerMessages.length === 0 &&
    followUpMessages.length === 0
  ) {
    // 兜底
    // 没有回答
    return null;
  }
  return (
    <MessageContainer
      className={styles['resp-container']}
      senderInfo={{
        name: appInfo?.name || '',
        avatar:
          appInfo?.icon_url ||
          getCdnUrl(cdnBaseUrlPath, 'assets/imgs/coze-logo.png'),
        id: appInfo?.appId || '',
      }}
      chatGroup={chatGroup}
      isQuery={false}
      messageWrapperConf={messageWrapperConf}
    >
      <RespMessageListContent
        isAWaiting={isAWaiting}
        isShowSuggestion={isShowSuggestion}
        followUpMessages={followUpMessages}
        answerMessages={answerMessages}
        isLastMessage={isLastMessage}
      />
    </MessageContainer>
  );
};

const RespMessageListContent: FC<{
  answerMessages: ChatMessage[];
  followUpMessages: ChatMessage[];
  isAWaiting: boolean;
  isShowSuggestion?: boolean;
  isLastMessage?: boolean;
}> = ({
  answerMessages,
  followUpMessages,
  isAWaiting,
  isShowSuggestion,
  isLastMessage,
}) => {
  const isNeedTextToAudio = useIsNeedTextToAudio();
  const onImageClick = useChatPropsStore(
    store => store.eventCallbacks?.onImageClick,
  );
  const onLinkClick = useChatPropsStore(
    store => store.eventCallbacks?.onLinkClick,
  );
  const setTaskList = useChatInputStore(store => store.setTaskList);
  const messageUiConfigMap = useChatPropsStore(
    store => store.ui?.chatSlot?.message,
  );
  const i18n = useI18n();
  const themeType = useThemeType();
  const isReadOnly = useChatPropsStore(store => store.ui?.isReadonly);
  const { sendTextMessage } = useSendMessage();
  const onMessageTaskChange: IOnTaskListChange = usePersistCallback(
    (taskInfoProps: IOnTaskListChangeProps) => {
      setTaskList(taskInfoProps);
      logger.debug('RespMessageListContent Task Select', taskInfoProps);
    },
  );

  const svgTheme = themeType === 'light' ? 'dark' : 'light';
  const allText = answerMessages
    .filter(item => item.content_type === 'text')
    .map(item => item.content)
    .join('');
  const isNeedWaitingMessage =
    isAWaiting && !answerMessages.some(item => !item.isComplete);

  if (
    isAWaiting &&
    answerMessages.length === 0 &&
    followUpMessages.length === 0
  ) {
    return <WaitingMessage />;
  }

  return (
    <Spacing className={styles.resp} vertical gap={8}>
      {answerMessages.length > 0 ? (
        <>
          <Spacing vertical className={styles.answer} gap={8}>
            {answerMessages.map((item, index) => (
              <CommandTooltip
                key={item.id || `noId_${index}`}
                message={item}
                isActive={!isLastMessage && !isReadOnly}
              >
                <MessageContent
                  message={item}
                  onImageClick={onImageClick}
                  onLinkClick={onLinkClick}
                  sendTextMessage={sendTextMessage}
                  i18n={i18n}
                  //disabled={!isLastMessage || isReadOnly}
                  isLastMessage={isLastMessage}
                  isReadOnly={isReadOnly}
                  isAWaiting={
                    // 如果是回答的最后一条消息，同时是等待中的消息，则添加一个圆点的等待状态
                    followUpMessages.length === 0 &&
                    answerMessages.length - 1 === index &&
                    isAWaiting &&
                    !item.isComplete
                  }
                  onTaskChange={onMessageTaskChange}
                  messageUiConfigMap={messageUiConfigMap}
                />
              </CommandTooltip>
            ))}
          </Spacing>
          {isLastMessage && !isAWaiting && allText ? (
            <Spacing gap={4} verticalCenter>
              {isNeedTextToAudio ? (
                <CommandAudio
                  text={allText}
                  svgTheme={svgTheme}
                  isNeedHover={svgTheme === 'dark' ? true : false}
                />
              ) : null}
              <CommandCopy
                text={allText}
                svgTheme={svgTheme}
                isNeedHover={svgTheme === 'dark' ? true : false}
              />
            </Spacing>
          ) : null}
        </>
      ) : null}
      {followUpMessages.length > 0 && isShowSuggestion ? (
        <SuggestionList messages={followUpMessages} />
      ) : null}
      {isNeedWaitingMessage ? <WaitingMessage /> : null}
    </Spacing>
  );
};
