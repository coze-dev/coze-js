import {
  ForwardedRef,
  forwardRef,
  memo,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';

import cls from 'classnames';
import {
  ScrollView as TaroScrollView,
  View,
  type ScrollViewProps,
} from '@tarojs/components';

import { isWeb, logger } from '@/libs/utils';
import { usePersistCallback } from '@/libs/hooks';

import { SvgArrowUp } from '../svg';
import { IconButton } from '../icon-button';
import { useScrollTop } from './use-scroll-top';
import { useScrollHandle } from './use-scroll-handle';
import { useSafariAnchorHack } from './use-safari-anchor-hack';
import { useHelperButton } from './use-helper-button';

import styles from './index.module.less';
type ScrollViewType = Omit<ScrollViewProps, 'ref'> & {
  isLoadMore?: boolean;
};
export interface ScrollViewRef {
  scrollToBottom: () => void;
  scrollToAnchorBottom: () => void;
  removeAnchorBottom: () => void;
}

const TaroScrollViewMemo = memo(TaroScrollView);

const ScrollViewSlot = memo(
  forwardRef(
    (
      {
        id,
        children,
        isLoadMore,
        checkArrowDownVisible,
        lowerThreshold: lowerThresholdRaw,
        onScrollToLower,
        ...restProps
      }: ScrollViewType & {
        checkArrowDownVisible?: (scrollTop: number) => void;
      },
      ref: ForwardedRef<ScrollViewRef>,
    ) => {
      const {
        scrollTop,
        delayToSetScroll,
        scrollToAnchorBottom,
        onInitScrollEl,
        refScrollEl,
      } = useScrollTop();

      const refAnchorBottom = useRef<boolean>(false);
      const { onInitViewEl, onCollectScrollInfo } = useSafariAnchorHack({
        refAnchorBottom,
        refScrollEl,
      });
      const reCheckToLower = usePersistCallback(() => {
        if (refScrollNow.current > 100) {
          delayToSetScroll(refScrollNow.current - 0.5);
        }
      });
      const {
        refScrollNow,
        onScrollToLowerHandle,
        lowerThreshold,
        onScrollHandle,
      } = useScrollHandle({
        refScrollEl,
        scrollToAnchorBottom,
        onCollectScrollInfoInSafari: onCollectScrollInfo,
        checkArrowDownVisible,
        onScrollToLower,
        lowerThreshold: lowerThresholdRaw,
        reCheckToLower,
      });

      useLayoutEffect(() => {
        if (isLoadMore) {
          delayToSetScroll(refScrollNow.current + 2);
        }
      }, [isLoadMore]);

      useImperativeHandle(
        ref,
        () => ({
          scrollToBottom: () => {
            logger.debug('ScrollView, scrollToBottom', { scrollTop });
            scrollToAnchorBottom();
          },
          scrollToAnchorBottom: () => {
            // 如果重复设置0的话，不会生效，因此如果是0的时候，需要先设置1，然后再设置锚定位置0
            logger.debug('ScrollView, scrollToAnchorBottom', { scrollTop });
            refAnchorBottom.current = true;
            scrollToAnchorBottom();
          },
          removeAnchorBottom: () => {
            logger.debug('ScrollView, removeAnchorBottom', {
              currentTop: refScrollNow.current,
              scrollTop,
            });
            refAnchorBottom.current = false;
            if (refScrollNow.current === 0 && scrollTop === 0) {
              // 防止内容未渲染完成，已经完成了修改，导致新内容未能锚定底部，预防措施
              delayToSetScroll(1, 50);
            }
          },
        }),
        [scrollTop],
      );
      const chatScrollContent = useMemo(
        () => (
          // 防止  scrollView 重新渲染，导致重新设置scrollTop。
          <View className={cls(styles.children)} ref={onInitViewEl}>
            {children}
          </View>
        ),
        [children],
      );

      return (
        <TaroScrollViewMemo
          {...restProps}
          id={id}
          ref={onInitScrollEl}
          scrollTop={scrollTop}
          lowerThreshold={lowerThreshold}
          onScrollToLower={onScrollToLowerHandle}
          reverse={false}
          showScrollbar={false}
          enhanced={true}
          className={cls(styles.scroll, {
            [styles['scroll-web']]: isWeb,
          })}
          onScroll={onScrollHandle}
        >
          {chatScrollContent}
        </TaroScrollViewMemo>
      );
    },
  ),
);

export const ScrollView = forwardRef(
  (
    {
      className,
      isNeedHelper,
      children,
      ...restProps
    }: ScrollViewType & {
      isNeedHelper?: boolean;
    },
    ref: ForwardedRef<ScrollViewRef>,
  ) => {
    const { arrowDownVisible, checkArrowDownVisible, setArrowDownVisible } =
      useHelperButton(isNeedHelper);
    const refScroll = useRef<ScrollViewRef>(null);

    useImperativeHandle(
      ref,
      () => ({
        scrollToBottom: () => {
          refScroll.current?.scrollToBottom();
        },
        scrollToAnchorBottom: () => {
          refScroll.current?.scrollToAnchorBottom();
        },
        removeAnchorBottom: () => {
          refScroll.current?.removeAnchorBottom();
        },
      }),
      [],
    );
    return (
      <View className={cls(styles.container, className)}>
        <ScrollViewSlot
          {...restProps}
          checkArrowDownVisible={checkArrowDownVisible}
          ref={refScroll}
        >
          {children}
        </ScrollViewSlot>
        <IconButton
          type="circle-btn"
          size="large"
          className={cls(styles['arrow-down'], {
            [styles['arrow-down--show']]: arrowDownVisible,
          })}
          onClick={() => {
            logger.debug(
              'ScrollView, arrowDownVisible, onClick',
              refScroll.current,
            );
            if (refScroll.current) {
              refScroll?.current?.scrollToBottom();
              setArrowDownVisible(false);
            }
          }}
        >
          <SvgArrowUp />
        </IconButton>
      </View>
    );
  },
);
