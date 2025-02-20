import { FC } from 'react';

import cls from 'classnames';
import { View, Text } from '@tarojs/components';

import { SvgLoading } from '../svg';

import styles from './index.module.less';

export const Spinning: FC<{
  className?: string;
  text?: string;
  textClassName?: string;
  svgClassName?: string;
  size?: 'large' | 'medium' | 'small';
}> = ({ className, text, textClassName, svgClassName, size }) => (
  <View
    className={cls(styles.container, className, {
      [styles[size || 'medium']]: true,
    })}
  >
    <SvgLoading className={cls(styles.svg, svgClassName)} />
    {text ? (
      <Text className={cls(styles.text, textClassName)}>{text}</Text>
    ) : null}
  </View>
);
