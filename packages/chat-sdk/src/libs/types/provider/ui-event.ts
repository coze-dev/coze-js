import { type TaroStatic } from "@tarojs/taro";
interface UiEventAction {}

interface UiEventState {
  event: InstanceType<TaroStatic["Events"]>;
}

export type UiEventStore = UiEventState & UiEventAction;
