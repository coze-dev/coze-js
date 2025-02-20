import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
interface SmoothShowMarkdownProps {
  markdown: string;
  isSmooth?: boolean;
  isFinish?: boolean;
  interval?: number;
  onMarkdownEnd?: () => void;
  onRenderMarkdownChange?: (md: string) => void;
}
export const useSmoothShowMarkdown = ({
  isSmooth,
  interval,
  markdown,
  isFinish,
}: SmoothShowMarkdownProps) => {
  const refMarkdown = useRef('');
  const refIsSmooth = useRef(isSmooth);
  const refInterval = useRef(interval);
  const refIndex = useRef(0);
  const [showMarkdown, setShowMarkdown] = useState(!isSmooth ? markdown : '');
  const isShowIndicator =
    isSmooth && (showMarkdown.length < refMarkdown.current.length || !isFinish);

  const isMarkdownChange = useMemo(() => {
    if (!markdown.startsWith(refMarkdown.current) || !isSmooth) {
      return true;
    }
    return false;
  }, [markdown, isSmooth]);

  refMarkdown.current = markdown;
  refInterval.current = interval;
  refIsSmooth.current = isSmooth;

  const showMoreByte = useCallback((count = 1) => {
    if (refIndex.current < refMarkdown.current.length) {
      refIndex.current += count || 1;
      const ms = refMarkdown.current?.slice(0, refIndex.current);
      setShowMarkdown(ms);
    }
  }, []);
  useEffect(() => {
    let timeout;
    refIndex.current = 0;
    refIndex.current = 0;
    if (isSmooth) {
      function run() {
        timeout = setTimeout(() => {
          showMoreByte(2);
          run();
        }, refInterval.current);
      }
      run();
    } else {
      setShowMarkdown(refMarkdown.current);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isSmooth, isMarkdownChange && markdown]);
  return { isShowIndicator, showMarkdown, showMoreByte };
};
