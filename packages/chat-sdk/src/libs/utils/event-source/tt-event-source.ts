import { logger } from "../logger";
import { EventSourceBase, MessageEvent } from "./event-source";
import { MiniChatError } from "@/libs/utils";

/**
 * 基于 tt.createEventSource 实现的 EventSource
 * 存在问题： 如果失败返回了json结构，会接收不到消息，直接失败。
 */
export class TTEventSource extends EventSourceBase {
  private ttClient;
  public close() {
    if (!super.close()) {
      return false;
    }
    this.ttClient?.close();
    return true;
  }

  protected async _sendMessage() {
    this.ttClient = tt.createEventSource({
      url: this.url,
      method: this.method as "POST" | "GET",
      header: this.header,
      timeout: 10 * 60 * 1000,
      data: this.data,
    });
    logger.debug("TTEventSource init", {
      url: this.url,
      method: this.method as "POST" | "GET",
      header: this.header,
      data: this.data,
    });
    this.ttClient.onOpen((...arg) => {
      logger.debug("TTEventSource onOpen", arg);
      this.event.trigger(MessageEvent.OPEN, {});
    });
    this.ttClient.onClose((...arg) => {
      logger.debug("TTEventSource onClose", arg);
      this.close();
    });
    this.ttClient.onError((errMsg) => {
      logger.debug("TTEventSource onError", errMsg);
      this.event.trigger(MessageEvent.ERROR, new MiniChatError(-1, errMsg));
    });
    this.ttClient.onMessage((data) => {
      logger.debug("TTEventSource onMessage", data);
      this.event.trigger(MessageEvent.MESSAGE, data);
    });
  }
}
