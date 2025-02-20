import { useEffect } from 'react';

import Taro, { useDidHide } from '@tarojs/taro';

import { isWeapp } from '@/libs/utils';
import { usePersistCallback } from '@/libs/hooks';

import { IChatInputProps } from '../type';

const isSupportKeyBoardHeight = isWeapp;

export const useKeyboardHeightHandle = (chatInputProps: IChatInputProps) => {
  const { onKeyBoardHeightChange } = chatInputProps;
  const onKeyBoardHeightChangeHandle = usePersistCallback((height: number) => {
    if (isSupportKeyBoardHeight) {
      onKeyBoardHeightChange?.(height);
    }
  });
  useDidHide(() => {
    // 隐藏到后台的时候，默认键盘会收起，设置为0
    onKeyBoardHeightChangeHandle?.(0);
  });

  useEffect(() => {
    if (isSupportKeyBoardHeight) {
      Taro?.onKeyboardHeightChange?.(res => {
        if (res.height === 0) {
          onKeyBoardHeightChangeHandle?.(0);
          return;
        }
        onKeyBoardHeightChangeHandle?.(res.height);
      });
    }
  }, []);

  return {
    onKeyBoardHeightChange: onKeyBoardHeightChangeHandle,
  };
};
