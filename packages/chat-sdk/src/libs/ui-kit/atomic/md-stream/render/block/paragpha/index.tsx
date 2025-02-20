import { FC } from 'react';

import type { Paragraph as ParagraphMdType } from 'mdast';
import { View } from '@tarojs/components';

import { Phrase } from '../../phrase';

export const Paragraph: FC<{
  node: ParagraphMdType;
  isNeedMargin?: boolean;
}> = ({ node }) => (
  <View>
    {node.children.map((item, index) => (
      <Phrase key={index} node={item} />
    ))}
  </View>
);
