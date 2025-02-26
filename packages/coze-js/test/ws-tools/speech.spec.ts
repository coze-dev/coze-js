/* eslint-disable */
import { vi } from 'vitest';
import WsSpeechClient from '../../src/ws-tools/speech';
import { WebSocketAPI } from '../../src/websocket-api';
import { WavStreamPlayer } from '../../src/ws-tools/wavtools';
import { APIError, ErrorRes, WebsocketsEventType } from '../../src';

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

// Mock WavStreamPlayer
vi.mock('../../src/ws-tools/wavtools', () => ({
  WavStreamPlayer: vi.fn().mockImplementation(() => ({
    add16BitPCM: vi.fn(),
    interrupt: vi.fn(),
    resume: vi.fn(),
    pause: vi.fn(),
    togglePlay: vi.fn(),
    isPlaying: vi.fn(),
  })),
}));

describe('WsSpeechClient', () => {
  let client: WsSpeechClient;
  const mockConfig = {
    baseURL: 'https://api.example.com',
    token: 'test-token',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    client = new WsSpeechClient(mockConfig);
  });

  describe('constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(client.ws).toBeNull();
      expect(WavStreamPlayer).toHaveBeenCalledWith({ sampleRate: 24000 });
      expect(client.trackId).toMatch(/^my-track-id-[\w-]+$/);
    });
  });

  describe('init', () => {
    it('should initialize websocket connection', async () => {
      const initPromise = client.init();

      await new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, 100);
      });

      client.ws?.onopen?.(undefined as unknown as Event);
      client.ws?.onmessage?.(
        {
          event_type: WebsocketsEventType.SPEECH_CREATED,
          id: 'test-id',
          detail: {
            logid: 'test-logid',
          },
        },
        undefined as unknown as MessageEvent,
      );

      await initPromise;

      expect(WebSocketAPI).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            authorization: `Bearer ${mockConfig.token}`,
          }),
        }),
      );
      expect(client.ws).toBeDefined();
    });

    it('should handle connection errors', async () => {
      const initPromise = client.init();

      await new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, 100);
      });

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

      try {
        await initPromise;
        throw new Error('test');
      } catch (error) {
        expect(error).toBeInstanceOf(APIError);
      }
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

  describe('connect', () => {
    beforeEach(async () => {
      const initPromise = client.init();

      await new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, 100);
      });

      client.ws?.onmessage?.(
        {
          event_type: WebsocketsEventType.SPEECH_CREATED,
          id: 'test-id',
          detail: {
            logid: 'test-logid',
          },
        },
        undefined as unknown as MessageEvent,
      );

      await initPromise;
    });

    it('should connect with default parameters', async () => {
      await client.connect();

      expect(client.ws?.send).toHaveBeenCalledWith({
        id: expect.any(String),
        event_type: WebsocketsEventType.SPEECH_UPDATE,
        data: {
          output_audio: {
            codec: 'pcm',
            voice_id: undefined,
          },
        },
      });
    });

    it('should connect with specified voice ID', async () => {
      const voiceId = 'test-voice-id';
      await client.connect({ voiceId });

      expect(client.ws?.send).toHaveBeenCalledWith({
        id: expect.any(String),
        event_type: WebsocketsEventType.SPEECH_UPDATE,
        data: {
          output_audio: {
            codec: 'pcm',
            voice_id: voiceId,
          },
        },
      });
    });
  });

  describe('handleAudioMessage', () => {
    beforeEach(async () => {
      const initPromise = client.init();

      await new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, 100);
      });

      client.ws?.onmessage?.(
        {
          event_type: WebsocketsEventType.SPEECH_CREATED,
          id: 'test-id',
          detail: {
            logid: 'test-logid',
          },
        },
        undefined as unknown as MessageEvent,
      );

      await initPromise;
    });

    it('should process audio message correctly', async () => {
      const mockMessage = btoa('test audio data');

      await (client as any).handleAudioMessage(mockMessage);

      expect(client['wavStreamPlayer'].add16BitPCM).toHaveBeenCalledWith(
        expect.any(ArrayBuffer),
        client['trackId'],
      );
    });

    it('should handle audio processing errors', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation();
      const mockError = new Error('Processing failed');
      vi.mocked(WavStreamPlayer).mockImplementationOnce(() => ({
        add16BitPCM: vi.fn().mockRejectedValue(mockError),
      }));

      const client = new WsSpeechClient(mockConfig);
      const mockMessage = btoa('test audio data');
      // await client.init();

      await (client as any).handleAudioMessage(mockMessage);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[speech] wavStreamPlayer error',
        mockError,
      );
    });
  });

  describe('close', () => {
    beforeEach(async () => {
      const initPromise = client.init();

      await new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, 100);
      });

      client.ws?.onmessage?.(
        {
          event_type: WebsocketsEventType.SPEECH_CREATED,
          id: 'test-id',
          detail: {
            logid: 'test-logid',
          },
        },
        undefined as unknown as MessageEvent,
      );

      await initPromise;
    });

    it('should close websocket connection', async () => {
      // await client.init();
      (client as any).closeWs();

      expect(client.ws).toBeNull();
    });
  });

  describe('operations', () => {
    beforeEach(async () => {
      const initPromise = client.init();

      await new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, 100);
      });

      client.ws?.onmessage?.(
        {
          event_type: WebsocketsEventType.SPEECH_CREATED,
          id: 'test-id',
          detail: {
            logid: 'test-logid',
          },
        },
        undefined as unknown as MessageEvent,
      );

      await initPromise;
    });

    it('should append and complete message', async () => {
      client.append('test');
      client.complete();

      expect(client.ws?.send).toHaveBeenCalledWith({
        id: expect.any(String),
        event_type: WebsocketsEventType.INPUT_TEXT_BUFFER_COMPLETE,
      });
    });

    it('should appendAndComplete  ', async () => {
      client.appendAndComplete('test');

      expect(client.ws?.send).toHaveBeenCalledWith({
        id: expect.any(String),
        event_type: WebsocketsEventType.INPUT_TEXT_BUFFER_COMPLETE,
      });
    });
    it('should interrupt', async () => {
      client.interrupt();

      expect(client['wavStreamPlayer'].interrupt).toHaveBeenCalled();
    });

    it('should resume', async () => {
      client.resume();

      expect(client['wavStreamPlayer'].resume).toHaveBeenCalled();
    });

    it('should pause', async () => {
      client.pause();

      expect(client['wavStreamPlayer'].pause).toHaveBeenCalled();
    });

    it('should toggle play', async () => {
      client.togglePlay();

      expect(client['wavStreamPlayer'].togglePlay).toHaveBeenCalled();
    });

    it('should check if playing', async () => {
      client.isPlaying();

      expect(client['wavStreamPlayer'].isPlaying).toHaveBeenCalled();
    });

    it('should on', async () => {
      client.on('test', () => {});

      expect(client['listeners'].get('test')).toBeDefined();
    });

    it('should off', async () => {
      client.off('test', () => {});

      expect(client['listeners'].get('test')).toBeUndefined();
    });

    it('should disconnect', async () => {
      await client.disconnect();

      expect(client.ws).toBeNull();
    });
  });
});
