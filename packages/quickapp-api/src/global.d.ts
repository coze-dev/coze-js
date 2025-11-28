/**
 * Global type definitions for Quick App environment
 */

declare global {
  namespace NodeJS {
    interface Global {
      system: {
        audio: any;
        buffer: any;
        websocket: any;
      };
    }
  }
}

export {};