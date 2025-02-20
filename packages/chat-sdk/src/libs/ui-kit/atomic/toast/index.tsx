import { FC, PropsWithChildren } from 'react';

import cls from 'classnames';
import { View } from '@tarojs/components';

import { SvgErrorFill, SvgClose, SvgSuccessFill } from '../svg';
import { Spacing } from '../spacing';

import styles from './index.module.less';

const SvgMap = {
  success: SvgSuccessFill,
  error: SvgErrorFill,
  none: null,
};
export const Toast: FC<
  PropsWithChildren<{
    className?: string;
    isNeedClose?: boolean;
    icon?: 'success' | 'error' | 'none';
    onClose?: () => void;
  }>
> = ({ children, onClose, className, icon = 'none', isNeedClose = true }) => {
  const Icon = SvgMap[icon];
  return (
    <Spacing
      verticalCenter
      horizontalCenter
      className={cls(
        styles.container,
        {
          [styles[icon]]: icon,
        },
        className,
      )}
      gap={12}
    >
      {Icon ? <Icon className={styles.icon} /> : null}
      <View className={styles.content}>{children}</View>
      {isNeedClose ? <SvgClose onClick={onClose} /> : null}
    </Spacing>
  );
};
