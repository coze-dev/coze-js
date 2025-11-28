import { type WsToolsOptions } from '@coze/api/ws-tools';
import { WebsocketsEventType } from '@coze/api';

// 导入PCM流播放器
import { PcmStreamPlayer } from './pcm-stream-player';

/**
 * WebSocket Speech Client for Quick App
 * Handles WebSocket-based text-to-speech conversion
 */
export class WsSpeechClient {
  /**
   * Configuration options
   */
  private config: WsToolsOptions;

  /**
   * WebSocket connection
   */
  private ws: any = null;

  /**
   * Event listeners
   */
  private eventListeners: Record<string, Array<(data: any) => void>> = {};

  /**
   * PCM Stream Player instance
   */
  private player: PcmStreamPlayer | null = null;

  /**
   * Flag to track if speech is in progress
   */
  private isSpeaking = false;

  /**
   * Creates a new WsSpeechClient instance
   * @param {WsToolsOptions} config - Configuration options
   */
  constructor(config: WsToolsOptions) {
    this.config = config;

    // Initialize PCM Stream Player
    this.player = new PcmStreamPlayer({ debug: this.config.debug });
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
   * @returns {Promise<void>}
   * @private
   */
  private async initWebSocket(): Promise<void> {
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

        // Create new WebSocket connection
        const websocket = require('@system.websocketfactory');
        this.ws = websocket.create();

        // Set up event listeners
        this.ws.onopen = () => {
          if (this.config.debug) {
            console.log('[WsSpeechClient] WebSocket connected');
          }
          resolve();
        };

        this.ws.onmessage = (data: any) => {
          try {
            const message = JSON.parse(data.data);
            this.handleMessage(message);
          } catch (error) {
            if (this.config.debug) {
              console.error('[WsSpeechClient] Failed to parse message:', error);
            }
          }
        };

        this.ws.onerror = (error: any) => {
          if (this.config.debug) {
            console.error('[WsSpeechClient] WebSocket error:', error);
          }
          this.trigger(WebsocketsEventType.ERROR, error);
          reject(error);
        };

        this.ws.onclose = () => {
          if (this.config.debug) {
            console.log('[WsSpeechClient] WebSocket closed');
          }
          this.trigger(WebsocketsEventType.CLOSED, null);
        };

        // Connect to WebSocket server
        this.ws.connect({
          url: 'wss://api.coze.cn/v1/speech/ws',
          header: {
            Authorization: `Bearer ${this.config.token}`,
          },
        });
      } catch (error) {
        if (this.config.debug) {
          console.error(
            '[WsSpeechClient] Failed to initialize WebSocket:',
            error,
          );
        }
        this.trigger(WebsocketsEventType.ERROR, error);
        reject(error);
      }
    });
  }

  /**
   * Handle incoming WebSocket message
   * @param {any} message - Message object
   * @private
   */
  private handleMessage(message: any): void {
    if (!message || !message.type) {
      return;
    }

    switch (message.type) {
      case WebsocketsEventType.SPEECH_AUDIO_UPDATE:
        this.handleAudioMessage(message);
        break;
      case WebsocketsEventType.SPEECH_AUDIO_COMPLETED:
        this.handleSpeechEnd(message);
        break;
      case WebsocketsEventType.ERROR:
        this.trigger(WebsocketsEventType.ERROR, message);
        break;
      default:
        if (this.config.debug) {
          console.log(
            `[WsSpeechClient] Received message of type: ${message.type}`,
            message,
          );
        }
        break;
    }

    // Trigger event for the message type
    this.trigger(message.type, message);
  }

  /**
   * Handle audio message
   * @param {any} message - Audio message
   * @private
   */
  private async handleAudioMessage(message: any): Promise<void> {
    if (!message.data || !message.data.audio) {
      return;
    }

    try {
      // Convert Base64 to ArrayBuffer
      const audioData = this.base64ToArrayBuffer(message.data.audio);

      // Feed audio data to player
      if (this.player) {
        await this.player.feed(audioData);

        // Start playback if not already playing
        if (!this.isSpeaking) {
          await this.player.play();
          this.isSpeaking = true;
        }
      }
    } catch (error) {
      if (this.config.debug) {
        console.error(
          '[WsSpeechClient] Failed to handle audio message:',
          error,
        );
      }
      this.trigger(WebsocketsEventType.ERROR, error);
    }
  }

  /**
   * Handle speech end message
   * @param {any} message - Speech end message
   * @private
   */
  private handleSpeechEnd(message: any): void {
    this.isSpeaking = false;

    if (this.config.debug) {
      console.log('[WsSpeechClient] Speech ended');
    }
  }

  /**
   * Convert Base64 string to ArrayBuffer
   * @param {string} base64 - Base64 string
   * @returns {ArrayBuffer} - ArrayBuffer
   * @private
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Send a text-to-speech request
   * @param {Object} options - TTS options
   * @param {string} options.text - Text to convert to speech
   * @param {string} [options.voice='zh-CN-XiaoxiaoNeural'] - Voice ID
   * @param {number} [options.rate=1.0] - Speech rate (0.5 to 2.0)
   * @param {number} [options.pitch=1.0] - Speech pitch (0.5 to 2.0)
   * @returns {Promise<void>}
   */
  async speak(options: {
    text: string;
    voice?: string;
    rate?: number;
    pitch?: number;
  }): Promise<void> {
    try {
      // Reset player
      if (this.player) {
        await this.player.reset();
      }

      this.isSpeaking = false;

      // Initialize WebSocket connection
      await this.initWebSocket();

      // Prepare TTS request
      const ttsRequest = {
        id: this.generateUUID(),
        type: 'speech.synthesize',
        data: {
          text: options.text,
          voice: options.voice || 'zh-CN-XiaoxiaoNeural',
          rate: options.rate || 1.0,
          pitch: options.pitch || 1.0,
        },
      };

      // Send TTS request
      if (this.ws) {
        this.ws.send({
          data: JSON.stringify(ttsRequest),
        });

        if (this.config.debug) {
          console.log('[WsSpeechClient] Sent TTS request:', ttsRequest);
        }
      } else {
        throw new Error('[WsSpeechClient] WebSocket not connected');
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[WsSpeechClient] Failed to speak:', error);
      }
      this.trigger(WebsocketsEventType.ERROR, error);
      throw error;
    }
  }

  /**
   * Stop speech playback
   */
  stop(): void {
    if (this.player) {
      this.player.stop();
    }

    this.isSpeaking = false;

    if (this.config.debug) {
      console.log('[WsSpeechClient] Stopped');
    }
  }

  /**
   * Pause speech playback
   */
  pause(): void {
    if (this.player) {
      this.player.pause();
    }

    if (this.config.debug) {
      console.log('[WsSpeechClient] Paused');
    }
  }

  /**
   * Resume speech playback
   */
  resume(): void {
    if (this.player) {
      this.player.play();
    }

    if (this.config.debug) {
      console.log('[WsSpeechClient] Resumed');
    }
  }

  /**
   * Register an event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  on(event: string, callback: (data: any) => void): void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  /**
   * Remove an event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  off(event: string, callback?: (data: any) => void): void {
    if (!this.eventListeners[event]) {
      return;
    }

    if (callback) {
      // Remove specific callback
      this.eventListeners[event] = this.eventListeners[event].filter(
        listener => listener !== callback,
      );
    } else {
      // Remove all callbacks for the event
      delete this.eventListeners[event];
    }
  }

  /**
   * Trigger an event
   * @param {string} event - Event name
   * @param {any} data - Event data
   * @private
   */
  private trigger(event: string, data: any): void {
    if (!this.eventListeners[event]) {
      return;
    }

    for (const callback of this.eventListeners[event]) {
      try {
        callback(data);
      } catch (error) {
        if (this.config.debug) {
          console.error(
            `[WsSpeechClient] Error in event listener for ${event}:`,
            error,
          );
        }
      }
    }
  }

  /**
   * Clean up resources
   */
  async destroy(): Promise<void> {
    // Close WebSocket connection
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {
        // Ignore close errors
      }
      this.ws = null;
    }

    // Destroy player
    if (this.player) {
      await this.player.destroy();
      this.player = null;
    }

    // Clear event listeners
    this.eventListeners = {};

    this.isSpeaking = false;

    if (this.config.debug) {
      console.log('[WsSpeechClient] Destroyed');
    }
  }
}

export default WsSpeechClient;
