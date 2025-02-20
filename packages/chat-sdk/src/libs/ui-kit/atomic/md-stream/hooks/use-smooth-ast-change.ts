import { useRef } from 'react';

import type { Root as RootMdType } from 'mdast';

import { usePersistCallback } from '@/libs/hooks';

import { getLastNode } from '../helper/traversal-last-node';
interface SmoothShowMarkdownProps {
  markdown: string;
  isSmooth?: boolean;
  showMarkdownIndex: number;
  enableHtmlTags?: boolean;
  showMoreByte: (byte: number) => void;
}
export const useSmoothAstChange = ({
  isSmooth,
  markdown,
  showMoreByte,
  showMarkdownIndex,
  enableHtmlTags,
}: SmoothShowMarkdownProps) => {
  const refMarkdown = useRef(markdown);
  const refIndex = useRef(showMarkdownIndex);
  const refIsSmooth = useRef(isSmooth);
  const refShowMoreByte = useRef(showMoreByte);
  const onAstChange = usePersistCallback((ast: RootMdType) => {
    if (!refIsSmooth.current) {
      return;
    }
    // 最后元素遇到 很多未显示内容的时候，直接跳过打印
    const lastNode = getLastNode(ast);
    if (lastNode?.type === 'image' || lastNode?.type === 'link') {
      const imgEnd = refMarkdown.current.indexOf(')', refIndex.current);
      const newLine = refMarkdown.current.indexOf('\n', refIndex.current);
      if (newLine === -1 || imgEnd < newLine) {
        if (imgEnd > -1) {
          refShowMoreByte.current(imgEnd - refIndex.current + 1);
        }
      } else {
        refShowMoreByte.current(newLine - refIndex.current + 1);
      }
    } else if (lastNode?.type === 'html' && enableHtmlTags) {
      // Html的话，防止抖动，一行一行加载
      const newLine = refMarkdown.current.indexOf('\n', refIndex.current);
      if (newLine > -1) {
        refShowMoreByte.current(newLine - refIndex.current + 1);
      } else {
        refShowMoreByte.current(refMarkdown.current.length - refIndex.current);
      }
    }
  });
  return { onAstChange };
};
