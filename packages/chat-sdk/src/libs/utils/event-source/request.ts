import { isTT } from '../device';
import { WxEventSource } from './wx-event-source';
import { TTEventSource } from './tt-event-source';
import {
  EventSourceBase,
  type EventSourceProps,
  type IMessageEvent,
} from './event-source';

function getPromiseInfo() {
  let resolve: ((value: undefined) => void) | undefined = undefined;
  let reject: ((reason?: unknown) => void) | undefined = undefined;
  const promise = new Promise((resolveIn, rejectIn) => {
    resolve = resolveIn;
    reject = rejectIn;
  });
  return { resolve, reject, promise };
}

export async function* requestSSE(
  options: EventSourceProps,
): AsyncIterable<IMessageEvent> {
  const eventSource: EventSourceBase = isTT
    ? new TTEventSource(options)
    : new WxEventSource(options);
  let yieldPromise: Promise<unknown> | undefined = undefined;
  let resolve: ((value: unknown) => void) | undefined = undefined;
  let reject: ((reason?: unknown) => void) | undefined = undefined;
  let isDone = false;
  const messageList: IMessageEvent[] = [];
  eventSource.onMessage(data => {
    messageList.push(data);
    resolve?.(undefined);
  });
  eventSource.onClose(() => {
    resolve?.(undefined);
    isDone = true;
  });
  eventSource.onError(err => {
    reject?.(err);
    isDone = true;
  });
  eventSource.sendMessage();
  genNextPromise();
  let hsSendData = false;
  do {
    await yieldPromise;
    let hasDataToResolve = false;
    const messageListNow = messageList.splice(0);
    genNextPromise();
    for (const eventData of messageListNow) {
      if (eventData) {
        hsSendData = true;
        hasDataToResolve = true;
        yield eventData;
      }
    }

    if (isDone && !hasDataToResolve) {
      if (hsSendData) {
        yield {
          data: '[DONE]',
          event: 'done',
        };
      } else {
        throw new Error('EventSourceRequest has been closed');
      }
    }
    // eslint-disable-next-line
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
