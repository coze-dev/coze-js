import { useMemo } from 'react';

import cls from 'classnames';
import { Text } from '@tarojs/components';

import { Bubble, type BubbleProps } from '../bubble';

import styles from './index.module.less';
interface BubbleTextProps extends BubbleProps {
  text: string;
  selectable?: boolean;
  space?: boolean; //  Whether the continuous spaces are displayed
  enter?: boolean; //Whether the enter is displayed
  size?: 'large' | 'medium' | 'small';
}
export const BubbleText = ({
  className,
  text,
  size = 'medium',
  space,
  enter,
  selectable = true,
  ...props
}: BubbleTextProps) => {
  const textList = useMemo(() => (enter ? text.split('\n') : [text]), [text]);
  return (
    <Bubble {...props} className={cls(className, styles.bubble)}>
      {textList?.map((item, index) => (
        <Text
          className={cls(styles['bubble-text'], {
            [styles[size || '']]: true,
          })}
          //space={space ? "nbsp" : undefined}
          key={index}
          selectable={selectable}
        >
          {item}
        </Text>
      ))}
    </Bubble>
  );
};
