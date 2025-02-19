import { View } from '@tarojs/components';
import type { Strong as StrongMdType } from 'mdast';
import { FC } from 'react';
import { Phrase } from '../';
import styles from './index.module.less';
export const Strong: FC<{
  node: StrongMdType;
}> = ({ node }) => {
  return (
    <View className={styles.strong}>
      {node.children.map((item, index) => (
        <Phrase key={index} node={item} />
      ))}
    </View>
  );
};
