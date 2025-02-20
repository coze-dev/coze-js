import { PropsWithChildren } from 'react';

import cls from 'classnames';
import { View } from '@tarojs/components';

import styles from './index.module.less';

export const DisableContainer = ({
  disabled,
  className,
  children,
}: PropsWithChildren<{ disabled?: boolean; className?: string }>) => (
  <View
    className={cls(styles.container, className, {
      [styles.disabled]: disabled,
    })}
  >
    {children}
  </View>
);
