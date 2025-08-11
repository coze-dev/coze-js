import { type WsToolsOptions } from '@coze/api/ws-tools';
import { WebsocketsEventType } from '@coze/api';

// Create new WebSocket connection
import { PcmRecorder, RecordingStatus } from './pcm-recorder';
import { BaseWsTranscriptionClient } from './base';

const websocket = require('@system.websocketfactory');

// 导入基础转写客户端类

// 导入PCM录音机

/**
 * WebSocket Transcription Client for Quick App
 * Handles WebSocket-based speech-to-text conversion
 */
export class WsTranscriptionClient extends BaseWsTranscriptionClient {
  /**
   * Flag to track recording status
   */
  private _isRecording = false;

  /**
   * PCM Recorder instance
   */
  private recorder: PcmRecorder | null = null;

  /**
   * WebSocket connection
   */
  protected ws: any = null;

  /**
   * Creates a new WsTranscriptionClient instance
   * @param {WsToolsOptions} config - Configuration options
   */
  constructor(config: WsToolsOptions) {
    super(config);
  }

  /**
   * Generate a UUID for message identification
   * @returns {string} - UUID string
   * @private
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }

  /**
   * Initialize WebSocket connection
   * @private
   */
  private initWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Close existing connection if any
        if (this.ws) {
          try {
            this.ws.close();
          } catch (e) {
            // Ignore close errors
          }
          this.ws = null;
        }

        this.ws = websocket.create({
          url: 'wss://ws.coze.cn/v1/audio/transcriptions',
          header: {
            Authorization: `Bearer ${this.config.token}`,
          },
        });

        // Set up event listeners
        this.ws.onopen = () => {
          if (this.config.debug) {
            console.log('[WsTranscriptionClient] WebSocket connected');
          }

          // Send configuration message
          this.sendConfig();
          resolve();
        };

        this.ws.onmessage = (data: any) => {
          if (this.config.debug) {
            console.log(
              `[WsTranscriptionClient] ws onmessage: ${JSON.stringify(data)}`,
            );
          }
          try {
            const message = JSON.parse(data.data);
            this.handleMessage(message);
          } catch (error) {
            if (this.config.debug) {
              console.error(
                '[WsTranscriptionClient] Failed to parse message:',
                error,
              );
            }
          }
        };

        this.ws.onerror = (error: any) => {
          if (this.config.debug) {
            console.error(
              '[WsTranscriptionClient] WebSocket error1:',
              JSON.stringify(error),
            );
          }
          this.handleError(error);
          reject(error);
        };

        this.ws.onclose = () => {
          if (this.config.debug) {
            console.log('[WsTranscriptionClient] WebSocket closed');
          }
        };
      } catch (error) {
        if (this.config.debug) {
          console.error(
            '[WsTranscriptionClient] Failed to initialize WebSocket:',
            error,
          );
        }
        this.handleError(error);
        reject(error);
      }
    });
  }

  /**
   * Send configuration message to WebSocket server
   * @private
   */
  private sendConfig(): void {
    if (!this.ws) {
      return;
    }

    try {
      const configMessage = {
        id: this.generateUUID(),
        event_type: WebsocketsEventType.TRANSCRIPTIONS_UPDATE,
        data: {
          input_audio: {
            format: 'pcm',
            codec: 'pcm',
            sample_rate: 48000,
            channel: 1,
            bit_depth: 16,
          },
        },
      };

      this.ws.send({
        data: JSON.stringify(configMessage),
        success: () => {
          if (this.config.debug) {
            console.log('[WsTranscriptionClient] Sent config success');
          }
        },
        fail: (data: any, code: number) => {
          if (this.config.debug) {
            console.error('[WsTranscriptionClient] Sent config fail:', data);
          }
        },
      });

      if (this.config.debug) {
        console.log(
          '[WsTranscriptionClient] Sent config:',
          JSON.stringify(configMessage),
        );
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[WsTranscriptionClient] Failed to send config:', error);
      }
      this.handleError(error);
    }
  }

  /**
   * Send audio data to WebSocket server
   * @param {ArrayBuffer} data - Audio data
   * @private
   */
  private sendAudio(data: ArrayBuffer): void {
    if (!this.ws || !this._isRecording) {
      return;
    }

    try {
      // Convert ArrayBuffer to Base64
      const base64 = this.arrayBufferToBase64(data);
      // Send audio data
      const audioMessage = {
        id: this.generateUUID(),
        event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_APPEND,
        data: {
          delta: base64,
        },
      };

      this.ws.send({
        data: JSON.stringify(audioMessage),
        success: () => {
          if (this.config.debug) {
            console.log('[WsTranscriptionClient] Sent audio success');
          }
        },
        fail: (data: any, code: number) => {
          if (this.config.debug) {
            console.error('[WsTranscriptionClient] Sent audio fail:', data);
          }
        },
      });
    } catch (error) {
      if (this.config.debug) {
        console.error('[WsTranscriptionClient] Failed to send audio:', error);
      }
      this.handleError(error);
    }
  }

  /**
   * Send audio end message to WebSocket server
   * @private
   */
  private sendAudioEnd(): void {
    if (!this.ws) {
      return;
    }

    try {
      const endMessage = {
        id: this.generateUUID(),
        event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_COMPLETE,
      };

      this.ws.send({
        data: JSON.stringify(endMessage),
        success: () => {
          if (this.config.debug) {
            console.log('[WsTranscriptionClient] Sent complete success');
          }
        },
        fail: (data: any, code: number) => {
          if (this.config.debug) {
            console.error('[WsTranscriptionClient] Sent complete fail:', data);
          }
        },
      });

      if (this.config.debug) {
        console.log('[WsTranscriptionClient] Sent audio end');
      }
    } catch (error) {
      if (this.config.debug) {
        console.error(
          '[WsTranscriptionClient] Failed to send audio end:',
          error,
        );
      }
      this.handleError(error);
    }
  }

  /**
   * Handle incoming WebSocket message
   * @param {any} message - Message object
   * @private
   */
  private handleMessage(message: any): void {
    if (!message || !message.event_type) {
      return;
    }

    switch (message.event_type) {
      case WebsocketsEventType.TRANSCRIPTIONS_MESSAGE_UPDATE:
      case WebsocketsEventType.TRANSCRIPTIONS_MESSAGE_COMPLETED:
        if (this.config.debug) {
          console.log(
            `[WsTranscriptionClient] Received message of event_type: ${message.event_type}`,
            JSON.stringify(message),
          );
        }
        this.trigger(message.event_type, message);
        break;
      default:
        if (this.config.debug) {
          console.log(
            `[WsTranscriptionClient] Received message of event_type: ${message.event_type}`,
            JSON.stringify(message),
          );
        }
        break;
    }
  }

  /**
   * Convert ArrayBuffer to Base64 string
   * @param {ArrayBuffer} buffer - ArrayBuffer to convert
   * @returns {string} - Base64 string
   * @private
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const uint8Array = new Uint8Array(buffer);
    return this.uint8ArrayToBase64(uint8Array);
  }

  /**
   * Convert Uint8Array to Base64 string (btoa alternative for QuickApp)
   * @param {Uint8Array} uint8Array - Uint8Array to convert
   * @returns {string} - Base64 string
   * @private
   */
  private uint8ArrayToBase64(uint8Array: Uint8Array): string {
    const base64Chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    let i = 0;

    // Process every 3 bytes
    while (i < uint8Array.length) {
      const byte1 = uint8Array[i++];
      const byte2 = i < uint8Array.length ? uint8Array[i++] : 0;
      const byte3 = i < uint8Array.length ? uint8Array[i++] : 0;

      // Convert 3 bytes to 4 base64 characters
      const bitmap = (byte1 << 16) | (byte2 << 8) | byte3;

      result += base64Chars.charAt((bitmap >> 18) & 63);
      result += base64Chars.charAt((bitmap >> 12) & 63);
      result +=
        i - 2 < uint8Array.length
          ? base64Chars.charAt((bitmap >> 6) & 63)
          : '=';
      result +=
        i - 1 < uint8Array.length ? base64Chars.charAt(bitmap & 63) : '=';
    }

    return result;
  }

  /**
   * Initialize PCM recorder
   * @private
   */
  private initRecorder(): void {
    if (this.recorder) {
      return;
    }

    this.recorder = new PcmRecorder({
      sampleRate: 48000,
      channels: 1,
      bitsPerSample: 16,
      debug: this.config.debug,
    });

    // Set up data callback
    this.recorder.onData(data => {
      this.sendAudio(data);
    });

    // Set up error callback
    this.recorder.onError(error => {
      if (this.config.debug) {
        console.error('[WsTranscriptionClient] Recorder error:', error);
      }
      this.handleError(error);
    });
  }

  /**
   * Start recording and transcription
   * @returns {Promise<void>}
   */
  async start(): Promise<void> {
    if (this._isRecording) {
      return;
    }

    try {
      // Initialize WebSocket connection
      await this.initWebSocket();

      // Initialize recorder
      this.initRecorder();

      // Start recording
      if (this.recorder) {
        this.recorder.start();
      }

      this._isRecording = true;

      // Trigger status change event
      this.trigger('status_change', {
        isRecording: this._isRecording,
        isPaused: false,
      });

      if (this.config.debug) {
        console.log('[WsTranscriptionClient] Started');
      }
    } catch (error) {
      if (this.config.debug) {
        console.error(
          '[WsTranscriptionClient] Failed to start:',
          JSON.stringify(error),
        );
      }
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Stop recording and transcription
   */
  stop(): void {
    if (!this._isRecording) {
      return;
    }

    try {
      // Stop recording
      if (this.recorder) {
        this.recorder.stop();
      }

      // Send audio end message
      this.sendAudioEnd();

      this._isRecording = false;

      // Trigger status change event
      this.trigger('status_change', {
        isRecording: this._isRecording,
        isPaused: false,
      });

      if (this.config.debug) {
        console.log('[WsTranscriptionClient] Stopped');
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[WsTranscriptionClient] Failed to stop:', error);
      }
      this.handleError(error);
    }
  }

  /**
   * Pause recording
   */
  pause(): void {
    if (!this._isRecording) {
      return;
    }

    try {
      // Pause recording
      if (this.recorder) {
        this.recorder.pause();
      }

      // Trigger status change event
      this.trigger('status_change', {
        isRecording: this._isRecording,
        isPaused: true,
      });

      if (this.config.debug) {
        console.log('[WsTranscriptionClient] Paused');
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[WsTranscriptionClient] Failed to pause:', error);
      }
      this.handleError(error);
    }
  }

  /**
   * Resume recording
   */
  resume(): void {
    if (!this._isRecording) {
      return;
    }

    try {
      // Resume recording
      if (this.recorder) {
        this.recorder.resume();
      }

      // Trigger status change event
      this.trigger('status_change', {
        isRecording: this._isRecording,
        isPaused: false,
      });

      if (this.config.debug) {
        console.log('[WsTranscriptionClient] Resumed');
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[WsTranscriptionClient] Failed to resume:', error);
      }
      this.handleError(error);
    }
  }

  /**
   * Register callback for transcription text updates
   * @param {Function} callback - Callback function to handle transcription updates
   */
  onTranscriptionUpdate(callback: (text: string) => void): void {
    this.on(
      WebsocketsEventType.TRANSCRIPTIONS_MESSAGE_UPDATE,
      (message: any) => {
        if (message.data && message.data.content) {
          callback(message.data.content);
        }
      },
    );
  }

  /**
   * Register callback for transcription completion
   * @param {Function} callback - Callback function to handle transcription completion
   */
  onTranscriptionCompleted(callback: (text: string) => void): void {
    this.on(
      WebsocketsEventType.TRANSCRIPTIONS_MESSAGE_COMPLETED,
      (message: any) => {
        if (this.config.debug) {
          console.log(
            '[WsTranscriptionClient] onTranscriptionCompleted:',
            JSON.stringify(message),
          );
        }
        if (message.data && message.data.content) {
          callback(message.data.content);
        }
      },
    );
  }

  /**
   * Register callback for status changes
   * @param {Function} callback - Callback function to handle status changes
   */
  onStatusChange(
    callback: (status: { isRecording: boolean; isPaused: boolean }) => void,
  ): void {
    // This is a simple implementation - you might want to enhance this based on your needs
    this.on('status_change', callback);
  }

  /**
   * Register callback for errors
   * @param {Function} callback - Callback function to handle errors
   */
  onError(callback: (error: string) => void): void {
    this.on(WebsocketsEventType.ERROR, (errorData: any) => {
      const errorMessage =
        errorData?.data?.msg || errorData?.message || 'Unknown error';
      callback(errorMessage);
    });
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stop();

    // Clean up recorder
    if (this.recorder) {
      this.recorder.destroy();
      this.recorder = null;
    }

    // Close WebSocket connection
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {
        // Ignore close errors
      }
      this.ws = null;
    }

    // Clear event listeners
    super.destroy();

    if (this.config.debug) {
      console.log('[WsTranscriptionClient] Destroyed');
    }
  }
}

export default WsTranscriptionClient;
