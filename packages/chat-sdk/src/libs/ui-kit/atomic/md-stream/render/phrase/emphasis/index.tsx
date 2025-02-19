import { View } from '@tarojs/components';
import type { Emphasis as EmphasisMdType } from 'mdast';
import { FC } from 'react';
import { Phrase } from '../';
import styles from './index.module.less';
export const Emphasis: FC<{
  node: EmphasisMdType;
}> = ({ node }) => {
  return (
    <View className={styles.emphasis}>
      {node.children.map((item, index) => (
        <Phrase key={index} node={item} />
      ))}
    </View>
  );
};
