import { showToast as showToastTaro, TaroStatic } from '@tarojs/taro';

import { type UIChatToastEvent, UIEventType } from '../types';

export const showToast = (
  options: UIChatToastEvent,
  targetEventCenter?: InstanceType<TaroStatic['Events']>,
) => {
  if (targetEventCenter) {
    targetEventCenter.trigger(UIEventType.ChatToastShow, options);
  } else if (typeof options?.content === 'string') {
    showToastTaro({
      title: options.content,
      icon: options.icon,
      duration: options.duration || 6000,
    });
  }
};
