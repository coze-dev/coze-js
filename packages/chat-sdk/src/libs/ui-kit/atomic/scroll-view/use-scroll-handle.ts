import { MutableRefObject, useRef } from 'react';

import { type ScrollViewProps } from '@tarojs/components';

import { isWeb } from '@/libs/utils';
import { usePersistCallback } from '@/libs/hooks';

export const useScrollHandle = ({
  scrollToAnchorBottom,
  onCollectScrollInfoInSafari,
  checkArrowDownVisible,
  onScrollToLower,
  reCheckToLower,
  lowerThreshold: lowerThresholdRaw,
  refScrollEl,
}: {
  scrollToAnchorBottom?: () => void;
  onCollectScrollInfoInSafari?: () => void;
  onScrollToLower?: ScrollViewProps['onScrollToLower'];
  lowerThreshold?: number;
  checkArrowDownVisible?: (scrollTopNum: number) => void;
  reCheckToLower?: () => void;
  refScrollEl: MutableRefObject<HTMLDivElement | null>;
}) => {
  const refScrollNow = useRef<number>(1);
  const refScrollToLowerTimeout = useRef<number>(0);
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
  const onScrollToLowerHandler = usePersistCallback(e => {
    if (refScrollToLowerTimeout.current) {
      clearTimeout(refScrollToLowerTimeout.current);
      refScrollToLowerTimeout.current = 0;
    }
    onScrollToLower?.(e);
    // 由于在头部加载，所以渲染会有延迟，因此在onScrollToLower 中距离上次发送必须有1500s的限制。
    // 但是有情况1500s的时候确实需要发送请求，这个时候页面会停留在加载中部分，无法发送，所以过2500s之后再次判断判断是否已到底部了，如果到底部就触发
    refScrollToLowerTimeout.current = setTimeout(() => {
      refScrollToLowerTimeout.current = 0;
      reCheckToLower?.();
    }, 1500) as unknown as number;
  });
  const onScrollHandle = usePersistCallback(e => {
    const scrollTopNum = e.detail.scrollTop;
    onRecordScrollTop?.(scrollTopNum);
    onCollectScrollInfoInSafari?.();
    checkArrowDownVisible?.(scrollTopNum);
    if (checkToLowerInWeb()) {
      onScrollToLowerHandler?.(e);
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
    onScrollToLowerHandle: !isWeb ? onScrollToLowerHandler : undefined,
    lowerThreshold,
    refScrollEl,
    onScrollHandle,
  };
};
