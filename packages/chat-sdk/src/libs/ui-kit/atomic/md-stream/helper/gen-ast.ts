import { gfmStrikethrough } from "micromark-extension-gfm-strikethrough";
import { gfmStrikethroughFromMarkdown } from "mdast-util-gfm-strikethrough";
import { gfmTable } from "micromark-extension-gfm-table";
import { gfmTaskListItem } from "micromark-extension-gfm-task-list-item";
import { gfmTaskListItemFromMarkdown } from "mdast-util-gfm-task-list-item";
import { gfmTableFromMarkdown } from "mdast-util-gfm-table";
import { radioListItem } from "micromark-extension-misc-radio-list-item";
import { radioListItemFromMarkdown } from "mdast-util-radio-list-item";
import { fromMarkdown } from "mdast-util-from-markdown";
import type { Root } from "mdast";
import { cloneDeep } from "lodash-es";

import { autoFix } from "./autofix";
import { addIndicator } from "./add-indicator";
const extensions = [
  gfmStrikethrough({ singleTilde: false }),
  gfmTable(),
  gfmTaskListItem(),
  radioListItem(),
];
const mdastExtensions = [
  gfmStrikethroughFromMarkdown(),
  gfmTableFromMarkdown(),
  gfmTaskListItemFromMarkdown(),
  radioListItemFromMarkdown(),
];
export const genAst = ({
  oldMarkdown,
  newMarkdown,
  lastAstRoot,
  isShowIndicator,
}: {
  oldMarkdown: string;
  newMarkdown: string;
  lastAstRoot?: Root;
  isShowIndicator?: boolean;
}): [Root, Root, Root] => {
  let rawAstRoot: Root;
  const offset =
    lastAstRoot?.children?.[lastAstRoot?.children?.length - 2]?.position?.start
      .offset || 0;

  if (
    oldMarkdown === "" ||
    !lastAstRoot?.position ||
    lastAstRoot?.children.length < 2 ||
    offset < 20 ||
    !newMarkdown.startsWith(oldMarkdown)
  ) {
    // markdown 有变化，重新构建
    // markdown 未构建过Ast，重新构建
    // markdown 上次构建的有问题
    rawAstRoot = fromMarkdown(newMarkdown, {
      extensions,
      mdastExtensions,
    });
  } else {
    const leftMarkdown = newMarkdown.slice(offset);
    const leftAstChildren = fromMarkdown(leftMarkdown, {
      extensions,
      mdastExtensions,
    }).children;
    leftAstChildren.map((item) => {
      if (item.position?.start) {
        item.position.start.offset = item.position.start.offset || 0;
        item.position.start.offset += offset;
        item.position.end.offset = item.position.end.offset || 0;
        item.position.end.offset += offset;
      }
    });
    lastAstRoot.children.splice(-2, 2, ...leftAstChildren);
    rawAstRoot = lastAstRoot;
  }

  // 不需要重新定义了

  const fixedAstRoot = cloneDeep(rawAstRoot);
  autoFix(fixedAstRoot);
  const showAstRoot = cloneDeep(fixedAstRoot);
  if (isShowIndicator) {
    addIndicator(showAstRoot);
  }
  return [rawAstRoot, fixedAstRoot, showAstRoot];
};
