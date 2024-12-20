import { Deferred } from '../helpers/async';
import { type RequestConfig, EventName } from './types';
import { EventSource } from './index';

export function sendRequest<Message>(
  config: RequestConfig,
  result: {
    messages: Array<Message>;
    done: boolean;
    deferred: Deferred | null;
    error: Error | null;
  },
) {
  result.deferred = new Deferred();
  result.done = false;

  const eventSource = new EventSource(config)
    .on(EventName.Chunk, msg => {
      result.messages.push(msg.data as Message);
      result.deferred?.resolve(msg.data);
      result.deferred = new Deferred();
    })
    .on(EventName.Success, msg => {
      result.done = true;
      result.deferred?.resolve(msg);
    })
    .on(EventName.Fail, msg => {
      const error = new Error(msg.errMsg);
      result.done = true;
      result.error = error;
      result.deferred?.reject(error);
    });

  if (config.signal) {
    config.signal.addEventListener?.('abort', () => {
      eventSource.abort();
    });
  }

  eventSource.start();
}
