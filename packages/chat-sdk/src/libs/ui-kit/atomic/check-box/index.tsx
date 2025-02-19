import React, { type FC } from "react";

import classNames from "classnames";
import { View } from "@tarojs/components";

import { SvgCheckMark } from "../svg";
import cls from "classnames";
import styles from "./index.module.less";
import { Spacing } from "../spacing";
import { DisableContainer } from "../disable-container";

interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  onChange?: (checked: boolean) => void;
}
export const Checkbox: FC<CheckboxProps> = (props) => {
  const { checked, onChange, disabled, className, children } = props;

  const handleChange = () => {
    if (disabled) {
      return;
    }
    onChange?.(!checked!);
  };
  return (
    <DisableContainer disabled={disabled}>
      <Spacing
        className={cls(styles.box, className)}
        gap={8}
        onClick={handleChange}
      >
        <View
          className={classNames(styles.checkbox, { [styles.checked]: checked })}
        >
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
