import { v4 as uuid } from 'uuid';

import { WavStreamPlayer, WavRecorder } from '../wavtools';
import {
  APIError,
  CozeAPI,
  type CreateChatWsReq,
  type CreateChatWsRes,
  type ErrorRes,
  type WebSocketAPI,
  WebsocketsEventType,
} from '../..';
import { type WsToolsOptions } from '..';

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
  private totalDuration = 0;
  private playbackStartTime: number | null = null;
  private playbackPauseTime: number | null = null;
  private playbackTimeout: NodeJS.Timeout | null = null;

  constructor(config: WsToolsOptions) {
    this.api = new CozeAPI({
      ...config,
    });
    this.wavStreamPlayer = new WavStreamPlayer({ sampleRate: 24000 });
    this.wavRecorder = new WavRecorder({ sampleRate: 24000 });
  }

  private async init(botId: string) {
    if (this.ws) {
      return this.ws;
    }
    const ws = await this.api.websockets.chat.create(botId);
    this.ws = ws;

    let isResolved = false;

    this.trackId = `my-track-id-${uuid()}`;
    this.totalDuration = 0;
    if (this.playbackTimeout) {
      clearTimeout(this.playbackTimeout);
      this.playbackTimeout = null;
    }
    this.playbackStartTime = null;

    return new Promise<WebSocketAPI<CreateChatWsReq, CreateChatWsRes>>(
      (resolve, reject) => {
        ws.onopen = () => {
          console.debug('[chat] ws open');
        };

        ws.onmessage = (data, event) => {
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
                data as unknown as ErrorRes,
                data.data.msg,
                undefined,
              ),
            );
            return;
          } else if (data.event_type === WebsocketsEventType.CHAT_CREATED) {
            resolve(ws);
            isResolved = true;
          } else if (
            data.event_type ===
            WebsocketsEventType.INPUT_AUDIO_BUFFER_SPEECH_STOPPED
          ) {
            this.complete();
          } else if (
            data.event_type === WebsocketsEventType.CONVERSATION_AUDIO_DELTA
          ) {
            this.handleAudioMessage(data.data.content);
          } else if (
            data.event_type === WebsocketsEventType.CONVERSATION_AUDIO_COMPLETED
          ) {
            console.debug('[chat] totalDuration', this.totalDuration);
            // this.closeWs();
          }
        };

        ws.onerror = (error, event) => {
          console.error('[chat] WebSocket error', error, event);

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
          console.debug('[chat] ws close');
        };
      },
    );
  }

  private async startRecord() {
    await this.wavRecorder.begin();

    // init stream player
    await this.wavStreamPlayer.add16BitPCM(new ArrayBuffer(0), this.trackId);

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
      console.log('[chat] send input_audio_buffer_append');
    });
  }

  async connect({ botId, voiceId }: { botId: string; voiceId?: string }) {
    await this.init(botId);
    this.ws?.send({
      id: uuid(),
      event_type: WebsocketsEventType.CHAT_UPDATE,
      data: {
        input_audio: {
          format: 'pcm',
          codec: 'pcm',
        },
        output_audio: {
          codec: 'pcm',
          pcm_config: {
            sample_rate: 24000,
          },
          voice_id: voiceId || undefined,
        },
        turn_detection: {
          type: 'server_vad',
        },
      },
    });
    await this.startRecord();
  }

  async disconnect() {
    await this.interrupt();
    await this.wavRecorder.quit();
    this.listeners.clear();
    this.closeWs();
  }

  sendUserMessage(message: CreateChatWsReq) {
    this.ws?.send(message);
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
        await this.wavRecorder.end();
      } else {
        console.warn('[chat] wavRecorder is not recording with status', status);
      }
    }
  }

  async interrupt() {
    this.ws?.send({
      id: uuid(),
      event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_CLEAR,
    });
    await this.wavStreamPlayer.interrupt();
    this.trackId = `my-track-id-${uuid()}`;
    this.emit('completed', undefined);
    console.debug('[chat] playback completed', this.totalDuration);
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
  }

  private handleAudioMessage = async (message: string) => {
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
      }

      // Clear existing timeout if any
      if (this.playbackTimeout) {
        clearTimeout(this.playbackTimeout);
      }

      // Calculate remaining time
      const elapsed = this.playbackPauseTime
        ? 0
        : (Date.now() - (this.playbackStartTime || Date.now())) / 1000;
      const remaining = this.totalDuration - elapsed;

      // Set new timeout
      this.playbackTimeout = setTimeout(() => {
        this.emit('completed', undefined);
        this.playbackStartTime = null;
      }, remaining * 1000);
    } catch (error) {
      console.warn('[chat] wavStreamPlayer error', error);
    }
  };
}

export default WsChatClient;
