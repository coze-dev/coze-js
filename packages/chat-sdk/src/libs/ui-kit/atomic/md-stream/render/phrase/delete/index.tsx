import { View } from '@tarojs/components';
import type { Delete as DeleteMdType } from 'mdast';
import { FC } from 'react';
import { Phrase } from '../';
import styles from './index.module.less';
export const Delete: FC<{
  node: DeleteMdType;
}> = ({ node }) => {
  return (
    <View className={styles.delete}>
      {node.children.map((item, index) => (
        <Phrase key={index} node={item} />
      ))}
    </View>
  );
};
