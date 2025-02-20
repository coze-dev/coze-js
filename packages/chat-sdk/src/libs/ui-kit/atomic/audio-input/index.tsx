import { FC, PropsWithChildren } from 'react';

import cls from 'classnames';
import { TaroStatic } from '@tarojs/taro';
import { Button } from '@tarojs/components';

import { useAudioRecord, type InputTriggerType } from './use-audio-record';

import styles from './index.module.less';
export { type InputTriggerType };
interface AudioInputProps {
  className?: string;
  onTouching?: (type?: InputTriggerType) => void;
  onOutside?: (isOutSide: boolean) => void;
  onEnd?: () => void;
  frameEventTarget?: InstanceType<TaroStatic['Events']>; // 用于监听chat组件的keydown方法
  isPcMode?: boolean;
  disabled?: boolean;
}
export const AudioInput: FC<PropsWithChildren<AudioInputProps>> = ({
  className,
  onTouching,
  onEnd,
  onOutside,
  children,
  frameEventTarget,
  isPcMode,
  disabled,
}) => {
  const {
    onInitRefForAudioRecord,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
  } = useAudioRecord({
    onTouching,
    onOutside,
    onEnd,
    frameEventTarget,
    isPcMode,
    disabled,
  });

  return (
    <Button
      // coze-audio-input-button，用于监听chat组件的keydown方法
      className={cls(styles.container, className, 'coze-audio-input-button')}
      ref={onInitRefForAudioRecord}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchCancel}
    >
      {children}
    </Button>
  );
};
