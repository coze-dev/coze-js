import { isTT } from "../device";
import {
  EventSourceBase,
  type EventSourceProps,
  type IMessageEvent,
} from "./event-source";
import { TTEventSource } from "./tt-event-source";
import { WxEventSource } from "./wx-event-source";

function getPromiseInfo() {
  let resolve: ((value: undefined) => void) | undefined = undefined;
  let reject: ((reason?: any) => void) | undefined = undefined;
  const promise = new Promise((resolveIn, rejectIn) => {
    resolve = resolveIn;
    reject = rejectIn;
  });
  return { resolve, reject, promise };
}

export async function* requestSSE(
  options: EventSourceProps
): AsyncIterable<IMessageEvent> {
  const eventSource: EventSourceBase = isTT
    ? new TTEventSource(options)
    : new WxEventSource(options);
  let yieldPromise: Promise<unknown> | undefined = undefined;
  let resolve: ((value: unknown) => void) | undefined = undefined;
  let reject: ((reason?: any) => void) | undefined = undefined;
  let isDone = false;
  let messageList: IMessageEvent[] = [];
  eventSource.onOpen(() => {});
  eventSource.onMessage((data) => {
    messageList.push(data);
    resolve?.(undefined);
  });
  eventSource.onClose(() => {
    resolve?.(undefined);
    isDone = true;
  });
  eventSource.onError((err) => {
    reject?.(err);
    isDone = true;
  });
  eventSource.sendMessage();
  genNextPromise();
  do {
    await yieldPromise;
    const messageListNow = messageList.splice(0);
    genNextPromise();
    for (let eventData of messageListNow) {
      if (eventData) {
        yield eventData;
      }
    }
  } while (!isDone);

  function genNextPromise() {
    const {
      resolve: resolveInit,
      reject: rejectInit,
      promise: promiseInit,
    } = getPromiseInfo();
    yieldPromise = promiseInit;
    resolve = resolveInit;
    reject = rejectInit;
  }
}
