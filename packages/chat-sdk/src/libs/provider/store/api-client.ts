import { create } from 'zustand';

import { logger, MiniCozeApi } from '@/libs/utils';
import type { ApiCreateStoreProps, ApiClientStore } from '@/libs/types';
import { ChatService } from '@/libs/services';
export const createApiClientStore = ({
  auth,
  setting,
  chat,
}: ApiCreateStoreProps) => {
  const { token, onRefreshToken, connectorId = '999' } = auth;
  const {
    apiBaseUrl,
    requestHeader = {},
    onGetCustomChatService,
  } = setting || {};
  const apiClient = new MiniCozeApi({
    token,
    allowPersonalAccessTokenInBrowser: true,
    baseURL: apiBaseUrl,
    axiosOptions: {
      headers: {
        ...requestHeader,
      },
    },
    debug: logger.isDebug(),
    onRefreshToken,
  });
  const chatServiceProps = {
    apiClient,
    connectorId,
    appId: chat.appId,
    chatType: chat.type,
  };
  const chatService =
    onGetCustomChatService?.(chatServiceProps) ||
    new ChatService(chatServiceProps);
  return create<ApiClientStore>()(_set => ({
    connectorId,
    apiClient,
    chatService,
  }));
};

export type CreateApiClientStore = ReturnType<typeof createApiClientStore>;
