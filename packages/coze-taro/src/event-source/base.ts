import { Events } from '@tarojs/taro';

import { EventName, type EventHandler, type EventMessage } from './types';

export abstract class BaseEventSource {
  protected events = new Events();

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

  trigger(eventName: EventName, args?: unknown) {
    const msg: EventMessage = {
      event: eventName,
      data: eventName !== EventName.Fail ? args : undefined,
      errMsg: eventName === EventName.Fail ? (args as string) : undefined,
    };
    this.events.trigger(eventName, msg);
    return this;
  }
}
