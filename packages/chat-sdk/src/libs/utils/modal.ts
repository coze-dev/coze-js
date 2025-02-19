import { TaroStatic } from "@tarojs/taro";
import { type UIModalEvent, UIEventType } from "../types";
import { logger } from "./logger";

export const showModal = (
  modalEvent: UIModalEvent,
  targetEventCenter?: InstanceType<TaroStatic["Events"]>
) => {
  if (!targetEventCenter) {
    logger.warn("showModal targetEventCenter is undefined");
    return;
  }
  targetEventCenter.trigger(UIEventType.ChatModalShow, modalEvent);
};
