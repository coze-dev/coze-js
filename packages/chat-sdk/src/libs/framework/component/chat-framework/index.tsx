import { UIEventType, type ChatFrameworkProps } from "@/libs/types";
import { useChatInit } from "@/libs/services";
import {
  ChatFrameProvider,
  useChatInfoStore,
  useChatPropsStore,
  useInitBgInfo,
  useIsMobile,
  useThemeType,
} from "@/libs/provider";
import { ChatBackground } from "../chat-background";
import cls from "classnames";
import { ChatSlot } from "../chat-slot";
import { ChatLoading } from "../chat-loading";
import { Spacing } from "@/libs/ui-kit";
import { ChatFooter } from "../chat-footer";
import { ChatHeader } from "../chat-header";
import { View } from "@tarojs/components";
import { ChatToast } from "../chat-toast";
import { ChatModal } from "../chat-modal";
import "../../../ui-kit/token/index.css";
import styles from "./index.module.less";
import { logger } from "@/libs/utils";
import { ChatError } from "../chat-error";
import { ReactNode, useEffect, useMemo } from "react";
import { eventCenter } from "@tarojs/taro";
import { useWebKeyboardHandle } from "./hooks/use-web-keyboard-handle";

const ChatFrameInit = ({ children }) => {
  const { isLoading, error } = useChatInfoStore((store) => ({
    isLoading: store.isLoading,
    error: store.error,
  }));

  logger.info("in chat frame init", { isLoading, error });
  const { retryChatInit } = useChatInit();

  if (error) {
    return <ChatError retryChatInit={retryChatInit} />;
  }
  if (isLoading) {
    return <ChatLoading />;
  }
  return <>{children}</>;
};

let frameId = 1000;
export const ChatContent = ({ children }: { children?: ReactNode }) => {
  const bgInfo = useInitBgInfo();
  const chatFrameId = useMemo(() => `chat_frame_${frameId++}`, []);
  const isMobile = useIsMobile();
  const themeType = useThemeType();
  const onThemeChange = useChatPropsStore(
    (store) => store.eventCallbacks?.onThemeChange
  );
  const frameworkClassName = useChatPropsStore(
    (store) => store.ui?.frameworkClassName
  );
  const isBgTheme = themeType === "bg-theme";
  useWebKeyboardHandle(chatFrameId);
  useEffect(() => {
    onThemeChange?.(themeType);
  }, [themeType]);
  return (
    <Spacing
      vertical
      className={cls(
        styles.container,
        "light-theme chat-root",
        {
          "bg-theme": isBgTheme,
          "bg-mobile": isMobile,
        },
        frameworkClassName
      )}
      onClick={() => {
        eventCenter.trigger(UIEventType.FrameClick);
      }}
      id={chatFrameId}
    >
      {isBgTheme ? <ChatBackground {...bgInfo} /> : null}
      <ChatHeader />
      <View className={styles.chat}>
        <ChatFrameInit>{children || <ChatSlot />}</ChatFrameInit>
      </View>
      <ChatFooter />
      <ChatToast />
      <ChatModal />
    </Spacing>
  );
};

export const ChatFramework = ({ children, ...props }: ChatFrameworkProps) => {
  logger.info("SdkVersion: 0.1.3-alpha.2025021406");
  return (
    <ChatFrameProvider {...props}>
      <ChatContent>{children}</ChatContent>
    </ChatFrameProvider>
  );
};
