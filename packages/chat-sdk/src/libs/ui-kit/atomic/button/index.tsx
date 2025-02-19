import React from "react";

import cls from "classnames";
import { View } from "@tarojs/components";

import styles from "./index.module.less";
export interface BubbleProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}
export const Button = ({ className, children, onClick }: BubbleProps) => (
  <View className={cls(styles.button, className)} onClick={onClick}>
    {children}
  </View>
);
