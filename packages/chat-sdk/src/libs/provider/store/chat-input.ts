import { useMemo } from 'react';

import { create } from 'zustand';

import type { ChatInputStore } from '@/libs/types';
const createChatInputStore = () =>
  create<ChatInputStore>()(set => ({
    taskList: [],
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
