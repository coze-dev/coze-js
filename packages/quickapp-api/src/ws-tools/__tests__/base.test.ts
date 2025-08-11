import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WebsocketsEventType } from '@coze/api';

import { BaseWsTranscriptionClient } from '../base';

describe('BaseWsTranscriptionClient', () => {
  let client: BaseWsTranscriptionClient;
  const mockConfig = {
    url: 'wss://example.com/ws',
    token: 'test-token',
    language: 'zh-CN',
  };

  beforeEach(() => {
    client = new BaseWsTranscriptionClient(mockConfig);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct config', () => {
    expect(client.config).toEqual({
      token: 'test-token',
      url: 'wss://example.com/ws',
      language: 'zh-CN',
      debug: false,
    });
    expect(client.listeners).toBeInstanceOf(Map);
  });

  it('should add and handle event listeners', () => {
    const mockCallback = vi.fn();
    const eventType = 'test-event';
    const eventData = { message: 'test' };

    client.on(eventType, mockCallback);

    // Access protected method using type assertion
    (client as any).trigger(eventType, eventData);

    expect(mockCallback).toHaveBeenCalledWith(eventData);
  });

  it('should remove event listeners', () => {
    const mockCallback = vi.fn();
    const eventType = 'test-event';

    client.on(eventType, mockCallback);
    client.off(eventType, mockCallback);

    // Access protected method using type assertion
    (client as any).trigger(eventType, {});

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should handle multiple listeners for same event', () => {
    const mockCallback1 = vi.fn();
    const mockCallback2 = vi.fn();
    const eventType = 'test-event';
    const eventData = { message: 'test' };

    client.on(eventType, mockCallback1);
    client.on(eventType, mockCallback2);
    client.trigger(eventType, eventData);

    expect(mockCallback1).toHaveBeenCalledWith(eventData);
    expect(mockCallback2).toHaveBeenCalledWith(eventData);
  });

  it('should handle destroy method', () => {
    const mockCallback = vi.fn();
    const eventType = 'test-event';

    client.on(eventType, mockCallback);
    client.destroy();
    client.trigger(eventType, {});

    expect(mockCallback).not.toHaveBeenCalled();
    expect(client.listeners.size).toBe(0);
  });
});
