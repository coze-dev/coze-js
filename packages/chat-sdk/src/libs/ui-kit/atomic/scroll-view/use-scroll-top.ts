import { useEffect, useRef, useState } from 'react';

import { isWeb, logger } from '@/libs/utils';
import { usePersistCallback } from '@/libs/hooks';

export const useScrollTop = () => {
  const [scrollTop, setScrollTop] = useState<number | undefined>(0);
  const refSetScrollTimeout = useRef<number | undefined>(undefined);
  const refScrollEl = useRef<HTMLDivElement | null>(null);

  const scrollToTop = usePersistCallback((top: number) => {
    if (isWeb) {
      setScrollTop(0 - Math.abs(top));
    } else {
      setScrollTop(Math.abs(top));
    }
  });
  const delayToSetScroll = usePersistCallback(
    (scrollTopNum: number, timeoutNumber: number | undefined = 0) => {
      if (refSetScrollTimeout.current) {
        clearTimeout(refSetScrollTimeout.current);
      }
      if (timeoutNumber <= 0) {
        scrollToTop(scrollTopNum);
        return;
      } else {
        refSetScrollTimeout.current = setTimeout(() => {
          scrollToTop(scrollTopNum);
        }, timeoutNumber) as unknown as number;
      }
    },
  );
  const scrollToAnchorBottom = usePersistCallback(() => {
    if (scrollTop !== 0) {
      delayToSetScroll(0);
    } else {
      delayToSetScroll(1);
      // 先设置1居于底部，然后设置为0， 锚定在底部
      // 由于scrollTop为0，如果直接设置为0，不能出发锚定。
      delayToSetScroll(0, 200);
    }
  });
  const onInitScrollEl = usePersistCallback((el: HTMLDivElement) => {
    refScrollEl.current = el;
  });

  useEffect(
    () => () => {
      if (refSetScrollTimeout.current) {
        clearTimeout(refSetScrollTimeout.current);
      }
    },
    [scrollTop],
  );
  logger.debug('useScrollTop', { scrollTop });

  return {
    scrollTop,
    scrollToTop,
    delayToSetScroll,
    scrollToAnchorBottom,
    onInitScrollEl,
    refScrollEl,
  };
};
