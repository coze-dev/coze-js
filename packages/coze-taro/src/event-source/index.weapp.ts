/* eslint-disable security/detect-object-injection -- ignore */
import Taro from '@tarojs/taro';

import { TextDecoder } from '../helpers/decoder';
import { type RequestConfig, EventName } from './types';
import { BaseEventSource } from './base';

/**
 * Process streaming requests for WeChat Mini Program
 */
export class EventSource extends BaseEventSource {
  private task?: Taro.RequestTask<unknown>;
  private isAborted = false;

  constructor(private options: RequestConfig) {
    super();
  }

  start() {
    const { url, method, headers, data } = this.options;
    this.task = Taro.request({
      url,
      method,
      header: headers,
      data,
      enableChunked: true,
      enableCookie: true,
      fail: err => {
        this.trigger(EventName.Fail, new Error(err.errMsg));
      },
      success: res => {
        this.trigger(EventName.Success, res);
      },
    });
    this.onHeadersReceived();
    this.onChunkReceived();
  }

  abort() {
    if (!this.isAborted) {
      this.task?.abort();
    }
  }

  private onHeadersReceived() {
    this.task?.onHeadersReceived(res => {
      this.trigger(EventName.Open, res);
    });
  }

  private onChunkReceived() {
    this.task?.onChunkReceived(res => {
      const octets = new Uint8Array(res.data);
      const decoder = new TextDecoder();
      const chunk = decoder.decode(octets);

      const messages: Array<Record<string, string>> = [];
      let message: Record<string, string> = {};
      const lines = chunk.split('\n');
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i];

        const index = line.indexOf(':');
        if (index !== -1) {
          const field = line.substring(0, index).trim();
          const content = line.substring(index + 1).trim();
          message[field] = content;
          if (field === 'data') {
            messages.push(message);
            message = {};
          }
        }
      }

      messages.map(msg => {
        this.trigger(EventName.Chunk, msg);
      });
    });
  }
}
