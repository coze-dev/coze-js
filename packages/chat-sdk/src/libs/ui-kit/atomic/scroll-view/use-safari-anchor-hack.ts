import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';

import Taro from '@tarojs/taro';

import { isSafari, logger } from '@/libs/utils';
import { usePersistCallback } from '@/libs/hooks';

// 底部在流式输出的时候，如果此时滚动到了上边视图中，在safari会有bug，页面会不断网上顶上去，需做hack，仅safari发现该问题
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
  const refScrollRecord = useRef<
    Array<{ groupId: string; height: number; scrollTop: number }>
  >([]);
  logger.info('useSafariAnchorHack isNeedHack: ', isNeedHack);

  const onInitViewEl = usePersistCallback((el: HTMLDivElement) => {
    setViewEl(el);
  });
  const getLastElementInfo = usePersistCallback(() => {
    const query = viewEl?.getElementsByClassName('chat-group-for-query');
    if (!query || query.length === 0) {
      return;
    }
    const lastElement = query[query.length - 1] as HTMLDivElement;

    const lastElementInfo = {
      groupId: lastElement.getAttribute('data-group-id'),
      height: lastElement.offsetHeight || 0,
      scrollTop: refScrollEl?.current?.scrollTop || 0,
    };
    if (!lastElementInfo?.groupId || !lastElementInfo?.height) {
      return;
    }
    return lastElementInfo;
  });
  const onCollectScrollInfo = usePersistCallback(() => {
    if (!isNeedHack) {
      return;
    }
    if (!refAnchorBottom?.current) {
      return;
    }
    const lastElementInfo = getLastElementInfo();
    if (!lastElementInfo) {
      return;
    }

    const leftData = refScrollRecord.current.filter(
      item => item.groupId !== lastElementInfo.groupId,
    );
    leftData.unshift(lastElementInfo);
    leftData.splice(5);
    refScrollRecord.current = leftData;
  });
  useEffect(() => {
    if (!isNeedHack) {
      return;
    }
    try {
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
              const newElementInfo = getLastElementInfo();
              const oldElementInfo = refScrollRecord.current.find(
                item => item.groupId === newElementInfo?.groupId,
              );
              if (!oldElementInfo) {
                return;
              }

              const diff = Math.abs(
                Math.abs(newElementInfo.height - oldElementInfo.height) -
                  Math.abs(newElementInfo.scrollTop - oldElementInfo.scrollTop),
              );
              if (diff < 5) {
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
    } catch (err) {
      logger.error('useSafariAnchorHack useEffect err: ', err);
    }
  }, [viewEl]);
  return {
    onInitViewEl,
    onCollectScrollInfo,
  };
};
