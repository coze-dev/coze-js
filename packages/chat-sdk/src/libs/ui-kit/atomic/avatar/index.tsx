import cls from "classnames";

import styles from "./index.module.less";
import { useEffect, useState } from "react";
import AvatarImg from "../../assets/imgs/avatar.png";
import { CImage } from "../c-image";
interface AvatarProps {
  className?: string;
  src: string;
  size?: "large" | "medium" | "small";
}
export const Avatar = ({ className, src, size = "medium" }: AvatarProps) => {
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    setIsError(false);
  }, [src]);
  return (
    <CImage
      src={isError ? AvatarImg : src}
      className={cls(styles.avatar, className, {
        [styles[size || ""]]: true,
      })}
      onError={() => !isError && setIsError(true)}
      mode="aspectFill"
    />
  );
};
