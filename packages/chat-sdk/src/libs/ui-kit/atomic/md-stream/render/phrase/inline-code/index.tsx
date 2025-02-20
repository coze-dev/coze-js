import { FC } from 'react';

import type { InlineCode as InlineCodeMdType } from 'mdast';
import { Text } from '@tarojs/components';

import { useMdStreamSelectable } from '../../../context';

import styles from './index.module.less';
export const InlineCode: FC<{
  node: InlineCodeMdType;
}> = ({ node }) => {
  const selectable = useMdStreamSelectable();
  return (
    <Text
      selectable={selectable}
      space="nbsp"
      className={styles['inline-code']}
    >
      {node.value}
    </Text>
  );
};
