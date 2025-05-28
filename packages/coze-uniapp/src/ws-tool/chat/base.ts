import {
  type WsChatCallbackHandler,
  type WsChatEventData,
  type WsToolsOptions,
} from '@coze/api/ws-tools';
import {
  APIError,
  COZE_CN_BASE_WS_URL,
  CozeAPI,
  type CreateChatWsReq,
  type CreateChatWsRes,
  type ErrorRes,
  RoleType,
  type WebSocketAPI,
  WebsocketsEventType,
} from '@coze/api';

import PcmStreamPlayer from '../pcm-stream-player';
import { WsChatEventNames } from './event-names';

export interface WsChatClientOptions extends WsToolsOptions {
  /**
   * en: Bot id
   * zh: 智能体 ID
   */
  botId: string;
  /**
   * en: Workflow id
   * zh: 工作流 ID
   */
  workflowId?: string;
  /**
   * en: Voice id
   * zh: 音色 ID
   */
  voiceId?: string;
  /**
   * en: Whether to mute by default
   * zh: 是否默认静音
   */
  audioMutedDefault?: boolean;
}

/**
 * Base class for WebSocket-based chat client for WeChat Mini Program
 */
export class BaseWsChatClient {
  public ws: WebSocketAPI<CreateChatWsReq, CreateChatWsRes> | null = null;
  protected listeners: Map<string, Set<WsChatCallbackHandler>> = new Map();
  protected wavStreamPlayer: PcmStreamPlayer;
  protected trackId = 'default';
  protected api: CozeAPI;
  protected audioDeltaList: string[] = [];
  public config: WsChatClientOptions;

  constructor(config: WsChatClientOptions) {
    this.api = new CozeAPI({
      baseWsURL: COZE_CN_BASE_WS_URL,
      ...config,
      debug: false,
    });

    this.config = config;

    this.wavStreamPlayer = new PcmStreamPlayer({
      sampleRate: 8000,
      defaultFormat: 'g711a',
    });
  }

  /**
   * Initialize WebSocket connection and setup event handlers
   * @returns {Promise<WebSocketAPI>} The WebSocket API instance
   */
  protected async init() {
    if (this.ws) {
      return this.ws;
    }
    const ws = await this.api.websockets.chat.create(
      {
        bot_id: this.config.botId,
        workflow_id: this.config.workflowId,
      },
      this.config.websocketOptions,
    );
    this.ws = ws;

    // 标记 websocket 是否已 resolve or reject
    let isResolved = false;

    this.trackId = `my-track-id-${Date.now()}`;

    return new Promise<WebSocketAPI<CreateChatWsReq, CreateChatWsRes>>(
      (resolve, reject) => {
        ws.onopen = () => {
          this.log('ws open');
        };

        ws.onmessage = data => {
          // Trigger all registered event listeners
          this.emit(`server.${data.event_type}`, data);

          switch (data.event_type) {
            case WebsocketsEventType.ERROR:
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
                  undefined,
                  undefined,
                ),
              );
              return;

            case WebsocketsEventType.CHAT_CREATED:
              resolve(ws);
              isResolved = true;
              break;

            case WebsocketsEventType.CONVERSATION_AUDIO_DELTA:
              this.audioDeltaList.push(data.data.content);
              if (this.audioDeltaList.length === 1) {
                this.handleAudioMessage();
              }
              break;

            case WebsocketsEventType.INPUT_AUDIO_BUFFER_SPEECH_STARTED:
              this.clear();
              break;

            case WebsocketsEventType.CONVERSATION_AUDIO_COMPLETED:
              // this.closeWs();
              break;

            case WebsocketsEventType.CONVERSATION_CHAT_CANCELED:
              this.clear();
              break;

            default:
              break;
          }
        };

        ws.onerror = (error, event) => {
          this.warn('ws error', error, event);

          this.emit(`server.${WebsocketsEventType.ERROR}`, error);

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
          this.log('ws close');
        };
      },
    );
  }

  /**
   * Send a message to the chat server
   * @param {CreateChatWsReq} data - The message data to send
   */
  sendMessage(data: CreateChatWsReq) {
    this.ws?.send(data);
    this.log('sendMessage', data);
  }

  /**
   * Send a text message to the chat server
   * @param {string} text - The text message to send
   */
  sendTextMessage(text: string) {
    this.sendMessage({
      id: Date.now().toString(),
      event_type: WebsocketsEventType.CONVERSATION_MESSAGE_CREATE,
      data: {
        role: RoleType.User,
        content_type: 'text',
        content: text,
      },
    });
  }

  /**
   * Add event listener(s)
   * @param {string | string[]} event - Event name or array of event names
   * @param {WsChatCallbackHandler} callback - Event callback function
   */
  on(event: string | string[], callback: WsChatCallbackHandler) {
    const events = Array.isArray(event) ? event : [event];
    events.forEach(eventName => {
      if (!this.listeners.has(eventName)) {
        this.listeners.set(eventName, new Set());
      }
      this.listeners.get(eventName)?.add(callback);
      this.log('on', eventName);
    });
  }

  /**
   * Remove event listener(s)
   * @param {string | string[]} event - Event name or array of event names
   * @param {WsChatCallbackHandler} callback - Event callback function to remove
   */
  off(event: string | string[], callback: WsChatCallbackHandler) {
    const events = Array.isArray(event) ? event : [event];
    events.forEach(eventName => {
      this.listeners.get(eventName)?.delete(callback);
    });
  }

  /**
   * Close the WebSocket connection
   */
  protected closeWs() {
    if (this.ws?.readyState === 1) {
      this.ws?.close();
    }
    this.ws = null;
  }

  /**
   * Clear audio buffers and interrupt current playback
   */
  clear() {
    this.log('clear');

    this.audioDeltaList.length = 0;
    this.wavStreamPlayer.interrupt();
    this.trackId = `my-track-id-${Date.now()}`;
  }

  /**
   * Emit an event to all registered listeners
   * @param {string} eventName - The name of the event
   * @param {WsChatEventData} event - The event data
   */
  protected emit(eventName: string, event: WsChatEventData) {
    this.listeners
      .get(eventName)
      ?.forEach(callback => callback(eventName, event));
    this.listeners
      .get(WsChatEventNames.ALL)
      ?.forEach(callback => callback(eventName, event));
    this.log('dispatch', eventName, event);
  }

  /**
   * Handle incoming audio messages from the server
   */
  private handleAudioMessage = () => {
    if (this.audioDeltaList.length === 0) {
      return;
    }

    const message = this.audioDeltaList[0];

    try {
      this.wavStreamPlayer.addBase64PCM(message, this.trackId);

      this.audioDeltaList.shift();
      if (this.audioDeltaList.length > 0) {
        this.handleAudioMessage();
      }
    } catch (error) {
      this.warn('wavStreamPlayer error', error);
    }
  };

  /**
   * Log a message if debug is enabled
   * @param {...any} args - The arguments to log
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected log(...args: any[]) {
    if (this.config.debug) {
      console.log('[WsChatClient]', ...args);
    }
    return true;
  }

  /**
   * Log a warning message if debug is enabled
   * @param {...any} args - The arguments to log
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected warn(...args: any[]) {
    if (this.config.debug) {
      console.warn('[WsChatClient]', ...args);
    }
    return true;
  }
}

export default BaseWsChatClient;
