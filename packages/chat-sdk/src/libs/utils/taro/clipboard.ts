import Taro from '@tarojs/taro';

import { logger } from '../logger';
import { isWeb } from '../device';

interface ClipboardProps {
  data: string;
  success?: (isUseWeb: boolean) => void;
  fail?: (err: { errMsg: string }, isUseWeb: boolean) => void;
}

export const setClipboardData = async ({
  data,
  success,
  fail,
}: ClipboardProps) => {
  if (isWeb) {
    try {
      await navigator.clipboard.writeText(data);
      success?.(true);
      return;
    } catch (_e) {
      logger.warn('setClipboardData fail');
    }
  }
  await Taro.setClipboardData({
    data,
    success: () => {
      success?.(false);
    },
    fail: err => {
      fail?.(err, false);
    },
  });
};
