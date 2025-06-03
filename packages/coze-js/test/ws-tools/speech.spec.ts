/* eslint-disable */
/// <reference types="vitest" />
// @vitest-environment jsdom
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
    addG711a: vi.fn(),
    addG711u: vi.fn(),
    interrupt: vi.fn(),
    resume: vi.fn(),
    pause: vi.fn(),
    togglePlay: vi.fn(),
    isPlaying: vi.fn(),
    defaultFormat: 'pcm',
    streamNode: null,
    localLoopbackStream: null,
    isMuted: false,
    streamProcessor: null,
    context: null,
    stream: null,
    trackSampleOffsets: {},
    interruptedTrackIds: {},
    isPaused: false,
    enableLocalLoopback: false,
    localLoopback: undefined,
    connect: vi.fn(),
    disconnect: vi.fn(),
    setMuted: vi.fn(),
    destroy: vi.fn(),
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

      client.ws?.onmessage?.(
        {
          event_type: WebsocketsEventType.SPEECH_AUDIO_UPDATE,
          id: 'test-id',
          data: {
            delta: btoa('test audio data'),
          },
          detail: {
            logid: 'test-logid',
          },
        },
        undefined as unknown as MessageEvent,
      );
      await new Promise(resolve => setTimeout(resolve, 50));
      client.ws?.onmessage?.(
        {
          event_type: WebsocketsEventType.SPEECH_AUDIO_COMPLETED,
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

    it('should process audio data from the audioDeltaList queue', async () => {
      // Create a valid base64 encoding for the test
      // Using a valid base64 string that represents PCM audio data
      const validBase64 =
        'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

      // Add message to the audioDeltaList
      (client as any).audioDeltaList.push(validBase64);

      // Process the first message in the queue
      await (client as any).handleAudioMessage();

      expect(client['wavStreamPlayer'].add16BitPCM).toHaveBeenCalledWith(
        expect.any(ArrayBuffer),
        client['trackId'],
      );

      // The message should be removed from the queue after processing
      expect((client as any).audioDeltaList.length).toBe(0);
    });

    it('should handle audio processing errors', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation();
      const mockError = new Error('Processing failed');
      vi.mocked(WavStreamPlayer).mockImplementationOnce(() => ({
        scriptSrc: '',
        sampleRate: 24000,
        context: null,
        stream: null,
        trackSampleOffsets: {},
        interruptedTrackIds: {},
        isPaused: false,
        enableLocalLoopback: false,
        defaultFormat: 'pcm',
        localLoopback: undefined,
        add16BitPCM: vi.fn().mockRejectedValue(mockError),
        addG711a: vi.fn(),
        addG711u: vi.fn(),
        interrupt: vi.fn(),
        resume: vi.fn(),
        pause: vi.fn(),
        togglePlay: vi.fn(),
        isPlaying: vi.fn(),
        _start: vi.fn(),
        getTrackSampleOffset: vi.fn(),
        setMediaStream: vi.fn(),
      }));

      const client = new WsSpeechClient(mockConfig);

      // Using a valid base64 string for testing
      const validBase64 =
        'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

      // Add message to the audioDeltaList
      (client as any).audioDeltaList.push(validBase64);

      // Process the message
      await (client as any).handleAudioMessage();

      expect(consoleSpy).toHaveBeenCalledWith(
        '[speech] wavStreamPlayer error Processing failed',
        mockError,
      );
    });

    it('should process messages from audioDeltaList one by one', () => {
      // For this test we're verifying just the queue behavior in isolation
      // Test how audioDeltaList is processed when messages arrive

      // First, verify the onmessage handler correctly adds items to the queue
      client.ws?.onmessage?.(
        {
          event_type: WebsocketsEventType.SPEECH_AUDIO_UPDATE,
          id: 'test-id',
          data: {
            delta:
              'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
          },
          detail: {
            logid: 'test-logid',
          },
        },
        undefined as unknown as MessageEvent,
      );

      // Add another message
      client.ws?.onmessage?.(
        {
          event_type: WebsocketsEventType.SPEECH_AUDIO_UPDATE,
          id: 'test-id-2',
          data: {
            delta:
              'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAB=',
          },
          detail: {
            logid: 'test-logid-2',
          },
        },
        undefined as unknown as MessageEvent,
      );

      // Verify that the messages have been added to the queue
      expect((client as any).audioDeltaList.length).toBe(2);
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
      // Using a valid base64 string for testing
      const validBase64 =
        'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

      // Add to the queue and process
      (client as any).audioDeltaList.push(validBase64);
      await (client as any).handleAudioMessage();

      await client.resume();

      expect(client['wavStreamPlayer'].resume).toHaveBeenCalled();
    });

    it('should pause', async () => {
      client.pause();

      expect(client['wavStreamPlayer'].pause).toHaveBeenCalled();
    });

    it('should clear playbackTimeout before pause', async () => {
      // Using a valid base64 string for testing
      const validBase64 =
        'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

      // Add to the queue and process
      (client as any).audioDeltaList.push(validBase64);
      await (client as any).handleAudioMessage();

      await client.pause();

      expect(client['playbackTimeout']).toBeNull();
      expect(client['elapsedBeforePause']).toBeDefined();
    });

    it('should toggle play', async () => {
      client.togglePlay();

      expect(client['wavStreamPlayer'].isPlaying).toHaveBeenCalled();
      expect(client['wavStreamPlayer'].resume).toHaveBeenCalled();
    });

    it('should toggle play2', async () => {
      client.togglePlay();
      vi.spyOn(client, 'isPlaying').mockReturnValue(false);
      expect(client['wavStreamPlayer'].resume).toHaveBeenCalled();
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
