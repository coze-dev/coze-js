import cls from "classnames";
import { View } from "@tarojs/components";

import styles from "./index.module.less";
import { FC } from "react";

export const AudioPlay: FC<{
  isPlaying: boolean;
  onClick?: () => void;
  theme?: "light" | "dark" | "gray-bold";
}> = ({ isPlaying, onClick, theme = "dark" }) => {
  return (
    <View
      className={cls(styles.audioPlay, {
        [styles.playing]: isPlaying,
        [styles[theme]]: true,
      })}
      onClick={onClick}
    />
  );
};
