import WS from 'ws';
import {
  type WebSocketEventListenerMap,
  type Event,
  type CloseEvent,
  type ErrorEvent,
} from 'reconnecting-websocket/dist/events';
import ReconnectingWebSocket from 'reconnecting-websocket';

import { isBrowser } from './utils';
import {
  type CommonErrorEvent,
  WebsocketsEventType,
} from './resources/websockets/types';
import { type WebsocketOptions } from './core';

export class WebSocketAPI<Req, Rsp> {
  private rws: ReconnectingWebSocket;

  constructor(url: string, options: WebsocketOptions = {}) {
    const separator = url.includes('?') ? '&' : '?';
    const { authorization } = options.headers || {};

    this.rws = new ReconnectingWebSocket(
      `${url}${separator}authorization=${authorization}`,
      [],
      {
        WebSocket: isBrowser()
          ? window.WebSocket
          : class extends WS {
              constructor(url2: string, protocols: string | string[]) {
                super(url2, protocols, {
                  headers: options.headers,
                });
              }
            },
        ...options,
      },
    );

    this.rws.addEventListener('message', (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data as string);
        this.onmessage?.(data, event);
      } catch (error) {
        console.error('WebSocketAPI onmessage error', error);
      }
    });

    this.rws.addEventListener('open', (event: Event) => {
      this.onopen?.(event);
    });

    this.rws.addEventListener('close', (event: CloseEvent) => {
      this.onclose?.(event);
    });

    this.rws.addEventListener('error', (event: ErrorEvent) => {
      const { readyState } = this.rws;
      if (readyState === 3) {
        return;
      }
      const statusCode = event.target?._req?.res?.statusCode;
      const rawHeaders = event.target?._req?.res?.rawHeaders || [];
      const logidIndex = rawHeaders.findIndex(
        (header: string) => header === 'X-Tt-Logid',
      );
      const logid = logidIndex !== -1 ? rawHeaders[logidIndex + 1] : undefined;

      const error: CommonErrorEvent = {
        id: '0',
        event_type: WebsocketsEventType.ERROR,
        data: {
          code: -1,
          msg: 'WebSocket error',
        },
        detail: {
          logid,
        },
      };

      if (statusCode === 401) {
        error.data.code = 401;
        error.data.msg = 'Unauthorized';
      } else if (statusCode === 403) {
        error.data.code = 403;
        error.data.msg = 'Forbidden';
      } else {
        error.data.code = 500;
        error.data.msg = String(event?.error) || 'WebSocket error';
      }

      this.onerror?.(error, event);
    });
  }

  // Standard WebSocket properties
  get readyState() {
    return this.rws.readyState;
  }

  // Standard WebSocket methods
  send(data: Req) {
    return this.rws.send(JSON.stringify(data));
  }

  close(code?: number, reason?: string) {
    return this.rws.close(code, reason);
  }

  reconnect(code?: number, reason?: string) {
    return this.rws.reconnect(code, reason);
  }

  // Event listener methods
  addEventListener(
    type: keyof WebSocketEventListenerMap,
    listener: EventListener,
  ) {
    this.rws.addEventListener(type, listener);
  }

  removeEventListener(
    type: keyof WebSocketEventListenerMap,
    listener: EventListener,
  ) {
    this.rws.removeEventListener(type, listener);
  }

  // Event handler methods
  onmessage: ((data: Rsp, event: MessageEvent) => void) | null = null;

  onopen: ((event: Event) => void) | null = null;

  onclose: ((event: CloseEvent) => void) | null = null;

  onerror: ((error: CommonErrorEvent, event: Event) => void) | null = null;
}
