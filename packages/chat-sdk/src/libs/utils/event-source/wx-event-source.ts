import Taro, { request } from '@tarojs/taro';

import {
  EventSourceBase,
  MessageEvent,
  type IMessageEvent,
  EventJsonDataType,
} from './event-source';
import { logger } from '../logger';
import { TextDecoder } from '../decorder';

export class WxEventSource extends EventSourceBase {
  private task?: Taro.RequestTask<unknown>;
  private offTaskHandler?: () => void;
  private chunkedData = '';
  private dataType: 'stream' | 'json' | 'unknown' = 'unknown';

  protected _sendMessage() {
    this.task = request({
      url: this.url,
      method: this.method,
      header: this.header,
      data: this.data,
      enableChunked: true,
      enableCookie: true,
      timeout: 10 * 60 * 1000,
      fail: err => {
        this.event.trigger(MessageEvent.ERROR, err);
      },
      complete: () => {
        this.close();
      },
    });
    const destroyHeaderReceivedHandler = this.onHeadersReceived();
    const destroyChunkReceivedHandler = this.onChunkReceived();
    this.offTaskHandler = () => {
      destroyHeaderReceivedHandler();
      destroyChunkReceivedHandler();
    };
  }
  public close() {
    if (!super.close()) {
      return false;
    }
    this.task?.abort();
    this.offTaskHandler?.();
    return true;
  }
  private getDataType(header: Record<string, unknown>) {
    const [, contentTypeRaw] =
      Object.entries(header).find(([key]) => {
        if (key.toLowerCase() === 'content-type') {
          return true;
        }
        return false;
      }) || [];
    const contentType = (contentTypeRaw as string) || '';
    if (contentType?.includes('text/event-stream')) {
      return 'stream';
    } else if (contentType?.includes('application/json')) {
      return 'json';
    }

    return 'unknown';
  }
  private onHeadersReceived() {
    const func = res => {
      this.dataType = this.getDataType(res.header);
      this.event.trigger(MessageEvent.OPEN, res.header);
      logger.debug('onHeadersReceived', res.header);
    };
    this.task?.onHeadersReceived(func);
    return () => {
      this.task?.offHeadersReceived(func);
    };
  }
  private onChunkReceived() {
    const func = res => {
      const uint8Array = new Uint8Array(res.data);
      const textDecoder = new TextDecoder('utf-8');
      const data = textDecoder.decode(uint8Array);
      logger.debug('onChunkReceived raw data', data);
      logger.debug('onChunkReceived data type', this.dataType);
      if (this.dataType === 'json') {
        this.event.trigger(MessageEvent.MESSAGE, {
          event: EventJsonDataType,
          data,
        });
        return;
      }
      // 处理返回的json字符串
      this.chunkedData += data;
      if (data.slice(-2) === '\n\n') {
        const messageEvents = this.unpackData(this.chunkedData);
        messageEvents.map(message => {
          this.event.trigger(MessageEvent.MESSAGE, message);
        });
        this.chunkedData = '';
        logger.debug('onChunkReceived messageEvents', messageEvents);
      } else {
        logger.debug('onChunkReceived messageEvents is not complete');
      }
    };
    this.task?.onChunkReceived(func);
    return () => {
      this.task?.offChunkReceived(func);
    };
  }
  private unpackData(data: string): IMessageEvent[] {
    const lines = data.split('\n');
    const messageEvents: IMessageEvent[] = [];
    let i = 0;
    while (i < lines.length - 1) {
      if (lines[i].startsWith('event:') && lines[i + 1].startsWith('data:')) {
        const eventName = lines[i].slice(6).trim();
        const eventData = lines[i + 1].slice(5).trim();
        messageEvents.push({
          event: eventName,
          data: eventData,
        });
        i += 2;
      }
      i++;
    }
    return messageEvents;
  }
}
