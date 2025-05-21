import { FC, useMemo, useState } from 'react';

import cls from 'classnames';
import { ITouchEvent } from '@tarojs/components';

import { logger } from '@/libs/utils';
import { LinkEventData } from '@/libs/types/base/event-callback';
import { IOnImageClickEvent, IOnTaskListChange, Language } from '@/libs/types';
import { useI18n } from '@/libs/provider';
import { usePersistCallback, useUpdateEffect } from '@/libs/hooks';

import { MdStream } from '../../../atomic/md-stream';
import { Bubble } from '../../../atomic/bubble';

import styles from './index.module.less';

const MarkdownContent: FC<{
  content: string;
  className?: string;
  isComplete?: boolean; // 是否消息结束
  onImageClick?: IOnImageClickEvent;
  onTaskChange?: IOnTaskListChange;
  onLinkClick?: (url: string) => void;
  taskDisabled?: boolean;
}> = ({
  content,
  isComplete = true,
  onImageClick,
  onLinkClick,
  taskDisabled,
  onTaskChange,
  className,
}) => {
  const [isSmooth, setIsSmooth] = useState(!isComplete);
  const i18n = useI18n();
  const onMarkdownEnd = usePersistCallback(() => {
    if (isSmooth !== false) {
      setIsSmooth(false);
    }
  });
  useUpdateEffect(() => {
    onMarkdownEnd();
  }, [isComplete]);
  const markdownEventCallback = useMemo(
    () => ({
      onLinkClick: onLinkClick
        ? (_e: ITouchEvent, data: LinkEventData) => {
            onLinkClick?.(data?.url);
          }
        : undefined,
    }),
    [onLinkClick],
  );

  return (
    <MdStream
      className={className}
      markdown={content}
      isSmooth={isSmooth}
      isFinish={isComplete}
      onMarkdownEnd={onMarkdownEnd}
      theme="light"
      onImageClick={onImageClick}
      onTaskChange={onTaskChange}
      taskDisabled={taskDisabled}
      language={i18n.language as Language}
      eventCallbacks={markdownEventCallback}
      debug={logger.isDebug()}
    />
  );
};

export const MarkdownMessage: FC<{
  content: string;
  reasoningContent?: string;
  isComplete?: boolean; // 是否消息结束
  className?: string;
  onImageClick?: IOnImageClickEvent;
  onLinkClick?: (url: string) => void;
  onTaskChange?: IOnTaskListChange;
  taskDisabled?: boolean;
}> = ({
  reasoningContent,
  content,
  isComplete = true,
  className,
  onImageClick,
  onLinkClick,
  taskDisabled,
  onTaskChange,
}) => {
  const reasonMessage = useMemo(() => {
    if (reasoningContent) {
      return reasoningContent.trim().replace(/^/gm, '> ');
    }
    return '';
  }, [reasoningContent]);

  return (
    <Bubble isNeedBorder={false} className={cls(styles.markdown, className)}>
      {reasonMessage ? (
        <MarkdownContent
          {...{ onImageClick, onLinkClick }}
          taskDisabled={true}
          className={styles.reason}
          isComplete={isComplete || !!content}
          content={reasonMessage}
        />
      ) : null}
      {!reasonMessage || content ? (
        <MarkdownContent
          {...{
            isComplete,
            onImageClick,
            onLinkClick,
            onTaskChange,
            taskDisabled,
          }}
          content={content}
        />
      ) : null}
    </Bubble>
  );
};
