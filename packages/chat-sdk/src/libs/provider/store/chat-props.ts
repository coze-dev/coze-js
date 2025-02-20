import { useMemo } from 'react';

import { create } from 'zustand';

import { logger } from '@/libs/utils';
import type { ChatFrameworkProps, ChatPropsStore } from '@/libs/types';
import { useUpdateEffect } from '@/libs/hooks';

import { useChatPropsContext } from '../context';
const createChatPropsStore = (props: ChatFrameworkProps) => {
  logger.debug('createChatPropsStore', props);
  return create<ChatPropsStore>()(set => ({
    ...props,
    setChatProps: chatProps => {
      set({
        ...chatProps,
      });
    },
  }));
};

export type CreateChatPropsStore = ReturnType<typeof createChatPropsStore>;

export const useCreateChatPropsStore = () => {
  const chatProps = useChatPropsContext();
  const chatPropsStore = useMemo(() => createChatPropsStore(chatProps), []);
  useUpdateEffect(() => {
    chatPropsStore.getState().setChatProps(chatProps);
    logger.debug('useCreateChatPropsStore props Change', chatProps);
  }, [chatProps]);
  return chatPropsStore;
};
