import { PropsWithChildren } from "react";

import cls from "classnames";
import { View, ViewProps } from "@tarojs/components";

import styles from "./index.module.less";

interface SpacingProps {
  className?: string;
  gap?: number;
  flex1?: boolean;
  horizontalCenter?: boolean;
  verticalCenter?: boolean;
  vertical?: boolean;
  width100?: boolean;
  height100?: boolean;
  style?: React.CSSProperties;
  onClick?: (event: Event) => void;
}
export const Spacing = ({
  className,
  children,
  gap,
  vertical,
  flex1,
  horizontalCenter,
  verticalCenter,
  onClick,
  width100,
  height100,
  style,
  ...rest
}: PropsWithChildren<SpacingProps & Omit<ViewProps, "ref" | "style">>) => (
  <View
    {...rest}
    className={cls(
      styles.spacing,
      {
        [styles["horizontal-center"]]: horizontalCenter,
      },
      className
    )}
    style={{
      gap,
      flexDirection: vertical ? "column" : "row",
      justifyContent: horizontalCenter ? "center" : undefined,
      alignItems: verticalCenter ? "center" : undefined,
      flex: flex1 ? 1 : undefined,
      width: width100 ? "100%" : undefined,
      height: height100 ? "100%" : undefined,
      ...style,
    }}
    onClick={onClick}
  >
    {children}
  </View>
);
