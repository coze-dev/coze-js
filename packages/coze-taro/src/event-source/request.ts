/* eslint-disable @typescript-eslint/no-magic-numbers -- ignore */
import { type AxiosResponseHeaders } from 'axios';
import { getEnv } from '@tarojs/taro';
import { APIError, type ErrorRes } from '@coze/api';

import { Deferred } from '../helpers/async';
import { type RequestConfig, EventName } from './types';
import { EventSource as EventSourceWeapp } from './index.weapp';
import { EventSource as EventSourceTT } from './index.tt';
import { EventSource } from './index';

const ES =
  getEnv() === 'TT'
    ? EventSourceTT
    : getEnv() === 'WEAPP'
      ? EventSourceWeapp
      : EventSource;

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

  const eventSource = new ES(config)
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
      const data = (msg.data as Record<string, unknown>) || {};
      data.error = data.error || data.detail;
      const error = APIError.generate(
        200,
        data as unknown as ErrorRes,
        msg.errMsg,
        {
          'x-tt-logid': (data as unknown as ErrorRes).error?.logid,
        } as unknown as AxiosResponseHeaders,
      );
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
