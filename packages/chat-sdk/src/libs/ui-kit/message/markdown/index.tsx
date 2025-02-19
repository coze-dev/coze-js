import { FC, useCallback, useMemo, useState } from "react";

import { MdStream } from "../../atomic/md-stream";
import { Bubble } from "../../atomic/bubble";
import cls from "classnames";
import styles from "./index.module.less";
import { IOnImageClickEvent } from "@/libs/types";
import { logger } from "@/libs/utils";
import { useI18n } from "@/libs/provider";

const MarkdownContent: FC<{
  content: string;
  isAWaiting?: boolean; // 后续流式需要使用
  onImageClick?: IOnImageClickEvent;
}> = ({ content, isAWaiting = false, onImageClick }) => {
  const [isSmooth, setIsSmooth] = useState(isAWaiting);
  const i18n = useI18n();
  const onMarkdownEnd = useCallback(() => {
    setIsSmooth(false);
  }, []);
  return (
    <MdStream
      markdown={content}
      isSmooth={isSmooth}
      isFinish={!isAWaiting}
      onMarkdownEnd={onMarkdownEnd}
      theme="light"
      onImageClick={onImageClick}
      language={i18n.language}
      debug={logger.isDebug()}
    />
  );
};

export const MarkdownMessage: FC<{
  reasoningContent?: string;
  content: string;
  isAWaiting?: boolean; // 后续流式需要使用
  className?: string;
  onImageClick?: IOnImageClickEvent;
}> = ({
  content,
  isAWaiting = false,
  className,
  onImageClick,
  reasoningContent,
}) => {
  const reasonMessage = useMemo(() => {
    if (reasoningContent) {
      return reasoningContent.trim().replace(/^/gm, "> ");
    }
    return "";
  }, [reasoningContent]);
  logger.debug("MarkdownMessage", reasoningContent, content);
  return (
    <Bubble isNeedBorder={false} className={cls(styles.markdown, className)}>
      {reasonMessage ? (
        <MarkdownContent
          {...{ onImageClick }}
          isAWaiting={isAWaiting && !content}
          content={reasonMessage}
        />
      ) : null}
      {!reasonMessage || content ? (
        <MarkdownContent {...{ isAWaiting, onImageClick }} content={content} />
      ) : null}
    </Bubble>
  );
};
