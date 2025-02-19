import { FC, useMemo } from "react";

import { View, Text } from "@tarojs/components";

import { ChatInfo, IOnImageClickEvent, UserInfo } from "@/libs/types";

import { SuggestionList } from "../suggestion-list";
import { MarkdownMessage } from "../message/components/markdown";
import { ErrorBoundary } from "../atomic/error-boundary";

import styles from "./index.module.less";
import { getCdnUrl, logger } from "@/libs/utils";
import { CImage } from "../atomic/c-image";
import cls from "classnames";
import { useChatPropsStore, useIsMobile } from "@/libs/provider";
interface OnBoardingProps {
  chat?: ChatInfo;
  user?: UserInfo;
  onClickSuggestion?: (text: string) => void;
  onImageClick?: IOnImageClickEvent;
}

export const OnBoarding: FC<OnBoardingProps> = ({
  chat: chatInfo,
  user: userInfo,
  onClickSuggestion,
  onImageClick,
}) => {
  const cdnBaseurlPath = useChatPropsStore(
    (store) => store.setting?.cdnBaseUrlPath
  );
  const prologue = useMemo(() => {
    const formatPrologue = (
      chatInfo?.onboarding_info?.prologue || ""
    ).replaceAll("{{user_name}}", userInfo?.name || "");
    return formatPrologue !== "\n" ? formatPrologue : "";
  }, [chatInfo?.onboarding_info?.prologue]);
  const isVerticalCenter =
    !prologue && !chatInfo?.onboarding_info?.suggested_questions?.length;
  const isMobile = useIsMobile();
  logger.debug("OnBoarding props", prologue, chatInfo);
  return (
    <View
      className={cls(styles.container, {
        [styles["vertical-center"]]: isVerticalCenter,
      })}
    >
      <View className={styles["info-container"]}>
        <CImage
          src={
            chatInfo?.icon_url ||
            getCdnUrl(cdnBaseurlPath, "assets/imgs/coze-logo.png")
          }
          className={styles["app-avatar"]}
          mode="aspectFill"
        />
        <Text
          className={styles["chat-name"]}
          overflow="ellipsis"
          numberOfLines={1}
          maxLines={1}
        >
          {chatInfo?.name || ""}
        </Text>
        <ErrorBoundary fallbackNode={<></>}>
          {prologue ? (
            <MarkdownMessage
              content={prologue}
              isComplete={true}
              className={styles.prologue}
              onImageClick={onImageClick}
            />
          ) : null}
        </ErrorBoundary>
      </View>
      <SuggestionList
        suggestions={chatInfo?.onboarding_info?.suggested_questions || []}
        onClickSuggestion={onClickSuggestion}
        isDisplayAll={chatInfo?.onboarding_info?.display_all_suggestions}
        isVertical={isMobile}
      />
    </View>
  );
};
