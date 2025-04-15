/* eslint-disable @typescript-eslint/no-magic-numbers -- ignore */
import { type AxiosResponseHeaders } from 'axios';
import { APIError, type ErrorRes } from '@coze/api';

import { Deferred } from '../helpers/async';
import { type RequestConfig, EventName } from './types';
import { EventSource as EventSourceWeapp } from './index.weapp';
import { EventSource as EventSourceTT } from './index.tt';
import { EventSource } from './index';

// 根据UniApp环境选择合适的EventSource实现
const getEventSource = () => {
  // 如果在web环境，返回默认EventSource
  if (
    typeof uni === 'undefined' ||
    uni.getSystemInfoSync().uniPlatform === 'web'
  ) {
    return EventSource;
  }

  // 根据系统信息判断平台类型
  const systemInfo = uni.getSystemInfoSync();
  if (systemInfo.hostName === 'Douyin' || systemInfo.hostName === 'Toutiao') {
    return EventSourceTT;
  } else if (systemInfo.hostName === 'WeChat') {
    return EventSourceWeapp;
  }

  // 默认返回标准EventSource
  return EventSource;
};

// 使用函数调用以便每次都获取最新环境
const ES = getEventSource();

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
