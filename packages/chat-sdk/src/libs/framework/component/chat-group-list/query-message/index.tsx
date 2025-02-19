import { FC, memo } from "react";

import { View } from "@tarojs/components";

import {
  MessageContent,
  MessageContainer,
  Spinning,
  SvgError,
} from "@/libs/ui-kit";

import cls from "classnames";
import styles from "./index.module.less";
import { useChatPropsStore, useUserInfoStore } from "@/libs/provider";
import { ChatMessage } from "@/libs/types";
import { useSendMessage } from "@/libs/services";
import { CommandTooltip } from "../command/comman-tooltip";
export const QueryMessage: FC<{
  message: ChatMessage;
  isAWaiting?: boolean;
  isLastMessage?: boolean;
  hasRespMessage?: boolean;
}> = memo(
  ({ message, isAWaiting = false, hasRespMessage, isLastMessage = false }) => {
    const userInfo = useUserInfoStore((store) => store.info);
    const { reSendLastErrorMessage } = useSendMessage();
    const isShowError = message.error && !hasRespMessage;
    const isShowLoading = !isShowError && isAWaiting && !message.chat_id;
    const { sendTextMessage } = useSendMessage();
    const onImageClick = useChatPropsStore((store) => {
      return store.eventCallbacks?.onImageClick;
    });
    return (
      <MessageContainer
        senderInfo={userInfo || undefined}
        className={styles["query-container"]}
      >
        <View className={styles["query-message"]}>
          <CommandTooltip
            message={message}
            isActive={!message.isAudioTranslatingToText}
          >
            <MessageContent
              message={message}
              onImageClick={onImageClick}
              sendTextMessage={sendTextMessage}
            />
          </CommandTooltip>
          {isShowLoading ? (
            <Spinning className={styles["state-slot"]} size="small" />
          ) : null}
          {isShowError ? (
            <SvgError
              className={cls(styles["state-slot"], {
                [styles.disable]: !isLastMessage,
              })}
              onClick={() => isLastMessage && reSendLastErrorMessage?.()}
            />
          ) : null}
        </View>
      </MessageContainer>
    );
  }
);
