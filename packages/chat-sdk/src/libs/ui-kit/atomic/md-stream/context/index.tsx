import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  CSSProperties,
} from 'react';

import { Logger } from '@/libs/utils';
import { ElementEventCallbacks } from '@/libs/types/base/event-callback';
import type { IOnImageClickEvent } from '@/libs/types';
import { I18n } from '@/libs/i18n';
import { usePersistCallback } from '@/libs/hooks';

import { TaskValue } from '../ast';
interface MdStreamContext {
  onImageClick?: IOnImageClickEvent;
  i18n?: I18n;
  logger?: Logger;
  selectable?: boolean;
  taskDisabled?: boolean;
  imgClassName?: string;
  imgStyle?: CSSProperties;
  enableCodeBy4Space?: boolean;
  enableHtmlTags?: boolean;
  getMarkdown?: () => string;
  onTaskChangeHandle?: (taskValue: TaskValue) => void;
  eventCallbacks?: ElementEventCallbacks;
}

const MdStreamPropsContext = createContext<MdStreamContext>({});

export const ChatFamePropsProvider: FC<
  PropsWithChildren<MdStreamContext> & { markdown?: string }
> = ({
  markdown,
  children,
  onImageClick,
  i18n,
  logger,
  selectable,
  taskDisabled,
  enableHtmlTags,
  enableCodeBy4Space,
  onTaskChangeHandle,
  eventCallbacks,
  imgClassName,
  imgStyle,
}) => {
  const getMarkdown = usePersistCallback(() => markdown || '');
  const value = useMemo(
    () => ({
      onImageClick,
      i18n,
      logger,
      selectable,
      taskDisabled,
      enableHtmlTags,
      enableCodeBy4Space,
      onTaskChangeHandle,
      getMarkdown,
      eventCallbacks,
      imgClassName,
      imgStyle,
    }),
    [
      onImageClick,
      i18n,
      logger,
      selectable,
      taskDisabled,
      enableHtmlTags,
      enableCodeBy4Space,
      onTaskChangeHandle,
      getMarkdown,
      eventCallbacks,
      imgClassName,
      imgStyle,
    ],
  );
  return (
    <MdStreamPropsContext.Provider value={value}>
      {children}
    </MdStreamPropsContext.Provider>
  );
};
export const useMdStreamContext = () => useContext(MdStreamPropsContext);
export const useMdStreamI18n = () => {
  const context = useMdStreamContext();
  const { i18n } = context || {};
  return i18n;
};

export const useMdStreamLogger = () => {
  const context = useMdStreamContext();
  const { logger } = context || {};
  return logger;
};

export const useMdStreamSelectable = () => {
  const context = useMdStreamContext();
  const { selectable } = context || {};
  return selectable;
};

export const useMdStreamTaskDisabled = () => {
  const context = useMdStreamContext();
  const { taskDisabled } = context || {};
  return taskDisabled;
};

export const useMdStreamTaskChangeHandle = () => {
  const context = useMdStreamContext();
  const { onTaskChangeHandle } = context || {};
  return onTaskChangeHandle;
};

export const useMdStreamEnableHtmlTags = () => {
  const context = useMdStreamContext();
  const { enableHtmlTags } = context || {};
  return enableHtmlTags;
};

export const useMdStreamEnableCodeBy4Space = () => {
  const context = useMdStreamContext();
  const { enableCodeBy4Space } = context || {};
  return enableCodeBy4Space;
};

export const useMdStreamGetMarkdown = () => {
  const context = useMdStreamContext();
  const { getMarkdown } = context || {};
  return getMarkdown?.() || '';
};
