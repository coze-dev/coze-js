import { logger } from '@/libs/utils';

import { useChatPropsStore } from '../context';

export const useChatMaxWidth = () => {
  const maxWidth = useChatPropsStore(store => {
    logger.debug(
      'ChatSlot useChatPropsStore...',
      store.ui?.chatSlot?.base?.maxWidth,
    );
    return store.ui?.chatSlot?.base?.maxWidth;
  });
  if (!maxWidth) {
    return undefined;
  }
  const num = Number(maxWidth);
  if (!num) {
    return undefined;
  }
  return Math.max(300, num);
};
