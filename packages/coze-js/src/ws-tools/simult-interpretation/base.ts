import { type WsSimultInterpretationClientOptions } from '../types';
import PcmRecorder from '../recorder/pcm-recorder';
import {
  APIError,
  CozeAPI,
  type CreateSimultInterpretationsWsReq,
  type CreateSimultInterpretationsWsRes,
  type ErrorRes,
  type WebSocketAPI,
  WebsocketsEventType,
} from '../..';

class BaseWsSimultInterpretationClient {
  public ws: WebSocketAPI<
    CreateSimultInterpretationsWsReq,
    CreateSimultInterpretationsWsRes
  > | null = null;
  protected listeners: Map<
    string,
    Set<(data: CreateSimultInterpretationsWsRes) => void>
  > = new Map();
  recorder: PcmRecorder;
  config: WsSimultInterpretationClientOptions;

  private api: CozeAPI;
  constructor(config: WsSimultInterpretationClientOptions) {
    this.api = new CozeAPI({
      ...config,
      debug: false,
    });
    this.recorder = new PcmRecorder({
      audioCaptureConfig: config.audioCaptureConfig,
      aiDenoisingConfig: config.aiDenoisingConfig,
      mediaStreamTrack: config.mediaStreamTrack,
      wavRecordConfig: config.wavRecordConfig,
      deviceId: config.deviceId || 'default',
      debug: config.debug,
    });

    this.config = config;
  }

  async init() {
    if (this.ws) {
      return this.ws;
    }
    const ws = await this.api.websockets.audio.simultInterpretation.create(
      this.config.websocketOptions,
    );
    let isResolved = false;

    return new Promise<
      WebSocketAPI<
        CreateSimultInterpretationsWsReq,
        CreateSimultInterpretationsWsRes
      >
    >((resolve, reject) => {
      ws.onopen = () => {
        console.debug('[simult interpretation] ws open');
      };

      ws.onmessage = data => {
        // Trigger all registered event listeners
        this.emit(WebsocketsEventType.ALL, data);
        this.emit(data.event_type, data);

        if (data.event_type === WebsocketsEventType.ERROR) {
          this.closeWs();
          if (isResolved) {
            return;
          }
          isResolved = true;
          reject(
            new APIError(
              data.data.code,
              {
                code: data.data.code,
                msg: data.data.msg,
                detail: data.detail,
              },
              data.data.msg,
              undefined,
            ),
          );
          return;
        } else if (
          data.event_type === WebsocketsEventType.SIMULT_INTERPRETATION_CREATED
        ) {
          resolve(ws);
          isResolved = true;
        } else if (
          data.event_type ===
          WebsocketsEventType.SIMULT_INTERPRETATION_MESSAGE_COMPLETED
        ) {
          this.closeWs();
        }
      };

      ws.onerror = (error, event) => {
        console.error('[simult interpretation] WebSocket error', error, event);

        this.emit('data', error);
        this.emit(WebsocketsEventType.ERROR, error);

        this.closeWs();
        if (isResolved) {
          return;
        }
        isResolved = true;
        reject(
          new APIError(
            error.data.code,
            error as unknown as ErrorRes,
            error.data.msg,
            undefined,
          ),
        );
      };

      ws.onclose = () => {
        console.debug('[simult interpretation] ws close');
      };

      this.ws = ws;
    });
  }

  /**
   * 监听一个或多个事件
   * @param event 事件名称或事件名称数组
   * @param callback 回调函数
   */
  on(
    event: string | string[],
    callback: (data: CreateSimultInterpretationsWsRes) => void,
  ) {
    const events = Array.isArray(event) ? event : [event];

    events.forEach(eventName => {
      if (!this.listeners.has(eventName)) {
        this.listeners.set(eventName, new Set());
      }
      this.listeners.get(eventName)?.add(callback);
    });
  }

  /**
   * 移除一个或多个事件的监听
   * @param event 事件名称或事件名称数组
   * @param callback 回调函数
   */
  off(
    event: string | string[],
    callback: (data: CreateSimultInterpretationsWsRes) => void,
  ) {
    const events = Array.isArray(event) ? event : [event];

    events.forEach(eventName => {
      this.listeners.get(eventName)?.delete(callback);
    });
  }

  protected closeWs() {
    if (this.ws?.readyState === 1) {
      this.ws?.close();
    }
    this.ws = null;
  }

  protected emit(event: string, data: CreateSimultInterpretationsWsRes) {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }
}

export default BaseWsSimultInterpretationClient;
