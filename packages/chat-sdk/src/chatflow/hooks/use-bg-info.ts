import { useMemo } from 'react';

import type { BgImageInfo, BgImageInfoMap } from '@/libs/types';

import { type IChatFlowProps } from '../type';

export const useBgInfo = (props: IChatFlowProps): BgImageInfoMap | undefined =>
  useMemo(() => {
    if (props.areaUi?.bgInfo) {
      const info: BgImageInfo = {
        imgUrl: props.areaUi.bgInfo.imgUrl,

        themeColor: props.areaUi.bgInfo.themeColor,
        gradientPosition: {
          left: 0,
          right: 0,
        },
        canvasPosition: {
          width: 0,
          height: 0,
          left: 0,
          top: 0,
        },
      };
      return {
        pc: info,
        mobile: info,
      };
    }
    return undefined;
  }, [props.areaUi?.bgInfo]);
