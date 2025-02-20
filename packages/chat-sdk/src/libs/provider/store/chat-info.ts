import { useMemo } from 'react';

import { create } from 'zustand';

import { logger, MiniChatError } from '@/libs/utils';
import type { ChatInfoStore, ChatInfo } from '@/libs/types';
import { useUpdateEffect } from '@/libs/hooks';

import { useChatPropsContext } from '../context';
const getCustomChatInfo = (chat: ChatInfo): Partial<ChatInfo> =>
  Object.fromEntries(
    Object.entries({
      name: chat.name,
      description: chat.description,
      icon_url: chat.icon_url,
      onboarding_info: chat.onboarding_info,
      bgInfo: chat.bgInfo,
      voiceInfo: chat.voiceInfo,
      suggestPromoteInfo: chat.suggestPromoteInfo,
    }).filter(([_, value]) => !!value),
  );

const combineChatInfo = (
  chatInfoFromInit: ChatInfo,
  customChatInfo: Partial<ChatInfo>,
) => {
  const customSuggestionList =
    customChatInfo.onboarding_info?.suggested_questions?.filter(
      item => !!item,
    ) || [];
  return {
    ...chatInfoFromInit,
    ...customChatInfo,
    onboarding_info: {
      display_all_suggestions:
        customChatInfo.onboarding_info?.display_all_suggestions ??
        chatInfoFromInit.onboarding_info?.display_all_suggestions,
      prologue: customChatInfo.onboarding_info?.prologue
        ? customChatInfo.onboarding_info?.prologue
        : chatInfoFromInit.onboarding_info?.prologue,
      suggested_questions: (customSuggestionList?.length
        ? customSuggestionList
        : chatInfoFromInit.onboarding_info?.suggested_questions
      )?.filter(item => !!item),
    },
  };
};
const createChatInfoStore = ({ chat }: { chat: ChatInfo }) => {
  // If the chat's parameter(name, description, icon_url, onboarding_info) is not empty, then use it to set the chat info
  let customChatInfo = getCustomChatInfo(chat);
  let chatInfoFromInit: ChatInfo | undefined;
  return create<ChatInfoStore>()(set => ({
    id: chat.appId,
    type: chat.type,
    info: null,
    isLoading: true,
    error: null,
    setIsLoading: (isLoading: boolean) => {
      set({
        isLoading,
        error: null,
      });
    },
    // 设置系统配置的数据
    setChatInfo: (info: ChatInfo) => {
      chatInfoFromInit = info;
      logger.debug('setChatInfo', { initInfo: info, customChatInfo });
      set({
        error: null,
        isLoading: false,
        info: combineChatInfo(chatInfoFromInit, customChatInfo),
      });
    },
    // 设置自定义参数
    setCustomChatInfo: (info: ChatInfo) => {
      customChatInfo = getCustomChatInfo(info);
      if (!chatInfoFromInit) {
        return;
      }
      logger.debug('setCustomChatInfo', {
        oldInfo: chatInfoFromInit,
        customChatInfo,
      });
      set({
        info: combineChatInfo(chatInfoFromInit, customChatInfo),
      });
    },
    setError: (error: MiniChatError | null) => {
      set({
        isLoading: false,
        error,
      });
    },
  }));
};

export type CreateChatInfoStore = ReturnType<typeof createChatInfoStore>;

export const useCreateChatInfoStore = () => {
  const chatProps = useChatPropsContext();
  const chatInfoStore = useMemo(
    () => createChatInfoStore({ chat: chatProps.chat }),
    [],
  );
  useUpdateEffect(() => {
    logger.debug('useCreateChatInfoStore update chat props: ', chatProps.chat);
    chatInfoStore.getState().setCustomChatInfo(chatProps.chat);
  }, [chatProps.chat]);
  return chatInfoStore;
};
