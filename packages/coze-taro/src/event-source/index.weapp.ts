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
        this.trigger(EventName.Fail, { errMsg: err.errMsg });
      },
      success: res => {
        if (res.statusCode !== 200) {
          this.trigger(EventName.Fail, { errMsg: res.errMsg, data: res });
        } else {
          this.trigger(EventName.Success, { data: res });
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
      this.trigger(EventName.Open, { data: res });
    });
  }

  private onChunkReceived() {
    this.task?.onChunkReceived(res => {
      const octets = new Uint8Array(res.data);
      const decoder = new TextDecoder();
      const chunk = decoder.decode(octets);

      // The request may be failed, so we need to check the chunk
      if (!this.cacheChunk) {
        const chunkJson = this.safeParseJSON(chunk);
        if (chunkJson && chunkJson.code) {
          this.trigger(EventName.Fail, {
            errMsg: chunkJson.msg,
            data: chunkJson,
          });
          // Abort the request
          this.abort();
          return;
        }
      }

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
          this.trigger(EventName.Chunk, { data: msg });
        });
      }
    });
  }

  private safeParseJSON(str: string) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  }
}
