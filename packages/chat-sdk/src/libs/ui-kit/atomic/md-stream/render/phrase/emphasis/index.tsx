import { FC } from 'react';

import type { Emphasis as EmphasisMdType } from 'mdast';
import { View } from '@tarojs/components';

import { Phrase } from '../';

import styles from './index.module.less';
export const Emphasis: FC<{
  node: EmphasisMdType;
}> = ({ node }) => (
  <View className={styles.emphasis}>
    {node.children.map((item, index) => (
      <Phrase key={index} node={item} />
    ))}
  </View>
);
