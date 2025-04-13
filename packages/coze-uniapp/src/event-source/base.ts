import { Events } from '../types';
import { EventName, type EventHandler, type EventMessage } from './types';

export abstract class BaseEventSource {
  protected events = new Events();
  private isClosed = false;

  abstract start(): void;
  abstract abort(): void;

  on(eventName: EventName, handler: EventHandler) {
    this.events.on(eventName, handler);
    return this;
  }

  off(eventName?: EventName, handler?: EventHandler) {
    if (!eventName) {
      this.events.off();
    } else if (!handler) {
      this.events.off(eventName);
    } else {
      this.events.off(eventName, handler);
    }
    return this;
  }

  trigger(
    eventName: EventName,
    args: Pick<EventMessage, 'data' | 'errMsg'> = {},
  ) {
    // Success/Fail should only fired once
    if (
      this.isClosed &&
      (eventName === EventName.Success || eventName === EventName.Fail)
    ) {
      return this;
    }
    if (eventName === EventName.Success || eventName === EventName.Fail) {
      this.isClosed = true;
    }
    const msg: EventMessage = {
      event: eventName,
      data: args.data,
      errMsg: args.errMsg,
    };
    this.events.trigger(eventName, msg);
    return this;
  }
}
