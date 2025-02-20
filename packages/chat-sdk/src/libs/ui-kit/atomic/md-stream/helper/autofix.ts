import type { Root } from 'mdast';

import { autoFixLink } from './autofix-link';
import { autoFixImg } from './autofix-img';
export const autoFix = (root: Root) => {
  autoFixImg(root);
  autoFixLink(root);
  //  autoFixIndicator(root);
};
