import { useCallback, useEffect, useRef } from 'react';

import { isWeb } from '@/libs/utils';

// Scroll的处理，导致Web上滚轮的方向是反的，因此需要处理
export const useWheelHandle = () => {
  const refScroll = useRef<HTMLDivElement | null>(null);
  const onWheelHandle = useCallback((event: WheelEvent) => {
    event.preventDefault();
    const { deltaY } = event;
    refScroll.current?.scrollBy(0, -deltaY);
  }, []);
  const onInitScrollRefForWheel = useCallback(el => {
    if (isWeb) {
      if (refScroll.current) {
        refScroll.current.removeEventListener('wheel', onWheelHandle);
      }
      if (el) {
        refScroll.current = el as HTMLDivElement;
        refScroll.current.addEventListener('wheel', onWheelHandle);
      }
    }
  }, []);
  useEffect(
    () => () => {
      if (isWeb) {
        refScroll.current?.removeEventListener('wheel', onWheelHandle);
      }
    },
    [],
  );
  return { onInitScrollRefForWheel };
};
