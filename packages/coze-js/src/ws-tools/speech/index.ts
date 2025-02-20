import { v4 as uuid } from 'uuid';

import { WavStreamPlayer } from '../wavtools';
import {
  APIError,
  CozeAPI,
  type CreateSpeechWsReq,
  type CreateSpeechWsRes,
  type ErrorRes,
  type WebSocketAPI,
  WebsocketsEventType,
} from '../..';
import { type WsToolsOptions } from '..';

class WsSpeechClient {
  public ws: WebSocketAPI<CreateSpeechWsReq, CreateSpeechWsRes> | null = null;
  private listeners: Map<string, Set<(data: CreateSpeechWsRes) => void>> =
    new Map();
  private wavStreamPlayer: WavStreamPlayer;
  private trackId: string;
  private api: CozeAPI;
  constructor(config: WsToolsOptions) {
    this.api = new CozeAPI({
      ...config,
    });
    this.wavStreamPlayer = new WavStreamPlayer({ sampleRate: 24000 });
    this.trackId = `my-track-id-${uuid()}`;
  }

  async init() {
    if (this.ws) {
      return this.ws;
    }
    const ws = await this.api.websockets.audio.speech.create();
    this.ws = ws;

    let isResolved = false;

    return new Promise<WebSocketAPI<CreateSpeechWsReq, CreateSpeechWsRes>>(
      (resolve, reject) => {
        ws.onopen = () => {
          console.debug('[speech] ws open');
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
          } else if (data.event_type === WebsocketsEventType.SPEECH_CREATED) {
            resolve(ws);
            isResolved = true;
          } else if (
            data.event_type === WebsocketsEventType.SPEECH_AUDIO_UPDATE
          ) {
            this.handleAudioMessage(data.data.delta);
          } else if (
            data.event_type === WebsocketsEventType.SPEECH_AUDIO_COMPLETED
          ) {
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
    await this.interrupt();
    this.listeners.clear();
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
    await this.wavStreamPlayer.interrupt();
    this.trackId = `my-track-id-${uuid()}`;
  }

  async pause() {
    await this.wavStreamPlayer.pause();
  }

  async resume() {
    await this.wavStreamPlayer.resume();
  }

  async togglePlay() {
    await this.wavStreamPlayer.togglePlay();
  }

  isPlaying() {
    return this.wavStreamPlayer.isPlaying();
  }

  on(event: string, callback: (data: CreateSpeechWsRes) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  off(event: string, callback: (data: CreateSpeechWsRes) => void) {
    this.listeners.get(event)?.delete(callback);
  }

  private closeWs() {
    if (this.ws?.readyState === 1) {
      this.ws?.close();
    }
    this.ws = null;
  }

  private emit(event: string, data: CreateSpeechWsRes) {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }

  private handleAudioMessage = async (message: string) => {
    const decodedContent = atob(message);
    const arrayBuffer = new ArrayBuffer(decodedContent.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < decodedContent.length; i++) {
      view[i] = decodedContent.charCodeAt(i);
    }

    try {
      await this.wavStreamPlayer.add16BitPCM(arrayBuffer, this.trackId);
    } catch (error) {
      console.warn('[speech] wavStreamPlayer error', error);
    }
  };
}

export default WsSpeechClient;
