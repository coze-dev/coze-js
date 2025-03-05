import cls from 'classnames';
import { View } from '@tarojs/components';

import { logger, nanoid } from '@/libs/utils';
import { Spacing } from '@/libs/ui-kit';
import { UIEventType, type ChatFrameworkProps } from '@/libs/types';
import { useChatInit } from '@/libs/services';
import {
  ChatFrameProvider,
  useChatInfoStore,
  useChatPropsStore,
  useInitBgInfo,
  useIsMobile,
  useThemeType,
} from '@/libs/provider';

import { useWebKeyboardHandle } from './hooks/use-web-keyboard-handle';
import { ChatToast } from '../chat-toast';
import { ChatSlot } from '../chat-slot';
import { ChatModal } from '../chat-modal';
import { ChatLoading } from '../chat-loading';
import { ChatHeader } from '../chat-header';
import { ChatFooter } from '../chat-footer';
import { ChatBackground } from '../chat-background';

import '../../../ui-kit/token/index.css';
import styles from './index.module.less';

import { ChatError } from '../chat-error';

import { FC, PropsWithChildren, ReactNode, useEffect, useMemo } from 'react';

import { eventCenter } from '@tarojs/taro';

const ChatFrameInit: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading, error } = useChatInfoStore(store => ({
    isLoading: store.isLoading,
    error: store.error,
  }));

  logger.info('in chat frame init', { isLoading, error });
  const { retryChatInit } = useChatInit();

  if (error) {
    return <ChatError retryChatInit={retryChatInit} />;
  }
  if (isLoading) {
    return <ChatLoading />;
  }
  return <>{children}</>;
};

let frameId = 1000;
export const ChatContent = ({ children }: { children?: ReactNode }) => {
  const bgInfo = useInitBgInfo();
  const chatFrameId = useMemo(() => `chat_frame_${nanoid()}_${frameId++}`, []);
  const isMobile = useIsMobile();
  const themeType = useThemeType();
  const onThemeChange = useChatPropsStore(
    store => store.eventCallbacks?.onThemeChange,
  );
  const frameworkClassName = useChatPropsStore(
    store => store.ui?.frameworkClassName,
  );
  const isBgTheme = themeType === 'bg-theme';
  useWebKeyboardHandle(chatFrameId);
  useEffect(() => {
    onThemeChange?.(themeType);
  }, [themeType]);
  return (
    <Spacing
      vertical
      className={cls(
        styles.container,
        'light-theme chat-root',
        {
          'bg-theme': isBgTheme,
          'bg-mobile': isMobile,
        },
        frameworkClassName,
      )}
      onClick={() => {
        eventCenter.trigger(UIEventType.FrameClick);
      }}
      id={chatFrameId}
    >
      {isBgTheme ? <ChatBackground {...bgInfo} /> : null}
      <ChatHeader />
      <View className={styles.chat}>
        <ChatFrameInit>{children || <ChatSlot />}</ChatFrameInit>
      </View>
      <ChatFooter />
      <ChatToast />
      <ChatModal />
    </Spacing>
  );
};

export const ChatFramework = ({ children, ...props }: ChatFrameworkProps) => {
  logger.info('SdkVersion: 0.1.10-beta.1');
  return (
    <ChatFrameProvider {...props}>
      <ChatContent>{children}</ChatContent>
    </ChatFrameProvider>
  );
};
