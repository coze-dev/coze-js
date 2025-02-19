import { View } from '@tarojs/components';
import type { Heading as HeadingMdType } from 'mdast';
import { Phrase } from '../../phrase';
import { FC } from 'react';
import styles from './index.module.less';
export const Heading: FC<{
  node: HeadingMdType;
}> = ({ node }) => {
  const depth = node.depth > 3 ? 3 : node.depth;
  return (
    <View className={styles[`heading-${depth}`]}>
      {node.children.map((item, index) => (
        <Phrase key={index} node={item} />
      ))}
    </View>
  );
};
