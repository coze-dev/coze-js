/* eslint-disable @typescript-eslint/no-magic-numbers -- ignore */
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
  private cacheChunk = '';

  constructor(private options: RequestConfig) {
    super();
  }

  start() {
    const { url, method, headers, data, timeout } = this.options;
    this.task = Taro.request({
      url,
      method,
      header: headers,
      data,
      enableChunked: true,
      enableCookie: true,
      timeout,
      fail: err => {
        this.trigger(EventName.Fail, err.errMsg);
      },
      success: res => {
        if (res.statusCode !== 200) {
          this.trigger(EventName.Fail, res.errMsg);
        } else {
          this.trigger(EventName.Success, res);
        }
      },
    });

    this.onHeadersReceived();
    this.onChunkReceived();
  }

  abort() {
    if (!this.isAborted) {
      this.task?.abort();
      this.isAborted = true;
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
      this.cacheChunk += chunk;

      if (this.cacheChunk.endsWith('\n\n')) {
        const chunkStr = this.cacheChunk;
        this.cacheChunk = '';
        const messages: Array<Record<string, string>> = [];
        let message: Record<string, string> = {};
        const lines = chunkStr.split('\n');
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
      }
    });
  }
}
