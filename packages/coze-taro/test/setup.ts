class Events {
  private map = new Map<string, Array<Function>>();

  on(eventName: string, cb: Function) {
    const callbacks = this.map.get(eventName) ?? [];
    callbacks.push(cb);
    this.map.set(eventName, callbacks);
  }

  off(eventName?: string, cb?: Function) {
    if (eventName && cb) {
      const callbacks = (this.map.get(eventName) ?? []).filter(c => c !== cb);
      this.map.set(eventName, callbacks);
    } else if (eventName) {
      this.map.delete(eventName);
    } else {
      this.map = new Map();
    }
  }

  trigger(eventName: string, args?: unknown) {
    const callbacks = this.map.get(eventName) ?? [];
    for (const cb of callbacks) {
      try {
        cb(args);
      } catch (e) {
        console.log(e);
      }
    }
  }
}

vi.mock('@tarojs/taro', () => ({
  Events,
}));
