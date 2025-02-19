import { FC, memo, PropsWithChildren, useMemo, useRef } from "react";
import type { Root as RootMdType } from "mdast";
import {
  Language,
  type IOnImageClickEvent,
  type IOnTaskListChange,
} from "@/libs/types";

import { Root } from "./render/root";
import { useSmoothShowMarkdown } from "./hooks/use-smooth-show-markdown";
import { useSmoothAstChange } from "./hooks/use-smooth-ast-change";
import { useRenderChange } from "./hooks/use-render-change";
import { genAst } from "./helper/gen-ast";
import { ChatFamePropsProvider } from "./context";
import { Logger } from "@/libs/utils";
import { I18n } from "@/libs/i18n";
import { useTaskChangeHandle } from "./hooks/use-task-change";
export interface MarkdownProps {
  theme?: "light" | "dark";
  selectable?: boolean;
  taskDisabled?: boolean;
  markdown: string;
  enableCodeBy4Space?: boolean; // 启用4个空格缩进的代码块
  enableHtmlTags?: boolean;
  isSmooth?: boolean;
  isFinish?: boolean;
  interval?: number;
  language?: Language;
  onMarkdownEnd?: () => void;
  onRenderMarkdownChange?: (md: string) => void;
  onImageClick?: IOnImageClickEvent;
  onTaskChange?: IOnTaskListChange;
  debug?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
const MarkdownRender: FC<
  PropsWithChildren<
    MarkdownProps & {
      onAstChange?: (ast: RootMdType) => void;
      isShowIndicator?: boolean;
    }
  >
> = ({
  markdown,
  onAstChange,
  isShowIndicator = false,
  theme,
  className,
  style,
}) => {
  const refRaw = useRef<string>("");
  const refAst = useRef<RootMdType>();
  const renderAst = useMemo(() => {
    const [rawAstRoot, fixedAstRoot, showAstRoot] = genAst({
      oldMarkdown: refRaw.current,
      newMarkdown: markdown,
      lastAstRoot: refAst.current,
      isShowIndicator,
    });
    refAst.current = rawAstRoot;
    refRaw.current = markdown;
    onAstChange?.(fixedAstRoot);

    return showAstRoot;
  }, [markdown, isShowIndicator, onAstChange]);
  return (
    <Root className={className} style={style} root={renderAst} theme={theme} />
  );
};

const MdStreamOp: FC<PropsWithChildren<MarkdownProps>> = ({
  theme = "light",
  markdown,
  isSmooth,
  isFinish,
  interval = 50,
  onMarkdownEnd,
  onRenderMarkdownChange,
  onImageClick,
  onTaskChange,
  language,
  debug,
  selectable = true,
  className,
  style,
  taskDisabled,
  enableHtmlTags = false,
  enableCodeBy4Space = false,
}) => {
  const { showMarkdown, isShowIndicator, showMoreByte } = useSmoothShowMarkdown(
    {
      isSmooth,
      interval,
      markdown,
      isFinish,
    }
  );
  const i18n = useMemo(() => new I18n(language || Language.ZH_CN), []);
  const logger = useMemo(() => {
    const loggerNew = new Logger();
    debug && loggerNew.seDebug();
    return loggerNew;
  }, []);
  useRenderChange({
    showMarkdown,
    markdown,
    isFinish,
    onMarkdownEnd,
    onRenderMarkdownChange,
  });
  const { onAstChange } = useSmoothAstChange({
    isSmooth,
    markdown,
    showMoreByte,
    showMarkdownIndex: showMarkdown.length,
    enableHtmlTags,
  });
  const { onTaskChangeHandle } = useTaskChangeHandle({ onTaskChange, logger });
  return (
    <ChatFamePropsProvider
      markdown={markdown}
      onTaskChangeHandle={onTaskChangeHandle}
      onImageClick={onImageClick}
      i18n={i18n}
      logger={logger}
      selectable={selectable}
      taskDisabled={!isFinish || taskDisabled}
      enableHtmlTags={enableHtmlTags}
      enableCodeBy4Space={enableCodeBy4Space}
    >
      <MarkdownRender
        theme={theme}
        markdown={showMarkdown}
        isShowIndicator={isShowIndicator}
        onAstChange={onAstChange}
        className={className}
        style={style}
      />
    </ChatFamePropsProvider>
  );
};
export const MdStream: FC<PropsWithChildren<MarkdownProps>> = memo(
  MdStreamOp,
  (prev, next) => {
    if (Object.keys(prev).length !== Object.keys(next).length) {
      return false;
    } else {
      return !Object.keys(prev).find((key) => {
        if (prev[key] !== next[key]) {
          return true;
        }
        return false;
      });
    }
  }
);
