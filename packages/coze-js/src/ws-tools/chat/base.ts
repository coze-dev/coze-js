import { v4 as uuid } from 'uuid';

import { WavStreamPlayer } from '../wavtools';
import {
  type WsChatClientOptions,
  WsChatEventNames,
  type WsChatCallbackHandler,
  type WsChatEventData,
} from '../types';
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
} from '../../index';

class BaseWsChatClient {
  public ws: WebSocketAPI<CreateChatWsReq, CreateChatWsRes> | null = null;
  protected listeners: Map<string, Set<WsChatCallbackHandler>> = new Map();
  protected wavStreamPlayer: WavStreamPlayer;
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
    this.wavStreamPlayer = new WavStreamPlayer({ sampleRate: 24000 });
  }

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

    this.trackId = `my-track-id-${uuid()}`;

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

            case WebsocketsEventType.INPUT_AUDIO_BUFFER_SPEECH_STOPPED:
              this.complete();
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
              // this.isInterrupted = false;
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

  sendMessage(data: CreateChatWsReq) {
    this.ws?.send(data);
    this.log('sendMessage', data);
  }

  sendTextMessage(text: string) {
    this.sendMessage({
      id: uuid(),
      event_type: WebsocketsEventType.CONVERSATION_MESSAGE_CREATE,
      data: {
        role: RoleType.User,
        content_type: 'text',
        content: text,
      },
    });
  }

  /**
   * en: Add event listener(s)
   * zh: 添加事件监听器
   * @param event - string | string[] Event name or array of event names
   * @param callback - Event callback function
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
   * en: Remove event listener(s)
   * zh: 移除事件监听器
   * @param event - string | string[] Event name or array of event names
   * @param callback - Event callback function to remove
   */
  off(event: string | string[], callback: WsChatCallbackHandler) {
    const events = Array.isArray(event) ? event : [event];
    events.forEach(eventName => {
      this.listeners.get(eventName)?.delete(callback);
    });
  }

  // isPlaying() {
  //   return this.wavStreamPlayer.isPlaying();
  // }

  protected complete() {
    this.ws?.send({
      id: uuid(),
      event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_COMPLETE,
    });
  }

  protected closeWs() {
    if (this.ws?.readyState === 1) {
      this.ws?.close();
    }
    this.ws = null;
  }

  async clear() {
    this.log('clear');

    this.audioDeltaList.length = 0;
    await this.wavStreamPlayer.interrupt();
    this.trackId = `my-track-id-${uuid()}`;
  }

  protected emit(eventName: string, event: WsChatEventData) {
    this.listeners
      .get(eventName)
      ?.forEach(callback => callback(eventName, event));
    this.listeners
      .get(WsChatEventNames.ALL)
      ?.forEach(callback => callback(eventName, event));
    this.log('dispatch', eventName, event);
  }

  private handleAudioMessage = async () => {
    const message = this.audioDeltaList[0];
    const decodedContent = atob(message);
    const arrayBuffer = new ArrayBuffer(decodedContent.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < decodedContent.length; i++) {
      view[i] = decodedContent.charCodeAt(i);
    }

    try {
      await this.wavStreamPlayer.add16BitPCM(arrayBuffer, this.trackId);

      this.audioDeltaList.shift();
      if (this.audioDeltaList.length > 0) {
        this.handleAudioMessage();
      }
    } catch (error) {
      this.warn('wavStreamPlayer error', error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected log(...args: any[]) {
    if (this.config.debug) {
      console.log('[WsChatClient]', ...args);
    }
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected warn(...args: any[]) {
    if (this.config.debug) {
      console.warn('[WsChatClient]', ...args);
    }
    return true;
  }
}

export default BaseWsChatClient;
