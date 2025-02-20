import { useMemo } from 'react';

import { create } from 'zustand';

import type { ChatStatusStore } from '@/libs/types';
import { useUpdateEffect } from '@/libs/hooks';

import { useChatPropsContext } from '../context';

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
      setIsReadonly: wrapStateFunc((isReadonlyNew: boolean) => {
        set({
          isReadonly: isReadonlyNew,
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
        const {
          isDeleting,
          isSendingMsg,
          isClearingContext,
          isReadonly: isReadonlyNew,
        } = get();
        const isInteracting = isDeleting || isSendingMsg || isClearingContext;
        return {
          clearMessage: isReadonlyNew || isInteracting,
          input: isReadonlyNew || isInteracting,
          clearContext: isReadonlyNew || isInteracting,
        };
      },
    };
  });

export type CreateChatStatusStore = ReturnType<typeof createChatStatusStore>;

export const useCreateStatusStore = () => {
  const chatProps = useChatPropsContext();
  const chatStatusStore = useMemo(
    () => createChatStatusStore({ isReadonly: chatProps.ui?.isReadonly }),
    [],
  );
  useUpdateEffect(() => {
    chatStatusStore.getState().setIsReadonly(!!chatProps.ui?.isReadonly);
  }, [chatProps.ui?.isReadonly]);
  return chatStatusStore;
};
