import { create } from "zustand";

import type { ChatInputStore } from "@/libs/types";
import { useMemo } from "react";
const createChatInputStore = () => {
  return create<ChatInputStore>()((set) => ({
    taskList: [],
    setTaskList: (props) => {
      set({
        taskList: props?.taskList || [],
      });
    },
  }));
};

export type CreateChatInputStore = ReturnType<typeof createChatInputStore>;

export const useCreateChatInputStore = () => {
  const chatInputStore = useMemo(() => createChatInputStore(), []);
  return chatInputStore;
};
