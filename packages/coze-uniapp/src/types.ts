/**
 * 事件系统类，用于替代UniApp的Events
 */
export class Events {
  private events: Record<string, Function[]> = {};

  on(eventName: string, callback: Function) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
    return this;
  }

  off(eventName?: string, callback?: Function) {
    if (!eventName) {
      this.events = {};
      return this;
    }

    if (!callback) {
      delete this.events[eventName];
      return this;
    }

    const callbacks = this.events[eventName];
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
      if (callbacks.length === 0) {
        delete this.events[eventName];
      }
    }
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trigger(eventName: string, ...args: any[]) {
    const callbacks = this.events[eventName];
    if (callbacks) {
      callbacks.forEach(callback => {
        callback(...args);
      });
    }
    return this;
  }
}

export {};
