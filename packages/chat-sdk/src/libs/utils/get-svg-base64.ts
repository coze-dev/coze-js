import Taro from '@tarojs/taro';

import { logger } from './logger';
import { TextEncoder } from './decorder';
export const getSvgBase64 = (svg: string) => {
  try {
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(svg) as unknown as ArrayBuffer;

    const bases = Taro.arrayBufferToBase64(uint8Array);
    return `data:image/svg+xml;base64,${bases}`;
  } catch (error) {
    logger.error('getSvgBase64 Error', error);
    return '';
  }
};
