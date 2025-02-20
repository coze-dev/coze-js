import React, { type FC } from 'react';

import cls from 'classnames';
import { View } from '@tarojs/components';

import { SvgCheckMark } from '../svg';
import { Spacing } from '../spacing';
import { DisableContainer } from '../disable-container';

import styles from './index.module.less';

interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  onChange?: (checked: boolean) => void;
}
export const Checkbox: FC<CheckboxProps> = props => {
  const { checked, onChange, disabled, className, children } = props;

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
        <View className={cls(styles.checkbox, { [styles.checked]: checked })}>
          {checked ? <SvgCheckMark /> : null}
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
