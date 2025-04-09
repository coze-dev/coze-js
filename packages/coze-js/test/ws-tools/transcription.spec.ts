/* eslint-disable */
/// <reference types="vitest" />
// @vitest-environment jsdom
import { vi } from 'vitest';
import WsTranscriptionClient from '../../src/ws-tools/transcription';
import PcmRecorder from '../../src/ws-tools/recorder/pcm-recorder';
import { APIError, WebsocketsEventType } from '../../src';

// Mock window.__denoiser
const mockDenoiser = {
  createProcessor: vi.fn().mockReturnValue({
    enable: vi.fn().mockResolvedValue(undefined),
    disable: vi.fn().mockResolvedValue(undefined),
    setMode: vi.fn().mockResolvedValue(undefined),
    setLevel: vi.fn().mockResolvedValue(undefined),
    dump: vi.fn(),
    on: vi.fn(),
    removeAllListeners: vi.fn(),
    pipe: vi.fn().mockReturnThis(),
    enabled: true,
  }),
};

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
vi.mock('../../src/ws-tools/recorder/pcm-recorder', () => ({
  default: vi.fn().mockImplementation(() => ({
    destroy: vi.fn(),
    getStatus: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    record: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    getSampleRate: vi.fn().mockReturnValue(24000),
  })),
}));

// Mock agora-rtc-sdk-ng/esm
vi.mock('agora-rtc-sdk-ng/esm', () => ({
  createMicrophoneAudioTrack: vi.fn().mockResolvedValue({
    pipe: vi.fn().mockReturnThis(),
    processorDestination: {},
    close: vi.fn(),
    getMediaStreamTrack: vi.fn().mockReturnValue({
      enabled: true,
      stop: vi.fn(),
    }),
  }),
  createCustomAudioTrack: vi.fn().mockResolvedValue({
    pipe: vi.fn().mockReturnThis(),
    processorDestination: {},
    close: vi.fn(),
    getMediaStreamTrack: vi.fn().mockReturnValue({
      enabled: true,
      stop: vi.fn(),
    }),
  }),
}));

// Mock agora-extension-ai-denoiser
vi.mock('agora-extension-ai-denoiser', () => ({
  AIDenoiserExtension: class {
    static instance = mockDenoiser;
    createProcessor() {
      return mockDenoiser.createProcessor();
    }
  },
  AIDenoiserProcessor: class {},
}));

// Mock agora-rte-extension
vi.mock('agora-rte-extension', () => ({
  IAudioProcessor: class {},
  AudioProcessor: class {},
}));

vi.mock('../../src/ws-tools/utils', () => ({
  checkDenoiserSupport: vi.fn().mockReturnValue(true),
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
      expect(PcmRecorder).toHaveBeenCalled();
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
      await client['connect']();
      expect(client.ws).toBeDefined();
    });

    it('should not connect if already connected', async () => {
      await client['connect']();
      expect(client.ws).toBeDefined();

      await client['connect']();
      expect(client.ws).toBeDefined();
    });

    it('should pause', async () => {
      client['isRecording'] = true;
      await client.pause();
      expect(client['recorder'].pause).toHaveBeenCalled();
    });

    it('should get status', () => {
      client['isRecording'] = true;
      client.getStatus();
      expect(client['recorder'].getStatus).toHaveBeenCalled();
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
      await client.destroy();
      expect(client.ws).toBeNull();
      expect(client['listeners'].size).toBe(0);
    });
  });
});
