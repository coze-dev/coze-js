import { isTT, isWeapp, isWeb, logger } from '@/libs/utils';
import { RawMessageType, type RawMessage } from '@/libs/types';

import { type SendMessageOptions } from './send-message/raw-send-message';
import {
  MultiSendMessage,
  type ObjectStringItemMix,
} from './send-message/multi-send-message';
import { AsyncSendMessage } from './send-message/async-send-message';

export { RawMessageType, type RawMessage, type ObjectStringItemMix };

const isCanStream = isWeb || isTT || isWeapp;
export const getSendMessageHandler = (
  props: SendMessageOptions,
  isStream: boolean = isCanStream,
): MultiSendMessage => {
  if (!isStream) {
    logger.error('not support sync send message');
    throw new Error('not support sync send message');
  }
  return new AsyncSendMessage(props);
  /*
   * 暂不支持异步，后续有需要再补充钙内容
   */
  /*
  if (!isStream) {
    return new SyncSendMessage(props);
  } else {
    return new AsyncSendMessage(props);
  }*/
};
