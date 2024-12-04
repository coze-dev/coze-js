import { type RequestConfig } from './types';
import { BaseEventSource } from './base';

/**
 * Default implementation for multiple platforms, used only for type compatibility.
 */
export class EventSource extends BaseEventSource {
  constructor(_: RequestConfig) {
    super();
  }

  start() {
    throw new Error('Not implement');
  }

  abort() {
    throw new Error('Not implement');
  }
}
