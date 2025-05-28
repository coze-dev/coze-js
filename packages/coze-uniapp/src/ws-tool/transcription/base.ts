import { type WsToolsOptions } from '@coze/api/ws-tools';
import {
  APIError,
  COZE_CN_BASE_WS_URL,
  CozeAPI,
  type CreateTranscriptionsWsReq,
  type CreateTranscriptionsWsRes,
  type ErrorRes,
  type WebSocketAPI,
  WebsocketsEventType,
} from '@coze/api';

import { PcmRecorder } from '../pcm-recorder';

/**
 * Base WebSocket transcription client for UniApp/WeChat Mini Program
 */
export class BaseWsTranscriptionClient {
  /**
   * WebSocket connection instance
   */
  public ws: WebSocketAPI<
    CreateTranscriptionsWsReq,
    CreateTranscriptionsWsRes
  > | null = null;

  /**
   * Event listeners map
   */
  protected listeners: Map<
    string,
    Set<(data: CreateTranscriptionsWsRes) => void>
  > = new Map();

  /**
   * Recorder instance for capturing audio
   */
  recorder: PcmRecorder;

  /**
   * Client configuration options
   */
  config: WsToolsOptions;

  /**
   * API client for making requests
   */
  private api: CozeAPI;

  /**
   * Creates a new BaseWsTranscriptionClient instance
   * @param {WsToolsOptions} config - Configuration options
   */
  constructor(config: WsToolsOptions) {
    this.api = new CozeAPI({
      baseWsURL: COZE_CN_BASE_WS_URL,
      ...config,
      debug: false,
    });

    this.recorder = new PcmRecorder({
      sampleRate: 24000,
      debug: config.debug,
    });

    this.config = config;
  }

  /**
   * Initialize WebSocket connection
   * @returns {Promise<WebSocketAPI>} - WebSocket connection instance
   */
  async init() {
    if (this.ws) {
      return this.ws;
    }

    const ws = await this.api.websockets.audio.transcriptions.create(
      this.config.websocketOptions,
    );
    let isResolved = false;

    return new Promise<
      WebSocketAPI<CreateTranscriptionsWsReq, CreateTranscriptionsWsRes>
    >((resolve, reject) => {
      ws.onopen = () => {
        console.debug('[transcription] ws open');
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
              data.data?.code,
              {
                code: data.data?.code,
                msg: data.data?.msg,
                detail: data.detail,
              },
              data.data?.msg,
              undefined,
            ),
          );
          return;
        } else if (
          data.event_type === WebsocketsEventType.TRANSCRIPTIONS_CREATED
        ) {
          resolve(ws);
          isResolved = true;
        } else if (
          data.event_type ===
          WebsocketsEventType.TRANSCRIPTIONS_MESSAGE_COMPLETED
        ) {
          this.closeWs();
        }
      };

      ws.onerror = (error, event) => {
        console.error('[transcription] WebSocket error', error, event);

        this.emit('data', error);
        this.emit(WebsocketsEventType.ERROR, error);

        this.closeWs();
        if (isResolved) {
          return;
        }
        isResolved = true;
        reject(
          new APIError(
            error.data?.code,
            error as unknown as ErrorRes,
            error.data?.msg,
            undefined,
          ),
        );
      };

      ws.onclose = () => {
        console.debug('[transcription] ws close');
      };

      this.ws = ws;
    });
  }

  /**
   * Listen for one or more events
   * @param {string|string[]} event - Event name or array of event names
   * @param {function} callback - Callback function
   */
  on(
    event: string | string[],
    callback: (data: CreateTranscriptionsWsRes) => void,
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
   * Remove listener for one or more events
   * @param {string|string[]} event - Event name or array of event names
   * @param {function} callback - Callback function to remove
   */
  off(
    event: string | string[],
    callback: (data: CreateTranscriptionsWsRes) => void,
  ) {
    const events = Array.isArray(event) ? event : [event];

    events.forEach(eventName => {
      this.listeners.get(eventName)?.delete(callback);
    });
  }

  /**
   * Close WebSocket connection
   * @protected
   */
  protected closeWs() {
    if (this.ws?.readyState === 1) {
      this.ws?.close();
    }
    this.ws = null;
  }

  /**
   * Emit an event to all registered listeners
   * @param {string} event - Event name
   * @param {object} data - Event data
   * @protected
   */
  protected emit(event: string, data: CreateTranscriptionsWsRes) {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }
}

export default BaseWsTranscriptionClient;
