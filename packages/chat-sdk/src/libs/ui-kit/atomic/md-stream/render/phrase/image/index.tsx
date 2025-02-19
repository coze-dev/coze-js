import { Image as TaroImage } from "@tarojs/components";
import type { Image as ImageMdType } from "mdast";
import { FC, useEffect, useState } from "react";
import styles from "./index.module.less";
import { previewImage } from "@tarojs/taro";
import { useMdStreamContext } from "../../../context";
import cls from "classnames";

export const Image: FC<{
  node: ImageMdType;
}> = ({ node }) => {
  const { onImageClick } = useMdStreamContext();
  const [url, setUrl] = useState(node.url);
  useEffect(() => {
    setUrl(node.url);
  }, [node]);
  return (
    <TaroImage
      src={url}
      mode="aspectFill"
      className={cls(styles.image, {
        [styles["image-error"]]: !url,
      })}
      onError={() => {
        setUrl("");
      }}
      onClick={() => {
        if (node.url) {
          if (onImageClick) {
            onImageClick?.({ url: node.url });
          } else {
            previewImage({
              urls: [node.url],
              current: node.url,
              enableShowPhotoDownload: true,
            });
          }
        }
      }}
    />
  );
};
