import { RealtimeError, RealtimeAPIError } from './error';

export enum EventNames {
  /**
   * en: All events
   * zh: 所有事件
   */
  ALL = 'realtime.event',
  /**
   * en: All client events
   * zh: 所有客户端事件
   */
  ALL_CLIENT = 'client.*',
  /**
   * en: All server events
   * zh: 所有服务端事件
   */
  ALL_SERVER = 'server.*',
  /**
   * en: Client connected
   * zh: 客户端连接
   */
  CONNECTED = 'client.connected',
  /**
   * en: Client interrupted
   * zh: 客户端中断
   */
  INTERRUPTED = 'client.interrupted',
  /**
   * en: Client disconnected
   * zh: 客户端断开
   */
  DISCONNECTED = 'client.disconnected',
  /**
   * en: Client audio unmuted
   * zh: 客户端音频未静音
   */
  AUDIO_UNMUTED = 'client.audio.unmuted',
  /**
   * en: Client audio muted
   * zh: 客户端音频静音
   */
  AUDIO_MUTED = 'client.audio.muted',
  /**
   * en: Client error
   * zh: 客户端错误
   */
  ERROR = 'client.error',
  /**
   * en: Audio noise reduction enabled
   * zh: 抑制平稳噪声
   */
  SUPPRESS_STATIONARY_NOISE = 'client.suppress.stationary.noise',
  /**
   * en: Suppress non-stationary noise
   * zh: 抑制非平稳噪声
   */
  SUPPRESS_NON_STATIONARY_NOISE = 'client.suppress.non.stationary.noise',
  /**
   * en: Audio input device changed
   * zh: 音频输入设备改变
   */
  AUDIO_INPUT_DEVICE_CHANGED = 'client.input.device.changed',
  /**
   * en: Audio output device changed
   * zh: 音频输出设备改变
   */
  AUDIO_OUTPUT_DEVICE_CHANGED = 'client.output.device.changed',
}
type EventCallback = (eventName: string, event: unknown) => void;

export class RealtimeEventHandler {
  private eventHandlers: Record<string, EventCallback[]>;
  protected _debug: boolean;

  constructor(debug = false) {
    this.eventHandlers = {};
    this._debug = debug;
  }

  clearEventHandlers() {
    this.eventHandlers = {};
  }

  on(eventName: string, callback: EventCallback) {
    this._log(`on ${eventName} event`);

    this.eventHandlers[eventName] = this.eventHandlers[eventName] || [];
    this.eventHandlers[eventName].push(callback);
    return callback;
  }

  off(eventName: string, callback: EventCallback) {
    this._log(`off ${eventName} event`);

    const handlers = this.eventHandlers[eventName] || [];
    if (callback) {
      const index = handlers.indexOf(callback);
      if (index === -1) {
        throw new RealtimeAPIError(
          RealtimeError.EVENT_HANDLER_ERROR,
          `Could not turn off specified event listener for "${eventName}": not found as a listener`,
        );
      }
      handlers.splice(index, 1);
    } else {
      delete this.eventHandlers[eventName];
    }
  }

  // eslint-disable-next-line max-params
  private _dispatchToHandlers(
    eventName: string,
    event: unknown,
    handlers: EventCallback[],
    prefix?: string,
  ) {
    for (const handler of handlers) {
      if (!prefix || eventName.startsWith(prefix)) {
        handler(eventName, event);
      }
    }
  }

  dispatch(eventName: string, event: unknown) {
    this._log(`dispatch ${eventName} event`);

    const handlers = (
      this.eventHandlers[eventName] || []
    ).slice() as EventCallback[];
    this._dispatchToHandlers(eventName, event, handlers);

    const allHandlers = (
      this.eventHandlers[EventNames.ALL] || []
    ).slice() as EventCallback[];
    this._dispatchToHandlers(eventName, event, allHandlers);

    const allClientHandlers = (
      this.eventHandlers[EventNames.ALL_CLIENT] || []
    ).slice() as EventCallback[];
    this._dispatchToHandlers(eventName, event, allClientHandlers, 'client.');

    const allServerHandlers = (
      this.eventHandlers[EventNames.ALL_SERVER] || []
    ).slice() as EventCallback[];
    this._dispatchToHandlers(eventName, event, allServerHandlers, 'server.');
  }

  _log(message: string) {
    if (this._debug) {
      console.log(`[RealtimeClient] ${message}`);
    }
  }
}
