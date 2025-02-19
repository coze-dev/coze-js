import { View } from "@tarojs/components";

import { OnBoarding } from "@/libs/ui-kit";
import { useSendMessage } from "@/libs/services";
import {
  useChatInfoStore,
  useChatMaxWidth,
  useChatPropsStore,
  useConversationStore,
  useUserInfoStore,
} from "@/libs/provider";
import { ChatScrollView } from "../chat-scroll-view";
import { ChatInput } from "../chat-input";
import { ChatGroupList } from "../chat-group-list";
import cls from "classnames";
import styles from "./index.module.less";
import { FC, memo, useMemo } from "react";
import { logger } from "@/libs/utils";

const ChatOnBoarding = memo(() => {
  const { chatInfo } = useChatInfoStore((store) => ({
    chatInfo: store.info,
  }));
  const onImageClick = useChatPropsStore(
    (store) => store.eventCallbacks?.onImageClick
  );
  const { sendTextMessage } = useSendMessage();
  const userInfo = useUserInfoStore((store) => store.info);
  const { isShowOnBoarding } = useConversationStore((store) => ({
    isShowOnBoarding: store.isShowOnBoarding,
    chatMessageGroups: store.chatMessageGroups,
    inProcessChatMessageGroup: store.inProcessChatMessageGroup,
  }));
  logger.debug("ChatOnBoarding:", chatInfo, isShowOnBoarding());
  if (!isShowOnBoarding()) {
    return null;
  }
  return (
    <OnBoarding
      user={userInfo || undefined}
      chat={chatInfo || undefined}
      onImageClick={onImageClick}
      onClickSuggestion={(message) => {
        sendTextMessage?.(message);
      }}
    />
  );
});

export const ChatSlot: FC<{
  className?: string;
}> = memo(({ className }) => {
  const maxWidth = useChatMaxWidth();
  const chatSlotClassName = useChatPropsStore(
    (store) => store.ui?.chatSlotClassName
  );
  logger.debug("ChatSlot maxWidth", maxWidth);
  const chatContent = useMemo(() => {
    //防止每次刷新ChatScrollView
    return (
      <>
        <ChatOnBoarding />
        <ChatGroupList />
      </>
    );
  }, []);
  return (
    <View
      className={cls(styles.slot, chatSlotClassName, className)}
      style={{
        maxWidth: maxWidth,
      }}
    >
      <ChatScrollView>{chatContent}</ChatScrollView>
      <ChatInput />
    </View>
  );
});
