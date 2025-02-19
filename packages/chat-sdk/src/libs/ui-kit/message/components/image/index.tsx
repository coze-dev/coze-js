import { FC, useState } from "react";

import { previewImage } from "@tarojs/taro";
import { Image, View } from "@tarojs/components";

import styles from "./index.module.less";
import { IOnImageClickEvent } from "@/libs/types";
import { isWeb } from "@/libs/utils";
export const ImageMessage: FC<{
  url: string;
  onImageClick?: IOnImageClickEvent;
}> = ({ url, onImageClick }) => {
  const [imageWidth, setImageWidth] = useState<number | string | undefined>();
  return (
    <View>
      <Image
        src={url}
        mode="widthFix"
        className={styles.image}
        style={{
          width: imageWidth,
        }}
        onClick={() => {
          if (onImageClick) {
            onImageClick?.({ url });
          } else {
            previewImage({
              urls: [url],
              current: url,
              enableShowPhotoDownload: true,
            });
          }
        }}
        onLoad={(res) => {
          if (!isWeb) {
            setImageWidth(res.detail.width || 200);
          }
        }}
      />
    </View>
  );
};
