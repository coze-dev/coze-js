import { FC, useMemo } from 'react';

import { Text, View } from '@tarojs/components';

import { getFileTypeByFileName } from '@/libs/utils';

import { SvgFileType } from '../../../atomic/svg';
import { Spacing } from '../../../atomic/spacing';
import { Bubble } from '../../../atomic/bubble';

import styles from './index.module.less';

const getSizeStr = (size: number) => {
  if (size < 1024) {
    return `${size}B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)}KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)}MB`;
  }
};
export const FileMessage: FC<{
  filename: string;
  size: number;
}> = ({ filename, size }) => {
  const fileType = useMemo(() => getFileTypeByFileName(filename), [filename]);
  return (
    <View className={styles.file}>
      <Bubble className={styles.container}>
        <SvgFileType type={fileType} className={styles.svg} />
        <Spacing vertical gap={0} flex1>
          <Text
            className={styles.txt}
            maxLines={1}
            numberOfLines={1}
            overflow="ellipsis"
          >
            {filename}
          </Text>
          <Text
            className={styles.size}
            maxLines={1}
            numberOfLines={1}
            overflow="ellipsis"
          >
            {getSizeStr(size)}
          </Text>
        </Spacing>
      </Bubble>
    </View>
  );
};
