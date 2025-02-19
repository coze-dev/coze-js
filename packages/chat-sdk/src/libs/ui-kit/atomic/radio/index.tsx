import { type FC } from "react";
import classNames from "classnames";
import { View } from "@tarojs/components";
import cls from "classnames";

import styles from "./index.module.less";
import { Spacing } from "../spacing";
import { DisableContainer } from "../disable-container";

interface RadioProps {
  checked?: boolean;
  className?: string;
  disabled?: boolean;

  children?: React.ReactNode;
  onChange?: (checked: boolean) => void;
}
export const Radio: FC<RadioProps> = (props) => {
  const { checked, onChange, disabled, children, className } = props;

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
          onClick={handleChange}
          className={classNames(styles["radio"], { [styles.checked]: checked })}
        >
          <View className={styles["checked-circle"]} />
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
