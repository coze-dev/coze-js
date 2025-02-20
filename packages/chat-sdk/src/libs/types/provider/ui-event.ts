import { type TaroStatic } from '@tarojs/taro';

interface UiEventState {
  event: InstanceType<TaroStatic['Events']>;
}

export type UiEventStore = UiEventState & {
  getEvent: () => InstanceType<TaroStatic['Events']>;
};
