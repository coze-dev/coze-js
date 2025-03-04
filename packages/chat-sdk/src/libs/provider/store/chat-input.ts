import { useMemo } from 'react';

import { create } from 'zustand';

import { logger } from '@/libs/utils';
import type { ChatInputStore } from '@/libs/types';
const createChatInputStore = () =>
  create<ChatInputStore>()(set => ({
    taskList: [],
    setInputValue: (val: string) => {
      logger.error('setInputValue is not implemented', val);
    },
    initSetInputValueFunc: func => {
      set({
        setInputValue: func,
      });
    },
    setTaskList: props => {
      set({
        taskList: props?.taskList || [],
      });
    },
  }));

export type CreateChatInputStore = ReturnType<typeof createChatInputStore>;

export const useCreateChatInputStore = () => {
  const chatInputStore = useMemo(() => createChatInputStore(), []);
  return chatInputStore;
};
