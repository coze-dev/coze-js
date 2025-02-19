import { FC, PropsWithChildren } from 'react';

import cls from 'classnames';
import { View, type ViewProps } from '@tarojs/components';

import styles from './index.module.less';

export const CenterAlignedBox: FC<
  PropsWithChildren<
    {
      width?: number;
      height?: number;
      className?: string;
    } & Omit<ViewProps, 'ref'>
  >
> = ({ className, width, height, children, ...rest }) => (
  <View
    className={cls(styles.wrapper, className)}
    style={{
      width,
      height,
    }}
    {...rest}
  >
    {children}
  </View>
);
