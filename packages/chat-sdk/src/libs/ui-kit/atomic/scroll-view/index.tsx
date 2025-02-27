import {
  ForwardedRef,
  forwardRef,
  memo,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
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
        lowerThreshold,
        onScrollToLower,
        ...restProps
      }: ScrollViewType & {
        checkArrowDownVisible?: (scrollTop: number) => void;
      },
      ref: ForwardedRef<ScrollViewRef>,
    ) => {
      const refScrollEl = useRef<HTMLDivElement | null>(null);
      const [scrollTop, setScrollTop] = useState<number | undefined>(0);
      const refAnchorBottom = useRef<boolean>(false);
      const refScrollNow = useRef<number>(1);
      const { onInitViewEl, onCollectScrollInfo } = useSafariAnchorHack({
        refAnchorBottom,
        refScrollEl,
      });
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
      const onScrollHandle = usePersistCallback(e => {
        const scrollTopNum = e.detail.scrollTop;
        refScrollNow.current = Math.abs(e.detail.scrollTop);
        onCollectScrollInfo();

        checkArrowDownVisible?.(refScrollNow.current);
        if (isWeb) {
          if (scrollTopNum > 0) {
            // web的时候， scroll 只会为复制， 如果大于0， 需重置为0；
            scrollToAnchorBottom();
          }
          // Web需判断是否居于底部
          const scrollHeight = Number(refScrollEl.current?.offsetHeight);
          const scrollInnerHeight = Number(refScrollEl.current?.scrollHeight);
          if (
            scrollInnerHeight > 0 &&
            scrollHeight > 0 &&
            refScrollNow.current > 0
          ) {
            if (
              scrollInnerHeight - refScrollNow.current - scrollHeight <
              (lowerThreshold || 100)
            ) {
              onScrollToLower?.(e);
            }
          }
        }
      });
      const refSetScrollTimeout = useRef<number | undefined>(undefined);

      const delayToSetScroll = usePersistCallback(
        (scrollTopNum: number, timeoutNumber: number | undefined = 0) => {
          if (refSetScrollTimeout.current) {
            clearTimeout(refSetScrollTimeout.current);
          }
          if (timeoutNumber <= 0) {
            setScrollTop(scrollTopNum);
            return;
          } else {
            refSetScrollTimeout.current = setTimeout(() => {
              setScrollTop(scrollTopNum);
            }, timeoutNumber) as unknown as number;
          }
        },
      );

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
            if (scrollTop !== 1) {
              delayToSetScroll(1);
            } else {
              delayToSetScroll(2);
            }
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
              // 防止内容未渲染完成，改处已经制定了修改，导致新内容未能锚定底部，预防措施
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
          lowerThreshold={isWeb ? undefined : lowerThreshold}
          onScrollToLower={isWeb ? undefined : onScrollToLower}
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
