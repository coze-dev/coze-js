import { Image, ImageProps } from "@tarojs/components";
import { FC, useState } from "react";
import cls from "classnames";
import styles from "./index.module.less";
import { useUpdateEffect } from "@/libs/hooks";
import { logger } from "@/libs/utils";

export const CImage: FC<Omit<ImageProps, "ref">> = (props) => {
  const [url, setUrl] = useState(props.src);
  useUpdateEffect(() => {
    setUrl(props.src);
  }, [props.src]);
  return (
    <Image
      onError={() => {
        logger.error("CImage onError", props.src);
        setUrl("");
      }}
      {...props}
      src={url}
      className={cls(props.className, {
        [styles["image-error"]]: !url,
      })}
    />
  );
};
