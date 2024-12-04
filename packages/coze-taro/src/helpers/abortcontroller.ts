import { Events } from '@tarojs/taro';

type EventListener = () => void;

class AbortSignalPonyfill {
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

class AbortControllerPonyfill {
  signal = new AbortSignalPonyfill();

  abort(reason?: unknown) {
    this.signal.onabort(reason);
  }
}

const supportAbortController = typeof globalThis.AbortController === 'function';

export const AbortController = supportAbortController
  ? globalThis.AbortController
  : AbortControllerPonyfill;
export const AbortSignal = supportAbortController
  ? globalThis.AbortSignal
  : AbortSignalPonyfill;
