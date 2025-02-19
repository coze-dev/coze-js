import { createContext, useMemo, FC, PropsWithChildren } from "react";
import { logger } from "@/libs/utils";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

import type {
  ApiClientStore,
  ChatInfoStore,
  ConversationStore,
  ChatStatusStore,
  UserInfoStore,
  ChatPropsStore,
  UiEventStore,
  ChatInputStore,
} from "@/libs/types";
import { NullableType, Language } from "@/libs/types";
import {
  createApiClientStore,
  type CreateApiClientStore,
  useCreateChatInfoStore,
  type CreateChatInfoStore,
  useCreateConversationStore,
  type CreateConversationStore,
  useCreateStatusStore,
  type CreateChatStatusStore,
  useCreateUserInfoStore,
  type CreateUserInfoStore,
  useCreateChatPropsStore,
  type CreateChatPropsStore,
  useCreateUiEventStore,
  type CreateUiEventStore,
  useCreateChatInputStore,
  type CreateChatInputStore,
} from "@/libs/provider/store";
import { I18n as I18nLocal } from "@/libs/i18n";
import { useValidContext } from "@/libs/hooks";

import { useChatPropsContext } from "./chat-frame-props-context";

/**** Begin store的定义位置 */
enum StoreType {
  ApiClientStore,
  ChatInfoStore,
  ConversationStore,
  ChatStatusStore,
  UserInfoStore,
  I18n,
  ChatPropsStore,
  UiEvent,
  ChatInputStore,
}

interface StoreContextInter {
  [StoreType.ApiClientStore]: CreateApiClientStore;
  [StoreType.ChatInfoStore]: CreateChatInfoStore;
  [StoreType.ConversationStore]: CreateConversationStore;
  [StoreType.ChatStatusStore]: CreateChatStatusStore;
  [StoreType.UserInfoStore]: CreateUserInfoStore;
  [StoreType.I18n]: I18nLocal;
  [StoreType.ChatPropsStore]: CreateChatPropsStore;
  [StoreType.UiEvent]: CreateUiEventStore;
  [StoreType.ChatInputStore]: CreateChatInputStore;
}

const ChatStoreContext = createContext<NullableType<StoreContextInter>>({
  [StoreType.ApiClientStore]: null,
  [StoreType.ChatInfoStore]: null,
  [StoreType.ConversationStore]: null,
  [StoreType.ChatStatusStore]: null,
  [StoreType.UserInfoStore]: null,
  [StoreType.I18n]: null,
  [StoreType.ChatPropsStore]: null,
  [StoreType.UiEvent]: null,
  [StoreType.ChatInputStore]: null,
});

/*** End store的定义位置 */
export const ChatPropsProvider = ChatStoreContext.Provider;

export const ChatStoreProvider: FC<PropsWithChildren> = ({ children }) => {
  const chatProps = useChatPropsContext();
  const { auth, chat, setting } = chatProps;
  logger.setLoglevel(setting?.logLevel);
  const apiClientStore = useMemo(
    () => createApiClientStore({ auth, setting, chat }),
    []
  );
  const chatInfoStore = useCreateChatInfoStore();
  const conversationStore = useCreateConversationStore();
  const chatStatusStore = useCreateStatusStore();
  const userInfoStore = useCreateUserInfoStore();
  const chatPropsStore = useCreateChatPropsStore();
  const uiEventStore = useCreateUiEventStore();
  const chatInputStore = useCreateChatInputStore();
  const i18nLocal = useMemo(
    () => setting?.i18n || new I18nLocal(setting?.language || Language.ZH_CN),
    []
  );
  const storeMap = useMemo(() => {
    return {
      [StoreType.ApiClientStore]: apiClientStore,
      [StoreType.ChatInfoStore]: chatInfoStore,
      [StoreType.ConversationStore]: conversationStore,
      [StoreType.ChatStatusStore]: chatStatusStore,
      [StoreType.UserInfoStore]: userInfoStore,
      [StoreType.I18n]: i18nLocal,
      [StoreType.ChatPropsStore]: chatPropsStore,
      [StoreType.UiEvent]: uiEventStore,
      [StoreType.ChatInputStore]: chatInputStore,
    };
  }, []);
  logger.debug("ChatFramework props:", chatProps);
  return (
    <ChatStoreContext.Provider value={storeMap}>
      {children}
    </ChatStoreContext.Provider>
  );
};
const useChatStoreContext = () => useValidContext(ChatStoreContext);

export const useApiClientStore: <T>(
  selector: (store: ApiClientStore) => T
) => T = (selector) => {
  const store = useChatStoreContext();
  return useStoreWithEqualityFn(
    store[StoreType.ApiClientStore],
    selector,
    shallow
  );
};

export const useChatInfoStore: <T>(
  selector: (store: ChatInfoStore) => T
) => T = (selector) => {
  const store = useChatStoreContext();
  return useStoreWithEqualityFn(
    store[StoreType.ChatInfoStore],
    selector,
    shallow
  );
};

export const useConversationStore: <T>(
  selector: (store: ConversationStore) => T
) => T = (selector) => {
  const store = useChatStoreContext();
  return useStoreWithEqualityFn(
    store[StoreType.ConversationStore],
    selector,
    shallow
  );
};

export const useChatStatusStore: <T>(
  selector: (store: ChatStatusStore) => T
) => T = (selector) => {
  const store = useChatStoreContext();
  return useStoreWithEqualityFn(
    store[StoreType.ChatStatusStore],
    selector,
    shallow
  );
};

export const useUserInfoStore: <T>(
  selector: (store: UserInfoStore) => T
) => T = (selector) => {
  const store = useChatStoreContext();
  return useStoreWithEqualityFn(
    store[StoreType.UserInfoStore],
    selector,
    shallow
  );
};

export const useI18n = () => {
  const store = useChatStoreContext();
  return store[StoreType.I18n];
};

export const useChatPropsStore: <T>(
  selector: (store: ChatPropsStore) => T
) => T = (selector) => {
  const store = useChatStoreContext();
  return useStoreWithEqualityFn(
    store[StoreType.ChatPropsStore],
    selector,
    shallow
  );
};

export const useUiEventStore: <T>(selector: (store: UiEventStore) => T) => T = (
  selector
) => {
  const store = useChatStoreContext();
  return useStoreWithEqualityFn(store[StoreType.UiEvent], selector, shallow);
};

export const useChatInputStore: <T>(
  selector: (store: ChatInputStore) => T
) => T = (selector) => {
  const store = useChatStoreContext();
  return useStoreWithEqualityFn(
    store[StoreType.ChatInputStore],
    selector,
    shallow
  );
};
