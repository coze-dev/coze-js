import { FC } from 'react';

import { Text } from '@tarojs/components';

import { IndicatorLocal } from '../../../ast';

import styles from './index.module.less';

export const Indicator: FC<{
  node: IndicatorLocal;
}> = () => <Text className={styles.indicator} />;
