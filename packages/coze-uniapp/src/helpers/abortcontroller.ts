import { Events } from '../types';

type EventListener = () => void;

export class AbortSignalPonyfill {
  private events = new Events();
  aborted = false;
  reason: unknown;

  onabort(reason?: unknown) {
    this.aborted = true;
    this.reason = reason;
    this.events.trigger('abort');
  }

  addEventListener(_: string, cb: EventListener) {
    this.events.on('abort', cb);
  }

  removeEventListener(_: string, cb?: EventListener) {
    this.events.off('abort', cb);
  }
}

export class AbortControllerPonyfill {
  signal = new AbortSignalPonyfill();

  abort(reason?: unknown) {
    this.signal.onabort(reason);
  }
}

// 在字节跳动小程序初始化期间globalThis是undefined
const supportAbortController =
  typeof (globalThis || window).AbortController === 'function';

export const AbortController = supportAbortController
  ? (globalThis || window).AbortController
  : AbortControllerPonyfill;
export const AbortSignal = supportAbortController
  ? (globalThis || window).AbortSignal
  : AbortSignalPonyfill;
