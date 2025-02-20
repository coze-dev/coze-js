import { FC, useMemo } from 'react';

import { Image, View } from '@tarojs/components';

import { logger } from '@/libs/utils';
import { type BgImageInfoMap } from '@/libs/types';
import { useSize } from '@/libs/hooks';

import { addAlpha, cropperSizeMap, getDeviceMode, getGradient } from './helper';

import styles from './index.module.less';

let chatBackGroundId = 1000;
export const ChatBackground: FC<BgImageInfoMap> = props => {
  const id = useMemo(() => `chatbg_id_${chatBackGroundId++}`, []);
  const {
    width: containerWidth,
    height: containerHeight,
    reInitSize,
  } = useSize(id);

  const mode = getDeviceMode(containerWidth, containerHeight);
  const bgInfo = props[mode];
  if (!bgInfo || !bgInfo?.imgUrl) {
    return null;
  }
  const {
    themeColor = 'transparent',
    imgUrl,
    canvasPosition,
    gradientPosition,
  } = bgInfo;
  const isDefault = !canvasPosition.width || !canvasPosition.height; // 如果未设置宽高度，则使用默认模式进行渲染

  const mediumColor = addAlpha(themeColor, 0.95);
  const cropperSize = cropperSizeMap[mode];
  const { left: gradientLeft = 0, right: gradientRight = 0 } = getGradient(
    gradientPosition,
    canvasPosition,
    cropperSize.width,
  );
  const imgWidth = containerHeight * (cropperSize.width / cropperSize.height);

  logger.debug('ChatBackground', containerWidth, containerHeight);
  return (
    <View
      id={id}
      className={styles['bg-image']}
      style={{
        backgroundColor: themeColor,
      }}
      ref={reInitSize}
    >
      <View className={styles.mask} />
      <View
        className={styles['img-container']}
        style={{
          width: isDefault ? '100%' : imgWidth,
          maxWidth: isDefault ? '100' : imgWidth,
        }}
      >
        <Gradient
          position={gradientLeft}
          direction="left"
          background={`linear-gradient(90deg,  ${themeColor} 10%, ${mediumColor} 28%, transparent 92.4%)`}
          isShow={!isDefault}
        />

        {imgUrl ? (
          <Image
            src={imgUrl}
            mode={isDefault ? 'aspectFill' : 'heightFix'}
            className={styles.img}
            style={
              isDefault
                ? {
                    left: '50%',
                    width: '100%',
                    height: '100%',
                    transform: 'translateX(-50%)',
                  }
                : {
                    height: `${
                      (canvasPosition.height / cropperSize.height) * 100
                    }%`,
                    left: `${
                      gradientLeft
                        ? gradientLeft * 100
                        : -gradientRight * 2 * 100
                    }%`,
                    top: `${(canvasPosition.top / cropperSize.height) * 100}%`,
                  }
            }
          />
        ) : null}

        <Gradient
          position={gradientRight}
          direction="right"
          isShow={!isDefault}
          background={`linear-gradient(90deg,  transparent 10% , ${mediumColor} 72%, ${themeColor} 92%)`}
        />
      </View>
    </View>
  );
};

const Gradient: React.FC<{
  position: number;
  background: string;
  direction: 'left' | 'right';
  isShow?: boolean;
}> = ({ position = 0, background, direction, isShow = true }) => {
  if (!isShow) {
    return null;
  }
  return (
    <View
      className={styles.gradient}
      style={{
        [direction]: `${(position > 0 ? position : 0) * 100 - 0.1}%`,
        width: '10%',
        background,
        opacity: 1,
      }}
    />
  );
};

/*
 背景图方案
  <View
            className={styles.img}
            style={
              isDefault
                ? {
                    backgroundImage: `url(${imgUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    left: "50%",
                    width: "100%",
                    transform: "translateX(-50%)",
                  }
                : {
                    backgroundImage: `url(${imgUrl})`,
                    height: `${
                      (canvasPosition.height / cropperSize.height) * 100
                    }%`,
                    left: `${
                      gradientLeft
                        ? gradientLeft * 100
                        : -gradientRight * 2 * 100
                    }%`,
                    top: `${(canvasPosition.top / cropperSize.height) * 100}%`,
                  }
            }
          />
*/
