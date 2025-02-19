import type { Root } from 'mdast';

import type { RootContentLocal, CodeLocal, IndicatorLocal } from '../ast';
import { traversalLastNode } from './traversal-last-node';

const indicator: IndicatorLocal = {
  type: 'indicator',
};

export function addIndicator(root: Root) {
  traversalLastNode(
    root as unknown as RootContentLocal,
    undefined,
    (node?: RootContentLocal) => {
      if (!node) {
        return [indicator];
      }
      if (node?.type === 'code') {
        (node as CodeLocal).children = [
          {
            type: 'text',
            value: node.value,
          },
          indicator,
        ];
        return [node];
      }
      return [node, indicator];
    },
  );
}
