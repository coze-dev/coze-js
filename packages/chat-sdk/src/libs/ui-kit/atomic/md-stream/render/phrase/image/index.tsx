import { FC, useEffect, useState } from 'react';

import type { Image as ImageMdType } from 'mdast';
import cls from 'classnames';
import { previewImage } from '@tarojs/taro';
import { Image as TaroImage } from '@tarojs/components';

import { useMdStreamContext } from '../../../context';

import styles from './index.module.less';

export const Image: FC<{
  node: ImageMdType;
}> = ({ node }) => {
  const { onImageClick, eventCallbacks } = useMdStreamContext();
  const [url, setUrl] = useState(node.url);
  useEffect(() => {
    setUrl(node.url);
  }, [node]);
  return (
    <TaroImage
      src={url}
      mode="aspectFill"
      className={cls(styles.image, {
        [styles['image-error']]: !url,
      })}
      onError={() => {
        setUrl('');
      }}
      onClick={() => {
        if (node.url) {
          if (eventCallbacks?.onImageClick) {
            eventCallbacks.onImageClick({ url: node.url });
          } else if (onImageClick) {
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
