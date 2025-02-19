import { TaroStatic, Events } from "@tarojs/taro";
import { MiniChatError } from "@/libs/utils";

export const EventJsonDataType = Symbol("eventJsonDataType");

export interface IMessageEvent {
  event: string | symbol;
  data: unknown;
}
export type OpenHandler = (headers: Record<string, string>) => void;
export type CloseHandler = () => void;
export type MessageHandler = (data: IMessageEvent) => void;
export type ErrorHandler = (err: MiniChatError) => void;
export interface EventSourceProps {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  header?: Record<string, unknown>;
  data?: string | Record<string, unknown> | Array<unknown>;
}
export enum MessageEvent {
  ERROR = "error",
  CLOSE = "close",
  OPEN = "open",
  MESSAGE = "message",
}

export class EventSourceBase {
  protected url: string;
  protected method: "GET" | "POST" | "PUT" | "DELETE";
  protected header: Record<string, unknown>;
  protected data?: string | Record<string, unknown> | Array<unknown>;

  protected isClosed: boolean = false;
  protected event: InstanceType<TaroStatic["Events"]> = new Events();

  constructor({ url, method = "GET", header = {}, data }: EventSourceProps) {
    this.url = url;
    this.method = method;
    this.header = header;
    this.data = data;
  }
  public sendMessage() {
    this._sendMessage();
  }
  protected _sendMessage() {
    throw new MiniChatError(-1, "not implemented");
  }
  public close() {
    if (this.isClosed) {
      return false;
    }
    this.isClosed = true;
    this.event.trigger(MessageEvent.CLOSE);
    this.event.off();
    return true;
  }
  public onError(onError: ErrorHandler) {
    this.event.on(MessageEvent.ERROR, (err) => {
      onError(new MiniChatError(-1, err.errMsg));
    });
  }
  public onClose(onClose: CloseHandler) {
    this.event.on(MessageEvent.CLOSE, onClose);
  }
  public onMessage(onMessage: MessageHandler) {
    this.event.on(MessageEvent.MESSAGE, onMessage);
  }
  public onOpen(onOpen: OpenHandler) {
    this.event.on(MessageEvent.OPEN, onOpen);
  }
}
