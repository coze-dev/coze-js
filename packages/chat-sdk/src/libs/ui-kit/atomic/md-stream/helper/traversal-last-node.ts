import type { Parent, RootContent } from 'mdast';

import { isParent } from '../util/ast';
import type { RootContentLocal } from '../ast';

export const traversalLastNode = (
  node: RootContentLocal,
  parent: RootContentLocal | undefined,
  handle: (
    content: RootContentLocal | undefined,
    parent?: RootContentLocal,
  ) => RootContentLocal[],
): RootContentLocal[] => {
  if (isParent(node)) {
    const contents = traversalLastNode(
      node?.children[node?.children?.length - 1],
      node,
      handle,
    );
    // @ts-expect-error -- linter-disable-autofix
    node.children.splice(-1, 1, ...contents);
    if (node.children.length === 0) {
      return [];
    }

    return [node];
  } else {
    return handle(node, parent);
  }
};

export const getLastNode = (node: Parent): RootContent | undefined => {
  let lastNode: RootContentLocal | undefined = undefined;
  traversalLastNode(
    node as unknown as RootContentLocal,
    undefined,
    (content?: RootContentLocal, parent?: RootContentLocal) => {
      if (!content) {
        // children 会存在未空的情况
        return [];
      }
      if (parent?.type === 'link') {
        lastNode = parent;
      } else {
        lastNode = content;
      }

      return [content];
    },
  );
  return lastNode;
};
export const isConsumeTextToShow = (node: Parent): boolean => {
  const lastNode: RootContent | undefined = getLastNode(node);
  if (lastNode?.type === 'image' || lastNode?.type === 'link') {
    return false;
  }
  return true;
};
