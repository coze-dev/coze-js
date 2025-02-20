import type { Root, RootContent } from 'mdast';

import { getRegResult } from '../util/ast';
import type { RootContentLocal } from '../ast';
import { traversalLastNode } from './traversal-last-node';

const removePatterns = [/!$/];
const fixPatterns = [
  /!\[(?<text>[^\]\n]*)$/,
  /!\[(?<text>[^\]\n]+)\]$/,
  /!\[(?<text>[^\]\n]+)\]\([^\)\n]*$/,
  /!\[(?<text>[^\]\n]+)\]\([^\)\n]*$/,
];

export function autoFixImg(root: Root) {
  traversalLastNode(
    root as unknown as RootContent,
    undefined,
    (node?: RootContentLocal) => {
      if (!node) {
        return [];
      }
      if (node.type === 'text') {
        const nodesReturn: RootContent[] = [];
        const removeMatch: RegExpExecArray | null = getRegResult(
          node.value as string,
          removePatterns,
        );
        const fixMatch: RegExpExecArray | null = getRegResult(
          node.value as string,
          fixPatterns,
        );
        const matchResult = fixMatch || removeMatch;
        if (matchResult) {
          nodesReturn.push({
            type: 'text',
            value: node.value.slice(0, matchResult.index),
          });

          if (fixMatch) {
            nodesReturn.push({
              type: 'image',
              url: '',
              alt: fixMatch.groups?.text || 'image',
            });
          }
          return nodesReturn;
        }
      }
      return [node];
    },
  );
}
