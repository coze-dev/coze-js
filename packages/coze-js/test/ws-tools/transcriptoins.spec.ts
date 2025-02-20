/* eslint-disable */
import { vi } from 'vitest';
import WsTranscriptionClient from '../../src/ws-tools/transcription';
import { WebSocketAPI } from '../../src/websocket-api';
import { WavRecorder } from '../../src/ws-tools/wavtools';
import { APIError, WebsocketsEventType } from '../../src';

// Mock WebSocketAPI
vi.mock('../../src/websocket-api', () => ({
  WebSocketAPI: vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockResolvedValue(true),
    send: vi.fn(),
    close: vi.fn(),
    rws: {
      readyState: 1, // OPEN
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      close: vi.fn(),
      send: vi.fn(),
    },
    readyState: 1,
    reconnect: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
}));

// Mock WavRecorder
vi.mock('../../src/ws-tools/wavtools', () => ({
  WavRecorder: vi.fn().mockImplementation(() => ({
    listDevices: vi.fn().mockResolvedValue([{ deviceId: 'test-device' }]),
    getStatus: vi.fn(),
    begin: vi.fn(),
    record: vi.fn(),
    pause: vi.fn(),
    end: vi.fn(),
    quit: vi.fn(),
  })),
}));

describe('WsTranscriptionClient', () => {
  let client: WsTranscriptionClient;
  const mockConfig = {
    baseURL: 'https://api.example.com',
    token: 'test-token',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    client = new WsTranscriptionClient(mockConfig);
  });

  describe('constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(client.ws).toBeNull();
      expect(WavRecorder).toHaveBeenCalledWith({ sampleRate: 24000 });
    });
  });

  describe('init', () => {
    it('should initialize websocket connection', async () => {
      const initPromise = client.init();

      await new Promise(resolve => setTimeout(resolve, 100));

      client.ws?.onopen?.(undefined as unknown as Event);
      client.ws?.onmessage?.(
        {
          event_type: WebsocketsEventType.TRANSCRIPTIONS_CREATED,
          id: 'test-id',
          detail: {
            logid: 'test-logid',
          },
        },
        undefined as unknown as MessageEvent,
      );

      await initPromise;

      expect(client.ws).toBeDefined();
    });

    it('should handle connection errors', async () => {
      const initPromise = client.init();

      await new Promise(resolve => setTimeout(resolve, 100));

      client.ws?.onmessage?.(
        {
          event_type: WebsocketsEventType.ERROR,
          id: 'test-id',
          data: {
            code: 1,
            msg: 'Connection failed',
          },
          detail: {
            logid: 'test-logid',
          },
        },
        undefined as unknown as MessageEvent,
      );

      await expect(initPromise).rejects.toBeInstanceOf(APIError);
    });

    it('should handle connection on error', async () => {
      const initPromise = client.init();

      await new Promise(resolve => setTimeout(resolve, 100));

      client.ws?.onerror?.(
        {
          event_type: WebsocketsEventType.ERROR,
          id: 'test-id',
          data: {
            code: 1,
            msg: 'Connection failed',
          },
          detail: {
            logid: 'test-logid',
          },
        },
        undefined as unknown as MessageEvent,
      );

      await expect(initPromise).rejects.toBeInstanceOf(APIError);
    });
  });

  describe('recording operations', () => {
    beforeEach(async () => {
      const initPromise = client.init();
      await new Promise(resolve => setTimeout(resolve, 100));
      client.ws?.onmessage?.(
        {
          event_type: WebsocketsEventType.TRANSCRIPTIONS_CREATED,
          id: 'test-id',
          detail: { logid: 'test-logid' },
        },
        undefined as unknown as MessageEvent,
      );
      await initPromise;
    });

    it('should connect', async () => {
      await client.connect();
      expect(client.ws).toBeDefined();
    });

    it('should not connect if already connected', async () => {
      await client.connect();
      expect(client.ws).toBeDefined();

      await client.connect();
      expect(client.ws).toBeDefined();
    });

    it('should pause', async () => {
      await client.pause();
      expect(client['wavRecorder'].pause).toHaveBeenCalled();
    });

    it('should get device list', async () => {
      await client.getDeviceList();
      expect(client['wavRecorder'].listDevices).toHaveBeenCalled();
    });

    it('should get status', () => {
      client.getStatus();
      expect(client['wavRecorder'].getStatus).toHaveBeenCalled();
    });

    it('should start recording', async () => {
      vi.mocked(client['wavRecorder'].getStatus).mockReturnValue('ended');
      await client.record();
      expect(client['wavRecorder'].begin).toHaveBeenCalled();
      expect(client['wavRecorder'].record).toHaveBeenCalled();
    });

    it('should end recording', async () => {
      await client.end();
      expect(client.ws?.send).toHaveBeenCalledWith({
        id: expect.any(String),
        event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_COMPLETE,
      });
      expect(client['wavRecorder'].pause).toHaveBeenCalled();
      expect(client['wavRecorder'].end).toHaveBeenCalled();
    });
  });

  describe('event handling', () => {
    it('should register and remove event listeners', () => {
      const callback = vi.fn();
      client.on('test', callback);
      expect(client['listeners'].get('test')?.has(callback)).toBe(true);

      client.off('test', callback);
      expect(client['listeners'].get('test')?.has(callback)).toBe(false);
    });
  });

  describe('disconnect', () => {
    it('should properly clean up resources', async () => {
      await client.disconnect();
      expect(client['wavRecorder'].quit).toHaveBeenCalled();
      expect(client.ws).toBeNull();
      expect(client['listeners'].size).toBe(0);
    });
  });
});
