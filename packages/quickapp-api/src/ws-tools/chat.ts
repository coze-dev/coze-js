import { type WsToolsOptions } from '@coze/api/ws-tools';
import { WebsocketsEventType } from '@coze/api';

/**
 * WebSocket Chat Client for Quick App
 * Handles WebSocket-based chat communication
 */
export class WsChatClient {
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
   * Creates a new WsChatClient instance
   * @param {WsToolsOptions} config - Configuration options
   */
  constructor(config: WsToolsOptions) {
    this.config = config;
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
   */
  connect(): Promise<void> {
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
            console.log('[WsChatClient] WebSocket connected');
          }
          resolve();
        };

        this.ws.onmessage = (data: any) => {
          try {
            const message = JSON.parse(data.data);
            this.handleMessage(message);
          } catch (error) {
            if (this.config.debug) {
              console.error('[WsChatClient] Failed to parse message:', error);
            }
          }
        };

        this.ws.onerror = (error: any) => {
          if (this.config.debug) {
            console.error('[WsChatClient] WebSocket error:', error);
          }
          this.trigger(WebsocketsEventType.ERROR, error);
          reject(error);
        };

        this.ws.onclose = () => {
          if (this.config.debug) {
            console.log('[WsChatClient] WebSocket closed');
          }
          this.trigger(WebsocketsEventType.CLOSED, null);
        };

        // Connect to WebSocket server
        this.ws.connect({
          url: 'wss://api.coze.cn/v1/chat/ws',
          header: {
            Authorization: `Bearer ${this.config.token}`,
          },
        });
      } catch (error) {
        if (this.config.debug) {
          console.error(
            '[WsChatClient] Failed to initialize WebSocket:',
            error,
          );
        }
        this.trigger(WebsocketsEventType.ERROR, error);
        reject(error);
      }
    });
  }

  /**
   * Send a message to the WebSocket server
   * @param {any} message - Message to send
   * @returns {Promise<void>}
   */
  send(message: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.ws) {
        const error = new Error('[WsChatClient] WebSocket not connected');
        this.trigger(WebsocketsEventType.ERROR, error);
        reject(error);
        return;
      }

      try {
        // Add message ID if not present
        if (!message.id) {
          message.id = this.generateUUID();
        }

        this.ws.send({
          data: JSON.stringify(message),
          success: () => {
            if (this.config.debug) {
              console.log('[WsChatClient] Message sent:', message);
            }
            resolve();
          },
          fail: (error: any) => {
            if (this.config.debug) {
              console.error('[WsChatClient] Failed to send message:', error);
            }
            this.trigger(WebsocketsEventType.ERROR, error);
            reject(error);
          },
        });
      } catch (error) {
        if (this.config.debug) {
          console.error('[WsChatClient] Failed to send message:', error);
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

    // Trigger event for the message type
    this.trigger(message.type, message);

    if (this.config.debug) {
      console.log(
        `[WsChatClient] Received message of type: ${message.type}`,
        message,
      );
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
            `[WsChatClient] Error in event listener for ${event}:`,
            error,
          );
        }
      }
    }
  }

  /**
   * Close the WebSocket connection
   */
  close(): void {
    if (!this.ws) {
      return;
    }

    try {
      this.ws.close();
      this.ws = null;

      if (this.config.debug) {
        console.log('[WsChatClient] WebSocket closed');
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[WsChatClient] Failed to close WebSocket:', error);
      }
      this.trigger(WebsocketsEventType.ERROR, error);
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.close();
    this.eventListeners = {};

    if (this.config.debug) {
      console.log('[WsChatClient] Destroyed');
    }
  }
}

export default WsChatClient;
