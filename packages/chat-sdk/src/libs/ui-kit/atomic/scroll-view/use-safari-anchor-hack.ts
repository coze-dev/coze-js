import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';

import Taro from '@tarojs/taro';

import { isSafari, logger } from '@/libs/utils';
import { usePersistCallback } from '@/libs/hooks';

export const useSafariAnchorHack = ({
  refAnchorBottom,
  refScrollEl,
}: {
  refAnchorBottom?: MutableRefObject<boolean>;
  refScrollEl?: MutableRefObject<HTMLDivElement | null>;
}) => {
  const isNeedHack = useMemo(() => {
    const { platform } = Taro.getSystemInfoSync();
    return isSafari && !['ios', 'android'].includes(platform.toLowerCase());
  }, []);
  const [viewEl, setViewEl] = useState<HTMLDivElement | null>();
  const refScrollRecord = useRef<Array<{ height: number; scrollTop: number }>>(
    [],
  );
  logger.info('useSafariAnchorHack isNeedHack: ', isNeedHack);

  const onInitViewEl = usePersistCallback((el: HTMLDivElement) => {
    setViewEl(el);
  });
  const onCollectScrollInfo = usePersistCallback(() => {
    if (!isNeedHack) {
      return;
    }
    const height = viewEl?.offsetHeight || 0;
    const scrollTop = refScrollEl?.current?.scrollTop || 0;
    const leftData = refScrollRecord.current.filter(
      item => item.height !== height,
    );
    leftData.unshift({
      height,
      scrollTop,
    });
    leftData.splice(5);
    refScrollRecord.current = leftData;
  });
  useEffect(() => {
    if (!isNeedHack) {
      return;
    }
    if (viewEl) {
      let height = viewEl.offsetHeight;
      const observer = new ResizeObserver(function () {
        const oldHeight = height;
        const newHeight = viewEl.offsetHeight;
        height = newHeight;
        if (!refAnchorBottom?.current) {
          return;
        }

        if (newHeight !== oldHeight) {
          if (refScrollEl?.current?.scrollTop !== 0) {
            const lastScrollTop = Number(
              refScrollRecord.current.find(item => item.height === oldHeight)
                ?.scrollTop,
            );
            const nowScrollTop = Number(refScrollEl?.current?.scrollTop);

            const diff = Math.abs(
              newHeight - oldHeight - lastScrollTop + nowScrollTop,
            );
            if (diff < 5 || diff > 300) {
              return;
            }
            refScrollEl?.current?.scrollBy(0, oldHeight - newHeight);
          }
        }
      });
      observer.observe(viewEl);

      return () => {
        observer.disconnect();
      };
    }
  }, [viewEl]);
  return {
    onInitViewEl,
    onCollectScrollInfo,
  };
};
