import { v4 as uuid } from 'uuid';

import { WavStreamPlayer } from '../wavtools';
import { type WsToolsOptions } from '../types';
import {
  APIError,
  COZE_CN_BASE_WS_URL,
  CozeAPI,
  type CreateSpeechWsReq,
  type CreateSpeechWsRes,
  type ErrorRes,
  type WebSocketAPI,
  WebsocketsEventType,
} from '../..';

class WsSpeechClient {
  public ws: WebSocketAPI<CreateSpeechWsReq, CreateSpeechWsRes> | null = null;
  private listeners: Map<
    string,
    Set<(data: CreateSpeechWsRes | undefined) => void>
  > = new Map();
  private wavStreamPlayer: WavStreamPlayer;
  private trackId = 'default';
  private api: CozeAPI;
  private totalDuration = 0;
  private playbackStartTime: number | null = null;
  private playbackPauseTime: number | null = null;
  private playbackTimeout: NodeJS.Timeout | null = null;
  private elapsedBeforePause = 0;
  private audioDeltaList: string[] = [];

  constructor(config: WsToolsOptions) {
    this.api = new CozeAPI({
      baseWsURL: COZE_CN_BASE_WS_URL,
      ...config,
    });
    this.wavStreamPlayer = new WavStreamPlayer({ sampleRate: 24000 });
  }

  async init() {
    if (this.ws) {
      return this.ws;
    }
    const ws = await this.api.websockets.audio.speech.create();
    this.ws = ws;

    let isResolved = false;

    this.trackId = `my-track-id-${uuid()}`;
    this.totalDuration = 0;
    if (this.playbackTimeout) {
      clearTimeout(this.playbackTimeout);
      this.playbackTimeout = null;
    }
    this.playbackStartTime = null;

    return new Promise<WebSocketAPI<CreateSpeechWsReq, CreateSpeechWsRes>>(
      (resolve, reject) => {
        ws.onopen = () => {
          console.debug('[speech] ws open');
        };

        ws.onmessage = data => {
          // Trigger all registered event listeners
          this.emit('data', data);
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
          } else if (data.event_type === WebsocketsEventType.SPEECH_CREATED) {
            resolve(ws);
            isResolved = true;
          } else if (
            data.event_type === WebsocketsEventType.SPEECH_AUDIO_UPDATE
          ) {
            this.audioDeltaList.push(data.data.delta);
            if (this.audioDeltaList.length === 1) {
              this.handleAudioMessage();
            }
          } else if (
            data.event_type === WebsocketsEventType.SPEECH_AUDIO_COMPLETED
          ) {
            console.debug('[speech] totalDuration', this.totalDuration);

            if (this.playbackStartTime) {
              // 剩余时间 = 总时间 - 已播放时间 - 已暂停时间
              const now = new Date().getTime();
              const remaining =
                this.totalDuration -
                (now - this.playbackStartTime) / 1000 -
                this.elapsedBeforePause;

              this.playbackTimeout = setTimeout(() => {
                this.emit('completed', undefined);
                this.playbackStartTime = null;
                this.elapsedBeforePause = 0;
              }, remaining * 1000);
            }

            this.closeWs();
          }
        };

        ws.onerror = (error, event) => {
          console.error('[speech] WebSocket error', error, event);

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
          console.debug('[speech] ws close');
        };
      },
    );
  }

  async connect({ voiceId }: { voiceId?: string } = {}) {
    await this.init();
    this.ws?.send({
      id: uuid(),
      event_type: WebsocketsEventType.SPEECH_UPDATE,
      data: {
        output_audio: {
          codec: 'pcm',
          voice_id: voiceId || undefined,
        },
      },
    });
  }

  async disconnect() {
    if (this.playbackTimeout) {
      clearTimeout(this.playbackTimeout);
    }
    this.audioDeltaList.length = 0;
    await this.wavStreamPlayer.interrupt();
    this.closeWs();
  }

  append(message: string) {
    this.ws?.send({
      id: uuid(),
      event_type: WebsocketsEventType.INPUT_TEXT_BUFFER_APPEND,
      data: {
        delta: message,
      },
    });
  }

  complete() {
    this.ws?.send({
      id: uuid(),
      event_type: WebsocketsEventType.INPUT_TEXT_BUFFER_COMPLETE,
    });
  }

  appendAndComplete(message: string) {
    this.append(message);
    this.complete();
  }

  async interrupt() {
    await this.disconnect();
    this.emit('completed', undefined);
    console.debug('[speech] playback completed', this.totalDuration);
  }

  async pause() {
    if (this.playbackTimeout) {
      clearTimeout(this.playbackTimeout);
      this.playbackTimeout = null;
    }
    if (this.playbackStartTime && !this.playbackPauseTime) {
      this.playbackPauseTime = Date.now();
      this.elapsedBeforePause +=
        (this.playbackPauseTime - this.playbackStartTime) / 1000;
    }
    await this.wavStreamPlayer.pause();
  }

  async resume() {
    if (this.playbackPauseTime) {
      this.playbackStartTime = Date.now();
      this.playbackPauseTime = null;

      // Update the timeout with remaining duration
      if (this.playbackTimeout) {
        clearTimeout(this.playbackTimeout);
      }
      const remaining = this.totalDuration - this.elapsedBeforePause;
      this.playbackTimeout = setTimeout(() => {
        this.emit('completed', undefined);
        console.debug('[speech] playback completed', this.totalDuration);
        this.playbackStartTime = null;
        this.elapsedBeforePause = 0;
      }, remaining * 1000);
    }
    await this.wavStreamPlayer.resume();
  }

  async togglePlay() {
    if (this.isPlaying()) {
      await this.pause();
    } else {
      await this.resume();
    }
  }

  isPlaying() {
    return this.wavStreamPlayer.isPlaying();
  }

  on(event: string, callback: (data: CreateSpeechWsRes | undefined) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  off(event: string, callback: (data: CreateSpeechWsRes | undefined) => void) {
    this.listeners.get(event)?.delete(callback);
  }

  private closeWs() {
    if (this.ws?.readyState === 1) {
      this.ws?.close();
    }
    this.ws = null;
  }

  private emit(event: string, data: CreateSpeechWsRes | undefined) {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }

  private handleAudioMessage = async () => {
    const message = this.audioDeltaList[0];
    const decodedContent = atob(message);
    const arrayBuffer = new ArrayBuffer(decodedContent.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < decodedContent.length; i++) {
      view[i] = decodedContent.charCodeAt(i);
    }

    // Calculate duration in seconds
    const bytesPerSecond = 24000 * 1 * (16 / 8); // sampleRate * channels * (bitDepth/8)
    const duration = arrayBuffer.byteLength / bytesPerSecond;
    this.totalDuration += duration;

    try {
      await this.wavStreamPlayer.add16BitPCM(arrayBuffer, this.trackId);

      // Start or update the playback timer
      if (!this.playbackStartTime && !this.playbackPauseTime) {
        this.playbackStartTime = Date.now();
        this.elapsedBeforePause = 0;
      }

      // Remove the processed message and process the next one if available
      this.audioDeltaList.shift();
      if (this.audioDeltaList.length > 0) {
        this.handleAudioMessage();
      }
    } catch (error) {
      console.warn(
        `[speech] wavStreamPlayer error ${(error as Error)?.message}`,
        error,
      );
    }
  };
}

export default WsSpeechClient;
