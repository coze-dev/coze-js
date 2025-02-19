import cls from "classnames";
import { Text } from "@tarojs/components";

import { FC, PropsWithChildren } from "react";
import { navigateTo } from "@tarojs/taro";
import styles from "./index.module.less";
import { isWeb } from "@/libs/utils";

interface LinkProps {
  className?: string;
  src: string;
  size?: "large" | "medium" | "small";
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
