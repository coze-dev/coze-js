import { v4 as uuid } from 'uuid';

import { WavRecorder } from '../wavtools';
import {
  APIError,
  CozeAPI,
  type CreateTranscriptionsWsReq,
  type CreateTranscriptionsWsRes,
  type ErrorRes,
  type WebSocketAPI,
  WebsocketsEventType,
} from '../..';
import { type WsToolsOptions } from '..';

class WsTranscriptionClient {
  public ws: WebSocketAPI<
    CreateTranscriptionsWsReq,
    CreateTranscriptionsWsRes
  > | null = null;
  private listeners: Map<
    string,
    Set<(data: CreateTranscriptionsWsRes) => void>
  > = new Map();
  private wavRecorder: WavRecorder;

  private api: CozeAPI;
  constructor(config: WsToolsOptions) {
    this.api = new CozeAPI({
      ...config,
    });
    this.wavRecorder = new WavRecorder({ sampleRate: 24000 });
  }

  async init() {
    if (this.ws) {
      return this.ws;
    }
    const ws = await this.api.websockets.audio.transcriptions.create();
    let isResolved = false;

    return new Promise<
      WebSocketAPI<CreateTranscriptionsWsReq, CreateTranscriptionsWsRes>
    >((resolve, reject) => {
      ws.onopen = () => {
        console.debug('[transcription] ws open');
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
            error.data.code,
            error as unknown as ErrorRes,
            error.data.msg,
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

  async connect() {
    await this.init();
    this.ws?.send({
      id: uuid(),
      event_type: WebsocketsEventType.TRANSCRIPTIONS_UPDATE,
      data: {
        input_audio: {
          format: 'pcm',
          codec: 'pcm',
          sample_rate: 24000,
          channel: 1,
          bit_depth: 16,
        },
      },
    });
  }

  async disconnect() {
    await this.wavRecorder.quit();
    this.listeners.clear();
    this.closeWs();
  }

  getDeviceList() {
    return this.wavRecorder.listDevices();
  }

  getStatus() {
    return this.wavRecorder.getStatus();
  }

  async record() {
    if (this.getStatus() === 'recording') {
      return;
    }

    if (this.getStatus() === 'ended') {
      const deviceList = await this.getDeviceList();
      await this.wavRecorder.begin({
        deviceId: deviceList[0]?.deviceId,
      });
    }

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
    });
  }

  async end() {
    this.ws?.send({
      id: uuid(),
      event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_COMPLETE,
    });

    await this.wavRecorder.pause();
    const finalAudio = await this.wavRecorder.end();
    return finalAudio;
  }

  pause() {
    return this.wavRecorder.pause();
  }

  on(event: string, callback: (data: CreateTranscriptionsWsRes) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  off(event: string, callback: (data: CreateTranscriptionsWsRes) => void) {
    this.listeners.get(event)?.delete(callback);
  }

  private closeWs() {
    if (this.ws?.readyState === 1) {
      this.ws?.close();
    }
    this.ws = null;
  }

  private emit(event: string, data: CreateTranscriptionsWsRes) {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }
}

export default WsTranscriptionClient;
