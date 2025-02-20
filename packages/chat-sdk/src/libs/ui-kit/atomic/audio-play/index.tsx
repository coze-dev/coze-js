import { FC } from 'react';

import cls from 'classnames';
import { View } from '@tarojs/components';

import styles from './index.module.less';

export const AudioPlay: FC<{
  isPlaying: boolean;
  onClick?: () => void;
  theme?: 'light' | 'dark' | 'gray-bold';
}> = ({ isPlaying, onClick, theme = 'dark' }) => (
  <View
    className={cls(styles.audioPlay, {
      [styles.playing]: isPlaying,
      [styles[theme]]: true,
    })}
    onClick={onClick}
  />
);
