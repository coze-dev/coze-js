import { useEffect } from 'react';

import { isWeb, logger } from '@/libs/utils';
import { UIEventType } from '@/libs/types';
import { useUiEventStore } from '@/libs/provider/context/chat-store-context';

export const useWebKeyboardHandle = (chatFrameId: string) => {
  const frameTarget = useUiEventStore(store => store.event);
  useEffect(() => {
    if (isWeb && chatFrameId) {
      const el = document.getElementById(chatFrameId);
      let isFocused = false;
      if (el) {
        const onKeyDown = (e: KeyboardEvent) => {
          logger.debug('Frame Target keydown');
          frameTarget.trigger(UIEventType.KeyDown, {
            chatFrameId,
            code: e.code,
          });
        };
        const onKeyUp = (e: KeyboardEvent) => {
          logger.debug('Frame Target keyup', e);
          frameTarget.trigger(UIEventType.KeyUp, {
            chatFrameId,
            code: e.code,
          });
        };
        const onFocus = () => {
          logger.debug('Frame Target focus');
          isFocused = true;
          frameTarget.trigger(UIEventType.FrameFocus, {
            chatFrameId,
          });
        };
        const onBlur = () => {
          logger.debug('Frame Target  blur');
          isFocused = false;
          frameTarget.trigger(UIEventType.FrameBlur, {
            chatFrameId,
          });
        };
        const triggerFocus = () => {
          el.focus();
          // 已经focus了，不会再次出发，因此需要手动触发focus事件
          if (isFocused) {
            onFocus?.();
          }
        };
        el.addEventListener('keydown', onKeyDown);
        el.addEventListener('keyup', onKeyUp);
        el.addEventListener('focus', onFocus);
        el.addEventListener('blur', onBlur);
        frameTarget.on(UIEventType.TriggerFocus, triggerFocus);

        el.setAttribute('tabindex', '0');
        setTimeout(() => {
          el.focus();
        }, 1000);

        return () => {
          el.removeEventListener('keydown', onKeyDown);
          el.removeEventListener('keyup', onKeyUp);
          el.removeEventListener('focus', onFocus);
          el.removeEventListener('blur', onBlur);
          frameTarget.off(UIEventType.TriggerFocus, triggerFocus);
        };
      }
    }
  }, [chatFrameId]);
};
