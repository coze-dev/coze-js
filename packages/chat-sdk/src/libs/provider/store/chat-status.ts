import { create } from "zustand";

import type { ChatStatusStore } from "@/libs/types";
import { useChatPropsContext } from "../context";
import { useMemo } from "react";
import { useUpdateEffect } from "@/libs/hooks";

const createChatStatusStore = ({ isReadonly }: { isReadonly?: boolean }) =>
  create<ChatStatusStore>()((set, get) => {
    const wrapStateFunc =
      <T extends (...args) => unknown>(func: T) =>
      (...args: Parameters<T>) => {
        const result = func(...args);
        get().setOpDisabledState();
        return result;
      };
    return {
      isReadonly: isReadonly || false,
      isDeleting: false,
      isSendingMsg: false,
      isClearingContext: false,
      isAudioRecording: false,
      disableState: {
        clearMessage: isReadonly || false,
        clearContext: isReadonly || false,
        input: isReadonly || false,
      },
      setIsReadonly: wrapStateFunc((isReadonly: boolean) => {
        set({
          isReadonly,
        });
      }),
      setIsAudioRecording: wrapStateFunc((isAudioRecording: boolean) => {
        set({
          isAudioRecording,
        });
      }),
      setIsDeleting: wrapStateFunc((isDeleting: boolean) => {
        set({
          isDeleting,
        });
      }),
      setIsSendingMsg: wrapStateFunc((isSendingMsg: boolean) => {
        set({
          isSendingMsg,
        });
      }),
      setIsClearingContext: wrapStateFunc((isClearingContext: boolean) => {
        set({
          isClearingContext,
        });
      }),

      setOpDisabledState: () => {
        set({
          disableState: get().getOpDisabledState(),
        });
      },
      getOpDisabledState: () => {
        const { isDeleting, isSendingMsg, isClearingContext, isReadonly } =
          get();
        const isInteracting = isDeleting || isSendingMsg || isClearingContext;
        return {
          clearMessage: isReadonly || isInteracting,
          input: isReadonly || isInteracting,
          clearContext: isReadonly || isInteracting,
        };
      },
    };
  });

export type CreateChatStatusStore = ReturnType<typeof createChatStatusStore>;

export const useCreateStatusStore = () => {
  const chatProps = useChatPropsContext();
  const chatStatusStore = useMemo(
    () => createChatStatusStore({ isReadonly: chatProps.ui?.isReadonly }),
    []
  );
  useUpdateEffect(() => {
    chatStatusStore.getState().setIsReadonly(!!chatProps.ui?.isReadonly);
  }, [chatProps.ui?.isReadonly]);
  return chatStatusStore;
};
