import {
  FC,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import cls from 'classnames';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

import { isWeb } from '@/libs/utils';
import { UIEventType } from '@/libs/types';

import styles from './index.module.less';

let toolTipId = 1000;
const toolTipEvent = new Taro.Events();
const clickToolTipEvent = 'click_tooltip';
export const Tooltip: FC<
  PropsWithChildren<{
    content?: ReactNode;
    type?: 'hover' | 'longtap';
    direction?: 'top' | 'bottom';
    isActive?: boolean;
  }>
> = ({ children, content, type = 'hover', isActive, direction = 'bottom' }) => {
  const [isShow, setIsShow] = useState(false);
  const containerId = useMemo(() => `tooltip_${toolTipId++}`, []);
  useEffect(() => {
    const onHideToolTip = () => {
      setIsShow(false);
    };
    const onClickToolTipHandler = ({ id }) => {
      if (id !== containerId) {
        setIsShow(false);
      }
    };
    if (isWeb) {
      document.addEventListener('click', onHideToolTip);
    }

    toolTipEvent.on(clickToolTipEvent, onClickToolTipHandler);
    Taro.eventCenter.on(UIEventType.FrameClick, onHideToolTip);
    return () => {
      if (isWeb) {
        document.removeEventListener('click', onHideToolTip);
      }
      toolTipEvent.off(clickToolTipEvent, onClickToolTipHandler);
      Taro.eventCenter.off(UIEventType.FrameClick, onHideToolTip);
    };
  }, []);
  return (
    <View
      id={containerId}
      className={cls(styles.tooltip, {
        [styles.hover]: type === 'hover' && isActive,
        [styles.click]: type !== 'hover' && isActive,
        [styles[direction]]: !!styles[direction],
      })}
      onLongPress={() => {
        if (isActive) {
          setIsShow(true);
          toolTipEvent.trigger(clickToolTipEvent, {
            id: containerId,
          });
        }
      }}
      onClick={event => {
        if (isActive) {
          event.stopPropagation();
          setIsShow(true);
          toolTipEvent.trigger(clickToolTipEvent, {
            id: containerId,
          });
        }
      }}
    >
      {children}
      {isActive ? (
        <View
          className={cls(styles.content, {
            [styles.show]: isShow,
          })}
        >
          {content}
        </View>
      ) : null}
    </View>
  );
};
