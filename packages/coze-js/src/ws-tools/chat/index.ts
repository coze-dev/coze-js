import { v4 as uuid } from 'uuid';

import { WavRecorder, WavStreamPlayer } from '../wavtools';
import {
  APIError,
  type ChatUpdateEvent,
  CozeAPI,
  type CreateChatWsReq,
  type CreateChatWsRes,
  type ErrorRes,
  type InputAudioBufferAppendEvent,
  RoleType,
  type WebSocketAPI,
  WebsocketsEventType,
} from '../..';
import { type WsToolsOptions } from '..';

export interface WsChatClientOptions extends WsToolsOptions {
  botId: string; //
  voiceId?: string;
}

export enum WsChatEventNames {
  /**
   * en: All events
   * zh: 所有事件
   */
  ALL = 'realtime.event',
  /**
   * en: Client connected
   * zh: 客户端连接
   */
  CONNECTED = 'client.connected',
  /**
   * en: Client connecting
   * zh: 客户端连接中
   */
  CONNECTING = 'client.connecting',
  /**
   * en: Client interrupted
   * zh: 客户端中断
   */
  INTERRUPTED = 'client.interrupted',
  /**
   * en: Client disconnected
   * zh: 客户端断开
   */
  DISCONNECTED = 'client.disconnected',
  /**
   * en: Client audio unmuted
   * zh: 客户端音频未静音
   */
  AUDIO_UNMUTED = 'client.audio.unmuted',
  /**
   * en: Client audio muted
   * zh: 客户端音频静音
   */
  AUDIO_MUTED = 'client.audio.muted',
  /**
   * en: Client error
   * zh: 客户端错误
   */
  ERROR = 'client.error',
  /**
   * en: Audio noise reduction enabled
   * zh: 抑制平稳噪声
   */
  // SUPPRESS_STATIONARY_NOISE = 'client.suppress.stationary.noise',
  /**
   * en: Suppress non-stationary noise
   * zh: 抑制非平稳噪声
   */
  // SUPPRESS_NON_STATIONARY_NOISE = 'client.suppress.non.stationary.noise',
  /**
   * en: Audio input device changed
   * zh: 音频输入设备改变
   */
  AUDIO_INPUT_DEVICE_CHANGED = 'client.input.device.changed',
  /**
   * en: Audio output device changed
   * zh: 音频输出设备改变
   */
  AUDIO_OUTPUT_DEVICE_CHANGED = 'client.output.device.changed',
  /**
   * en: Video input device changed
   * zh: 视频输入设备改变
   */
  //VIDEO_INPUT_DEVICE_CHANGED = 'client.video.input.device.changed',
  /**
   * en: Network quality changed
   * zh: 网络质量改变
   */
  NETWORK_QUALITY = 'client.network.quality',
}

class WsChatClient {
  public ws: WebSocketAPI<CreateChatWsReq, CreateChatWsRes> | null = null;
  private listeners: Map<
    string,
    Set<(data: CreateChatWsRes | undefined) => void>
  > = new Map();
  private wavStreamPlayer: WavStreamPlayer;
  private trackId = 'default';
  private wavRecorder: WavRecorder;
  private api: CozeAPI;
  private config: WsChatClientOptions;
  private audioDeltaList: string[] = [];

  constructor(config: WsChatClientOptions) {
    this.api = new CozeAPI({
      ...config,
    });
    this.wavStreamPlayer = new WavStreamPlayer({ sampleRate: 24000 });
    this.wavRecorder = new WavRecorder();
    // this.wavRecorder = new PcmRecorder();
    this.config = config;
  }

  private async init() {
    if (this.ws) {
      return this.ws;
    }
    const ws = await this.api.websockets.chat.create(
      this.config.botId,
      this.config.websocketOptions,
    );
    this.ws = ws;

    // 标记 websocket 是否已 resolve or reject
    let isResolved = false;

    this.trackId = `my-track-id-${uuid()}`;

    return new Promise<WebSocketAPI<CreateChatWsReq, CreateChatWsRes>>(
      (resolve, reject) => {
        ws.onopen = () => {
          console.debug('[chat] ws open');
        };

        ws.onmessage = (data, event) => {
          // Trigger all registered event listeners
          this.emit(data.event_type, data);

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
          console.error('[chat] WebSocket error', error, event);

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
          console.debug('[chat] ws close');
        };
      },
    );
  }

  private async startRecord(
    onAudioBufferAppend?: (data: InputAudioBufferAppendEvent) => void,
  ) {
    await this.wavRecorder.begin({});

    // init stream player
    await this.wavStreamPlayer.add16BitPCM(new ArrayBuffer(0), this.trackId);

    let startTime = performance.now();
    await this.wavRecorder.record(data => {
      const { raw } = data;

      // Convert ArrayBuffer to base64 string
      const base64String = btoa(
        Array.from(new Uint8Array(raw))
          .map(byte => String.fromCharCode(byte))
          .join(''),
      );

      // send audio to ws
      this.ws?.send({
        id: uuid(),
        event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_APPEND,
        data: {
          delta: base64String,
        },
      });

      onAudioBufferAppend?.({
        id: uuid(),
        event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_APPEND,
        data: {
          delta: base64String,
        },
      });
      console.log(
        '[chat] send input_audio_buffer_append',
        performance.now() - startTime,
      );
      startTime = performance.now();
    }, 1024);
  }

  async connect({
    onAudioBufferAppend,
    chatUpdate,
  }: {
    onAudioBufferAppend?: (data: InputAudioBufferAppendEvent) => void;
    chatUpdate?: ChatUpdateEvent;
  } = {}) {
    await this.init();
    const sampleRate = await this.wavRecorder.getSampleRate();
    console.log('[chat] sampleRate', sampleRate);

    this.ws?.send({
      id: chatUpdate?.id || uuid(),
      event_type: WebsocketsEventType.CHAT_UPDATE,
      data: {
        input_audio: {
          format: 'pcm',
          codec: 'pcm',
          sample_rate: sampleRate,
        },
        output_audio: {
          codec: 'pcm',
          pcm_config: {
            sample_rate: 24000,
          },
          voice_id: this.config.voiceId || undefined,
        },
        turn_detection: {
          type: 'server_vad',
        },
        need_play_prologue: true,
        ...chatUpdate?.data,
      },
    });
    await this.startRecord(onAudioBufferAppend);
    this.emit(WsChatEventNames.CONNECTED, undefined);
  }

  async disconnect() {
    await this.wavStreamPlayer.interrupt();
    await this.wavRecorder.quit();
    this.listeners.clear();
    this.closeWs();
    this.emit(WsChatEventNames.DISCONNECTED, undefined);
  }

  sendMessage(data: CreateChatWsReq) {
    this.ws?.send(data);
  }

  sendTextMessage(text: string) {
    this.ws?.send({
      id: uuid(),
      event_type: WebsocketsEventType.CONVERSATION_MESSAGE_CREATE,
      data: {
        role: RoleType.User,
        content_type: 'text',
        content: text,
      },
    });
  }

  complete() {
    this.ws?.send({
      id: uuid(),
      event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_COMPLETE,
    });
  }
  async setAudioEnable(enable: boolean) {
    const status = await this.wavRecorder.getStatus();
    if (enable) {
      if (status === 'ended') {
        await this.startRecord();
      } else {
        console.warn('[chat] wavRecorder is not ended with status', status);
      }
    } else {
      if (status === 'recording') {
        await this.wavRecorder.pause();
        const result = await this.wavRecorder.end();
        console.log('[chat] wavRecorder end', result);
      } else {
        console.warn('[chat] wavRecorder is not recording with status', status);
      }
    }
  }

  async setAudioInputDevice(deviceId: string) {
    if (this.wavRecorder.getStatus() !== 'ended') {
      await this.wavRecorder.end();
    }
    const devices = await this.wavRecorder.listDevices();
    if (deviceId === 'default') {
      this.wavRecorder.begin({});
    } else {
      const device = devices.find(d => d.deviceId === deviceId);
      if (!device) {
        throw new Error(`Device with id ${deviceId} not found`);
      }
      this.wavRecorder.begin({
        deviceId: device.deviceId,
      });
    }
    this.emit(WsChatEventNames.AUDIO_INPUT_DEVICE_CHANGED, undefined);
  }
  interrupt() {
    console.debug('[chat] interrupt');

    this.ws?.send({
      id: uuid(),
      event_type: WebsocketsEventType.CONVERSATION_CHAT_CANCEL,
    });

    this.emit(WsChatEventNames.INTERRUPTED, undefined);
  }

  async clear() {
    console.debug('[chat] clear');

    this.audioDeltaList.length = 0;
    await this.wavStreamPlayer.interrupt();
    this.trackId = `my-track-id-${uuid()}`;
  }

  isPlaying() {
    return this.wavStreamPlayer.isPlaying();
  }

  on(event: string, callback: (data: CreateChatWsRes | undefined) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  off(event: string, callback: (data: CreateChatWsRes | undefined) => void) {
    this.listeners.get(event)?.delete(callback);
  }

  private closeWs() {
    if (this.ws?.readyState === 1) {
      this.ws?.close();
    }
    this.ws = null;
  }

  private emit(event: string, data: CreateChatWsRes | undefined) {
    this.listeners.get(event)?.forEach(callback => callback(data));
    this.listeners
      .get(WsChatEventNames.ALL)
      ?.forEach(callback => callback(data));
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
      console.warn('[chat] wavStreamPlayer error', error);
    }
  };
}

export default WsChatClient;
