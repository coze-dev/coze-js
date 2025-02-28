import { MutableRefObject, useRef } from 'react';

import { type ScrollViewProps } from '@tarojs/components';

import { isWeb } from '@/libs/utils';
import { usePersistCallback } from '@/libs/hooks';

export const useScrollHandle = ({
  scrollToAnchorBottom,
  onCollectScrollInfoInSafari,
  checkArrowDownVisible,
  onScrollToLower,
  lowerThreshold: lowerThresholdRaw,
  refScrollEl,
}: {
  scrollToAnchorBottom?: () => void;
  onCollectScrollInfoInSafari?: () => void;
  onScrollToLower?: ScrollViewProps['onScrollToLower'];
  lowerThreshold?: number;
  checkArrowDownVisible?: (scrollTopNum: number) => void;
  refScrollEl: MutableRefObject<HTMLDivElement | null>;
}) => {
  const refScrollNow = useRef<number>(1);
  const lowerThreshold = Math.max(lowerThresholdRaw ?? 100, 10);
  const onRecordScrollTop = usePersistCallback((scrollTopNum: number) => {
    refScrollNow.current = Math.abs(scrollTopNum);
    if (isWeb) {
      if (scrollTopNum > 0) {
        // web的时候， scroll 只会为复制， 如果大于0， 需重置为0；
        scrollToAnchorBottom?.();
      }
    }
  });
  const onScrollHandle = usePersistCallback(e => {
    const scrollTopNum = e.detail.scrollTop;
    onRecordScrollTop?.(scrollTopNum);
    onCollectScrollInfoInSafari?.();
    checkArrowDownVisible?.(scrollTopNum);
    if (checkToLowerInWeb()) {
      onScrollToLower?.(e);
    }
  });

  const checkToLowerInWeb = usePersistCallback(() => {
    const scrollHeight = Number(refScrollEl.current?.offsetHeight);
    const scrollInnerHeight = Number(refScrollEl.current?.scrollHeight);
    if (scrollInnerHeight > 0 && scrollHeight > 0 && refScrollNow.current > 0) {
      if (
        scrollInnerHeight - refScrollNow.current - scrollHeight <
        lowerThreshold
      ) {
        return true;
      }
    }
    return false;
  });

  return {
    refScrollNow,
    onScrollToLowerHandle: !isWeb ? onScrollToLower : undefined,
    lowerThreshold,
    refScrollEl,
    onScrollHandle,
  };
};
