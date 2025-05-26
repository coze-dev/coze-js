/* eslint-disable @typescript-eslint/no-explicit-any */
// UniApp WebSocket 适配器
export class UniAppWebSocket implements WebSocket {
  private ws: any;
  private eventListeners: Record<string, Array<(event: any) => void>> = {
    open: [],
    message: [],
    close: [],
    error: [],
  };

  static CONNECTING = 0 as const;
  static OPEN = 1 as const;
  static CLOSING = 2 as const;
  static CLOSED = 3 as const;

  readonly CONNECTING = 0;
  readonly OPEN = 1;
  readonly CLOSING = 2;
  readonly CLOSED = 3;

  url: string;
  protocol: string;
  readyState: number = this.CLOSED;
  bufferedAmount = 0;
  extensions = '';
  binaryType: BinaryType = 'blob';

  constructor(url: string | URL, protocols?: string | string[], options?: any) {
    // 如需要，将 URL 对象转换为字符串
    this.url = typeof url === 'string' ? url : url.toString();
    this.protocol = Array.isArray(protocols) ? protocols[0] : protocols || '';
    this.readyState = this.CONNECTING;

    // Create the UniApp WebSocket
    this.ws = uni.connectSocket({
      url: this.url.replace(' ', '%20'), // 微信小程序，url 不能有空格
      protocols: Array.isArray(protocols)
        ? protocols
        : protocols
          ? [protocols]
          : [],
      success: () => {
        // WebSocket 连接已初始化，但尚未连接
      },
      fail: (error: any) => {
        this.dispatchEvent({
          type: 'error',
          error,
          target: this,
        });
      },
    });

    // Register event handlers
    this.ws.onOpen(() => {
      this.readyState = this.OPEN;
      this.dispatchEvent({
        type: 'open',
        target: this,
      });
    });

    this.ws.onMessage((res: { data: string | ArrayBuffer }) => {
      this.dispatchEvent({
        type: 'message',
        data: res.data,
        target: this,
      });
    });

    this.ws.onClose((res: { code?: number; reason?: string }) => {
      this.readyState = this.CLOSED;
      this.dispatchEvent({
        type: 'close',
        code: res.code || 1000,
        reason: res.reason || '',
        wasClean: true,
        target: this,
      });
    });

    this.ws.onError((res: any) => {
      console.log('WebSocket error:', res);
      this.dispatchEvent({
        type: 'error',
        error: res,
        target: this,
      });
    });
  }

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    if (this.readyState !== this.OPEN) {
      throw new Error('WebSocket is not open');
    }

    this.ws.send({
      data: typeof data === 'string' ? data : data,
      success: () => {
        // 数据发送成功
      },
      fail: (error: any) => {
        this.dispatchEvent({
          type: 'error',
          error,
          target: this,
        });
      },
    });
  }

  close(code?: number, reason?: string): void {
    if (this.readyState === this.CLOSED) {
      return;
    }

    this.readyState = this.CLOSING;
    this.ws.close({
      code: code || 1000,
      reason: reason || '',
      success: () => {
        // 连接已成功关闭
      },
      fail: (error: any) => {
        this.dispatchEvent({
          type: 'error',
          error,
          target: this,
        });
      },
    });
  }

  addEventListener(type: string, listener: EventListener): void {
    if (!this.eventListeners[type]) {
      this.eventListeners[type] = [];
    }
    this.eventListeners[type].push(listener as (event: any) => void);
  }

  removeEventListener(type: string, listener: EventListener): void {
    if (!this.eventListeners[type]) {
      return;
    }
    this.eventListeners[type] = this.eventListeners[type].filter(
      l => l !== listener,
    );
  }

  dispatchEvent(event: any): boolean {
    const listeners = this.eventListeners[event.type] || [];
    listeners.forEach(listener => {
      listener(event);
    });

    // 如果定义了 on* 处理函数，则调用它
    const handlerName = `on${event.type}` as keyof UniAppWebSocket;
    const handler = this[handlerName] as ((event: any) => void) | undefined;
    if (handler && typeof handler === 'function') {
      handler.call(this, event);
    }

    return true;
  }

  // 事件处理器
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
}

// 导出适配器
export default UniAppWebSocket;
