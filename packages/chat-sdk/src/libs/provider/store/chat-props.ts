import { create } from "zustand";

import { logger } from "@/libs/utils";
import type { ChatFrameworkProps, ChatPropsStore } from "@/libs/types";
import { useChatPropsContext } from "../context";
import { useMemo } from "react";
import { useUpdateEffect } from "@/libs/hooks";
const createChatPropsStore = (props: ChatFrameworkProps) => {
  logger.debug("createChatPropsStore", props);
  return create<ChatPropsStore>()((set) => ({
    ...props,
    setChatProps: (props) => {
      set({
        ...props,
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
    logger.debug("useCreateChatPropsStore props Change", chatProps);
  }, [chatProps]);
  return chatPropsStore;
};
