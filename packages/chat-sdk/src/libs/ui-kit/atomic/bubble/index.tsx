import React from 'react';

import cls from 'classnames';
import { View } from '@tarojs/components';

import styles from './index.module.less';
export interface BubbleProps {
  className?: string;
  children?: React.ReactNode;
  isActive?: boolean;
  isNeedBorder?: boolean;
  canClick?: boolean;
  onClick?: () => void;
}
export const Bubble = ({
  className,
  children,
  isNeedBorder = true,
  isActive = false,
  canClick = false,
  onClick,
}: BubbleProps) => (
  <View
    className={cls(styles.bubble, className, {
      [styles.active]: isActive,
      [styles['can-click']]: canClick,
      [styles['is-need-border']]: isNeedBorder,
    })}
    onClick={onClick}
  >
    {children}
  </View>
);
