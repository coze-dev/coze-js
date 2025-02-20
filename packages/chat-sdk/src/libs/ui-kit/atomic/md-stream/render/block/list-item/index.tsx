import { FC } from 'react';

import type { ListItem as ListItemMdType } from 'mdast';
import { View } from '@tarojs/components';

import { Block } from '../';

export const ListItem: FC<{
  node: ListItemMdType;
}> = ({ node }) => (
  <View>
    {node.children.map((item, index) => (
      <Block node={item} key={index} isParagraphNeedMargin={false} />
    ))}
  </View>
);
