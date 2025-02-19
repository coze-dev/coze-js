import {
  ForwardedRef,
  forwardRef,
  memo,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import cls from "classnames";
import {
  ScrollView as TaroScrollView,
  View,
  type ScrollViewProps,
} from "@tarojs/components";

import styles from "./index.module.less";
import { useWheelHandle } from "./use-wheel-handle";
import { IconButton } from "../icon-button";
import { SvgArrowUp } from "../svg";
import { useHelperButton } from "./use-helper-button";
import { logger } from "@/libs/utils";
import { usePersistCallback } from "@/libs/hooks";
type ScrollViewType = Omit<ScrollViewProps, "ref"> & {
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
        ...restProps
      }: ScrollViewType & {
        checkArrowDownVisible?: (scrollTop: number) => void;
      },
      ref: ForwardedRef<ScrollViewRef>
    ) => {
      const [scrollTop, setScrollTop] = useState<number | undefined>(0);
      const refScrollNow = useRef<number>(1);
      const { onInitScrollRefForWheel } = useWheelHandle();
      const onScrollHandle = usePersistCallback((e) => {
        refScrollNow.current = e.detail.scrollTop;
        checkArrowDownVisible?.(e.detail.scrollTop);
      });
      const refSetScrollTimeout = useRef<number | undefined>(undefined);

      const delayToSetScroll = usePersistCallback(
        (scrollTop: number, timeoutNumber: number | undefined = 0) => {
          if (refSetScrollTimeout.current) {
            clearTimeout(refSetScrollTimeout.current);
          }
          if (timeoutNumber <= 0) {
            setScrollTop(scrollTop);
            return;
          } else {
            refSetScrollTimeout.current = setTimeout(() => {
              setScrollTop(scrollTop);
            }, timeoutNumber) as unknown as number;
          }
        }
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
            logger.debug("ScrollView, scrollToBottom", { scrollTop });
            if (scrollTop !== 1) {
              delayToSetScroll(1);
            } else {
              delayToSetScroll(2);
            }
          },
          scrollToAnchorBottom: () => {
            // 如果重复设置0的话，不会生效，因此如果是0的时候，需要先设置1，然后再设置锚定位置0
            logger.debug("ScrollView, scrollToAnchorBottom", { scrollTop });
            if (scrollTop !== 0) {
              delayToSetScroll(0);
            } else {
              delayToSetScroll(1);
              // 先设置1居于底部，然后设置为0， 锚定在底部
              // 由于scrollTop为0，如果直接设置为0，不能出发锚定。
              delayToSetScroll(0, 200);
            }
          },
          removeAnchorBottom: () => {
            logger.debug("ScrollView, removeAnchorBottom", {
              currentTop: refScrollNow.current,
              scrollTop,
            });
            if (refScrollNow.current === 0 && scrollTop === 0) {
              // 防止内容未渲染完成，改处已经制定了修改，导致新内容未能锚定底部，预防措施
              delayToSetScroll(1, 50);
            }
          },
        }),
        [scrollTop]
      );
      const chatScrollContent = useMemo(() => {
        // 防止  scrollView 重新渲染，导致重新设置scrollTop。
        return <View className={cls(styles.children)}>{children}</View>;
      }, [children]);
      logger.debug("ScrollView, render", {
        currentTop: refScrollNow.current,
        scrollTop,
      });
      return (
        <TaroScrollViewMemo
          {...restProps}
          id={id}
          scrollTop={scrollTop}
          ref={onInitScrollRefForWheel}
          reverse={false}
          showScrollbar={false}
          enhanced={true}
          className={styles.scroll}
          onScroll={onScrollHandle}
        >
          {chatScrollContent}
        </TaroScrollViewMemo>
      );
    }
  )
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
    ref: ForwardedRef<ScrollViewRef>
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
      []
    );
    logger.debug("ScrollView, arrowDownVisible", arrowDownVisible);
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
          className={cls(styles["arrow-down"], {
            [styles["arrow-down--show"]]: arrowDownVisible,
          })}
          onClick={() => {
            logger.debug(
              "ScrollView, arrowDownVisible, onClick",
              refScroll.current
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
  }
);
