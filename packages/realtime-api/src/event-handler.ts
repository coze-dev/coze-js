import EventNames from './event-names';
import { RealtimeError, RealtimeAPIError } from './error';
export type EventCallback = (eventName: string, event: unknown) => void;

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
        console.warn(
          `Could not turn off specified event listener for "${eventName}": not found as a listener`,
        );
        return;
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
        try {
          handler(eventName, event);
        } catch (e) {
          throw new RealtimeAPIError(
            RealtimeError.HANDLER_MESSAGE_ERROR,
            `Failed to handle message: ${eventName}`,
          );
        }
      }
    }
  }

  dispatch(eventName: string, event: unknown, consoleLog = true) {
    if (consoleLog) {
      this._log(`dispatch ${eventName} event`, event);
    }

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

  _log(message: string, event?: unknown) {
    if (this._debug) {
      console.log(`[RealtimeClient] ${message}`, event);
    }
  }
}
