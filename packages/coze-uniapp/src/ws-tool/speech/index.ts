import {
  APIError,
  COZE_CN_BASE_WS_URL,
  type ClientOptions as WsToolsOptions,
  type CreateSpeechWsReq,
  type CreateSpeechWsRes,
  type ErrorRes,
  type WebSocketAPI,
  WebsocketsEventType,
} from '@coze/api';

import { PcmStreamPlayer } from '../pcm-stream-player';
import { CozeAPI } from '../../api';
// Import types directly from @coze/api

/**
 * WsSpeechClient for UniApp/WeChat Mini Program
 * Handles text-to-speech streaming through WebSockets
 * @class
 */
class WsSpeechClient {
  public ws: WebSocketAPI<CreateSpeechWsReq, CreateSpeechWsRes> | null = null;
  private listeners: Map<
    string,
    Set<(data: CreateSpeechWsRes | undefined) => void>
  > = new Map();
  private pcmStreamPlayer: PcmStreamPlayer;
  private trackId = 'default';
  private api: CozeAPI;
  private totalDuration = 0;
  private playbackStartTime: number | null = null;
  private playbackPauseTime: number | null = null;
  private playbackTimeout: NodeJS.Timeout | null = null;
  private elapsedBeforePause = 0;
  private audioDeltaList: string[] = [];
  private sampleRate = PcmStreamPlayer.getSampleRate();
  private config: WsToolsOptions;

  /**
   * Creates a new WsSpeechClient instance
   * @param {WsToolsOptions} config - Configuration options
   */
  constructor(config: WsToolsOptions) {
    this.api = new CozeAPI({
      baseWsURL: COZE_CN_BASE_WS_URL,
      ...config,
    });
    this.pcmStreamPlayer = new PcmStreamPlayer({
      sampleRate: this.sampleRate,
    });
    this.config = config;
  }

  /**
   * Initialize the WebSocket connection
   * @returns {Promise<WebSocketAPI>} - The WebSocket API instance
   */
  async init(): Promise<WebSocketAPI<CreateSpeechWsReq, CreateSpeechWsRes>> {
    if (this.ws) {
      return this.ws;
    }
    const ws = await this.api.websockets.audio.speech.create(
      undefined,
      this.config.websocketOptions,
    );
    this.ws = ws;

    let isResolved = false;

    // Generate a unique track ID using timestamp instead of uuid for Mini Program
    this.trackId = `my-track-id-${Date.now()}`;
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
            // Handle error with type casting to access data properties safely
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
          } else if (data.event_type === WebsocketsEventType.SPEECH_CREATED) {
            resolve(ws);
            isResolved = true;
          } else if (
            data.event_type === WebsocketsEventType.SPEECH_AUDIO_UPDATE
          ) {
            // Push audio data to queue for sequential processing
            // Use type assertion to access data property safely
            this.audioDeltaList.push(data.data?.delta);
            if (this.audioDeltaList.length === 1) {
              this.handleAudioMessage();
            }
          } else if (
            data.event_type === WebsocketsEventType.SPEECH_AUDIO_COMPLETED
          ) {
            console.debug('[speech] totalDuration', this.totalDuration);

            if (this.playbackStartTime) {
              // Calculate remaining time = total duration - played time - paused time
              const now = Date.now();
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
          // Use type assertion to safely access error properties
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
          console.debug('[speech] ws closed');
        };
      },
    );
  }

  /**
   * Connect to the speech service and configure audio output
   * @param {Object} options - Connection options
   * @param {string} [options.voiceId] - Voice ID to use
   * @param {number} [options.speechRate] - Speech rate (-50 to 100, default 0)
   * @returns {Promise<void>}
   */
  async connect({
    voiceId,
    speechRate,
  }: {
    /** Voice ID */
    voiceId?: string;
    /** Speech rate from -50 (0.5x) to 100 (2x), default 0 */
    speechRate?: number;
  } = {}): Promise<void> {
    await this.init();
    this.ws?.send({
      id: `event-${Date.now()}`,
      event_type: WebsocketsEventType.SPEECH_UPDATE,
      data: {
        output_audio: {
          codec: 'pcm',
          voice_id: voiceId || undefined,
          speech_rate: speechRate || undefined,
          pcm_config: {
            sample_rate: this.sampleRate,
          },
        },
      },
    });
  }

  /**
   * Disconnect from the speech service and stop audio playback
   * @returns {Promise<void>}
   */
  async disconnect(): Promise<void> {
    if (this.playbackTimeout) {
      clearTimeout(this.playbackTimeout);
    }
    this.audioDeltaList.length = 0;
    await this.pcmStreamPlayer.interrupt();
    this.closeWs();
  }

  /**
   * Append text to the speech buffer
   * @param {string} message - Text message to convert to speech
   */
  append(message: string): void {
    this.ws?.send({
      id: `event-${Date.now()}`,
      event_type: WebsocketsEventType.INPUT_TEXT_BUFFER_APPEND,
      data: {
        delta: message,
      },
    });
  }

  /**
   * Complete the speech buffer and start processing
   */
  complete(): void {
    this.ws?.send({
      id: `event-${Date.now()}`,
      event_type: WebsocketsEventType.INPUT_TEXT_BUFFER_COMPLETE,
    });
  }

  /**
   * Append text and complete in a single call
   * @param {string} message - Text message to convert to speech
   */
  appendAndComplete(message: string): void {
    this.append(message);
    this.complete();
  }

  /**
   * Interrupt playback and disconnect
   * @returns {Promise<void>}
   */
  async interrupt(): Promise<void> {
    await this.disconnect();
    this.emit('completed', undefined);
    console.debug('[speech] playback completed', this.totalDuration);
  }

  /**
   * Pause audio playback
   * @returns {Promise<void>}
   */
  async pause(): Promise<void> {
    if (this.playbackTimeout) {
      clearTimeout(this.playbackTimeout);
      this.playbackTimeout = null;
    }
    if (this.playbackStartTime && !this.playbackPauseTime) {
      this.playbackPauseTime = Date.now();
      this.elapsedBeforePause +=
        (this.playbackPauseTime - this.playbackStartTime) / 1000;
    }
    await this.pcmStreamPlayer.pause();
  }

  /**
   * Resume audio playback
   * @returns {Promise<void>}
   */
  async resume(): Promise<void> {
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
    await this.pcmStreamPlayer.resume();
  }

  /**
   * Toggle between play and pause states
   * @returns {Promise<void>}
   */
  async togglePlay(): Promise<void> {
    if (this.isPlaying()) {
      await this.pause();
    } else {
      await this.resume();
    }
  }

  /**
   * Check if audio is currently playing
   * @returns {boolean}
   */
  isPlaying(): boolean {
    return this.pcmStreamPlayer.isPlaying();
  }

  /**
   * Register an event listener
   * @param {string} event - Event name to listen for
   * @param {Function} callback - Callback function
   */
  on(
    event: string,
    callback: (data: CreateSpeechWsRes | undefined) => void,
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  /**
   * Remove an event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function to remove
   */
  off(
    event: string,
    callback: (data: CreateSpeechWsRes | undefined) => void,
  ): void {
    this.listeners.get(event)?.delete(callback);
  }

  /**
   * Close the WebSocket connection
   * @private
   */
  private closeWs(): void {
    if (this.ws?.readyState === 1) {
      this.ws?.close();
    }
    this.ws = null;
  }

  /**
   * Emit an event to all registered listeners
   * @param {string} event - Event name
   * @param {CreateSpeechWsRes|undefined} data - Event data
   * @private
   */
  private emit(event: string, data: CreateSpeechWsRes | undefined): void {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }

  /**
   * Process audio data from the queue
   * @private
   */
  private handleAudioMessage = async (): Promise<void> => {
    const message = this.audioDeltaList[0];
    // Use UniApp's base64ToArrayBuffer instead of atob for Mini Program compatibility
    const arrayBuffer = uni.base64ToArrayBuffer(message);

    // Calculate duration in seconds
    const bytesPerSecond = Number(this.sampleRate) * 1 * (16 / 8); // sampleRate * channels * (bitDepth/8)
    const duration = arrayBuffer.byteLength / bytesPerSecond;
    this.totalDuration += duration;

    try {
      await this.pcmStreamPlayer.add16BitPCM(arrayBuffer, this.trackId);

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
        `[speech] pcmStreamPlayer error ${(error as Error)?.message}`,
        error,
      );
    }
  };
}

export { WsSpeechClient };
export default WsSpeechClient;
