import { type WsToolsOptions } from '@coze/api/ws-tools';
import { WebsocketsEventType } from '@coze/api';

/**
 * Base WebSocket Transcription Client for Quick App
 * Provides core functionality for WebSocket-based speech-to-text conversion
 */
export class BaseWsTranscriptionClient {
  /**
   * Configuration options
   */
  protected config: WsToolsOptions;

  /**
   * WebSocket connection
   */
  protected ws: any;

  /**
   * Event listeners map
   */
  protected listeners: Map<string, Function[]>;

  /**
   * Creates a new BaseWsTranscriptionClient instance
   * @param {WsToolsOptions} config - Configuration options
   */
  constructor(config: WsToolsOptions) {
    this.config = {
      debug: false,
      ...config,
    };
    this.listeners = new Map();
  }

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback function
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback function
   */
  off(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      return;
    }

    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Trigger event
   * @param {string} event - Event name
   * @param {any} data - Event data
   */
  protected trigger(event: string, data: any): void {
    if (this.config.debug) {
      console.log(
        `[BaseWsTranscriptionClient] Event: ${event}`,
        JSON.stringify(data),
      );
    }

    if (!this.listeners.has(event)) {
      return;
    }

    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        console.log(
          '[BaseWsTranscriptionClient] trigger event callback:',
          event,
        );
        try {
          callback(data);
        } catch (error) {
          console.error(
            `[BaseWsTranscriptionClient] Error in ${event} callback:`,
            error,
          );
        }
      });
    }
  }

  /**
   * Handle WebSocket error
   * @param {any} error - Error object
   */
  protected handleError(error: any): void {
    this.trigger(WebsocketsEventType.ERROR, {
      type: WebsocketsEventType.ERROR,
      data: {
        msg: error?.message || 'Unknown error',
      },
    });
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.listeners.clear();
  }
}

export default BaseWsTranscriptionClient;
