import { FC, PropsWithChildren } from 'react';

import cls from 'classnames';
import { navigateTo } from '@tarojs/taro';
import { Text } from '@tarojs/components';

import { isWeb } from '@/libs/utils';

import styles from './index.module.less';

interface LinkProps {
  className?: string;
  src: string;
  size?: 'large' | 'medium' | 'small';
}

export const Link: FC<PropsWithChildren<LinkProps>> = ({
  className,
  src,
  children,
}) => (
  <Text
    className={cls(styles.link, className)}
    onClick={() => {
      if (isWeb) {
        window.open(src);
      } else {
        navigateTo({
          url: src,
        });
      }
    }}
  >
    {children}
  </Text>
);
