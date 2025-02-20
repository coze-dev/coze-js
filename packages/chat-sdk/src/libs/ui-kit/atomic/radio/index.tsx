import { type FC } from 'react';

import cls from 'classnames';
import { View } from '@tarojs/components';

import { Spacing } from '../spacing';
import { DisableContainer } from '../disable-container';

import styles from './index.module.less';

interface RadioProps {
  checked?: boolean;
  className?: string;
  disabled?: boolean;

  children?: React.ReactNode;
  onChange?: (checked: boolean) => void;
}
export const Radio: FC<RadioProps> = props => {
  const { checked, onChange, disabled, children, className } = props;

  const handleChange = () => {
    if (disabled) {
      return null;
    }
    onChange?.(!checked);
  };
  return (
    <DisableContainer disabled={disabled}>
      <Spacing
        className={cls(styles.box, className)}
        gap={8}
        onClick={handleChange}
      >
        <View
          onClick={handleChange}
          className={cls(styles.radio, { [styles.checked]: checked })}
        >
          <View className={styles['checked-circle']} />
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          {children}
        </View>
      </Spacing>
    </DisableContainer>
  );
};
