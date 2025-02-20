import { FC, PropsWithChildren } from 'react';

import cls from 'classnames';

import { CenterAlignedBox } from '@/libs/ui-kit';

import styles from './index.module.less';

export const IconButton: FC<
  PropsWithChildren<{
    type?: 'circle-btn' | 'square-hover-btn';
    className?: string;
    border?: 'none' | 'normal';
    size?: 'large' | 'medium' | 'small';
    hoverTheme?: 'hover' | 'none';
    bgColor?: 'medium' | 'bold';
    onClick?: () => void;
  }>
> = ({
  type = 'circle-btn',
  children,
  onClick,
  className,
  border,
  hoverTheme = 'hover',
  size = 'medium',
  bgColor,
}) => (
  <CenterAlignedBox
    onClick={() => {
      onClick?.();
    }}
    className={cls(
      styles.container,
      className,
      styles[type],
      styles[size],
      styles[hoverTheme],
      {
        [styles.border]: border !== 'none',
        [styles.bold]: bgColor === 'bold',
      },
    )}
  >
    {children}
  </CenterAlignedBox>
);
