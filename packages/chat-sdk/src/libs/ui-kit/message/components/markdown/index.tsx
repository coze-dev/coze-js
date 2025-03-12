import { FC, useMemo, useState } from 'react';

import cls from 'classnames';

import { logger } from '@/libs/utils';
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
  taskDisabled?: boolean;
}> = ({
  content,
  isComplete = true,
  onImageClick,
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

  return (
    <MdStream
      className={className}
      markdown={content}
      isSmooth={isSmooth}
      isFinish={isComplete}
      onMarkdownEnd={onMarkdownEnd}
      enableHtmlTags={true}
      theme="light"
      onImageClick={onImageClick}
      onTaskChange={onTaskChange}
      taskDisabled={taskDisabled}
      language={i18n.language as Language}
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
  onTaskChange?: IOnTaskListChange;
  taskDisabled?: boolean;
}> = ({
  reasoningContent,
  content,
  isComplete = true,
  className,
  onImageClick,
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
          {...{ onImageClick }}
          taskDisabled={true}
          className={styles.reason}
          isComplete={isComplete || !!content}
          content={reasonMessage}
        />
      ) : null}
      {!reasonMessage || content ? (
        <MarkdownContent
          {...{ isComplete, onImageClick, onTaskChange, taskDisabled }}
          content={content}
        />
      ) : null}
    </Bubble>
  );
};
