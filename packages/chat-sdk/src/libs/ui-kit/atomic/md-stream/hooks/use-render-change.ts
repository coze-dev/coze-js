import { useEffect } from 'react';
interface RenderChangeProps {
  showMarkdown: string;
  markdown: string;
  isFinish?: boolean;
  onMarkdownEnd?: () => void;
  onRenderMarkdownChange?: (markdown: string) => void;
}
export const useRenderChange = ({
  showMarkdown,
  markdown,
  isFinish,
  onMarkdownEnd,
  onRenderMarkdownChange,
}: RenderChangeProps) => {
  useEffect(() => {
    if (showMarkdown === markdown && isFinish) {
      onMarkdownEnd?.();
    }
  }, [showMarkdown, markdown, isFinish]);
  useEffect(() => {
    onRenderMarkdownChange?.(showMarkdown);
  }, [showMarkdown]);
};
