import { FC } from 'react';

import type { Blockquote as BlockquoteMdType } from 'mdast';
import { View } from '@tarojs/components';

import { Block } from '../';

import styles from './index.module.less';
export const Blockquote: FC<{
  node: BlockquoteMdType;
}> = ({ node }) => (
  <View className={styles.blockquote}>
    {node.children.map(item => (
      <Block node={item} />
    ))}
  </View>
);
