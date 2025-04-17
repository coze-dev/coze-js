/* eslint-disable */
/// <reference types="vitest" />
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import WsSimultInterpretationClient from '../../src/ws-tools/simult-interpretation';
import BaseWsSimultInterpretationClient from '../../src/ws-tools/simult-interpretation/base';
import { WebSocketAPI } from '../../src/websocket-api';
import { APIError, CozeAPI, WebsocketsEventType } from '../../src';
import PcmRecorder from '../../src/ws-tools/recorder/pcm-recorder';

// Mock uuid
vi.mock('uuid', () => ({
  v4: vi.fn().mockReturnValue('test-uuid'),
}));

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
    onopen: null,
    onmessage: null,
    onerror: null,
    onclose: null,
  })),
}));

// Mock CozeAPI
vi.mock('../../src', async importOriginal => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    CozeAPI: vi.fn().mockImplementation(() => ({
      websockets: {
        audio: {
          simultInterpretation: {
            create: vi.fn().mockResolvedValue({
              onopen: null,
              onmessage: null,
              onerror: null,
              onclose: null,
              send: vi.fn(),
              close: vi.fn(),
              readyState: 1,
            }),
          },
        },
      },
    })),
    APIError: vi.fn().mockImplementation((code, error, message) => ({
      code,
      error,
      message,
    })),
  };
});

// Mock PcmRecorder
vi.mock('../../src/ws-tools/recorder/pcm-recorder', () => ({
  default: vi.fn().mockImplementation(() => ({
    start: vi.fn().mockResolvedValue(true),
    record: vi.fn().mockResolvedValue(true),
    pause: vi.fn().mockResolvedValue(true),
    resume: vi.fn().mockResolvedValue(true),
    destroy: vi.fn().mockResolvedValue(true),
    getSampleRate: vi.fn().mockReturnValue(16000),
    getStatus: vi.fn(),
    getDenoiserEnabled: vi.fn().mockReturnValue(true),
    setDenoiserEnabled: vi.fn(),
    setDenoiserMode: vi.fn(),
    setDenoiserLevel: vi.fn(),
  })),
}));

describe('BaseWsSimultInterpretationClient', () => {
  let client: BaseWsSimultInterpretationClient;
  const mockConfig = {
    baseURL: 'https://api.example.com',
    token: 'test-token',
    audioCaptureConfig: { sampleRate: 16000 },
    websocketOptions: {
      language_code: 'en-US',
      target_language_code: 'zh-CN',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    client = new BaseWsSimultInterpretationClient(mockConfig);
  });

  describe('constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(client.ws).toBeNull();
      expect(CozeAPI).toHaveBeenCalledWith(
        expect.objectContaining({
          baseWsURL: expect.any(String),
          token: 'test-token',
          debug: false,
        }),
      );
      expect(PcmRecorder).toHaveBeenCalledWith(
        expect.objectContaining({
          audioCaptureConfig: mockConfig.audioCaptureConfig,
        }),
      );
    });
  });

  describe('init', () => {
    it('should initialize websocket connection successfully', async () => {
      const initPromise = client.init();

      // Simulate websocket open event
      const ws = await (
        client as any
      ).api.websockets.audio.simultInterpretation.create();
      ws.onopen();

      // Simulate successful connection message
      ws.onmessage({
        event_type: WebsocketsEventType.SIMULT_INTERPRETATION_CREATED,
        id: 'test-id',
        detail: {
          logid: 'test-logid',
        },
      });

      const result = await initPromise;

      expect(result).toBeDefined();
      expect(client.ws).not.toBeNull();
    });

    it('should handle connection errors', async () => {
      const initPromise = client.init();

      // Simulate websocket open event
      const ws = await (
        client as any
      ).api.websockets.audio.simultInterpretation.create();

      // Simulate error message
      ws.onmessage({
        event_type: WebsocketsEventType.ERROR,
        id: 'test-id',
        data: {
          code: 1001,
          msg: 'Connection failed',
        },
        detail: {
          logid: 'test-logid',
        },
      });

      await expect(initPromise).rejects.toMatchObject({
        code: 1001,
        message: 'Connection failed',
      });
    });

    it('should handle websocket error event', async () => {
      const initPromise = client.init();

      // Simulate websocket open event
      const ws = await (
        client as any
      ).api.websockets.audio.simultInterpretation.create();

      // Simulate onerror callback
      ws.onerror(
        {
          data: {
            code: 1002,
            msg: 'WebSocket error',
          },
        },
        new Event('error'),
      );

      await expect(initPromise).rejects.toMatchObject({
        code: 1002,
        message: 'WebSocket error',
      });
    });

    it('should handle message completion event', async () => {
      const initPromise = client.init();
      const closeWsSpy = vi.spyOn(client as any, 'closeWs');

      // Simulate websocket open event
      const ws = await (
        client as any
      ).api.websockets.audio.simultInterpretation.create();
      ws.onopen();

      // Simulate successful connection message
      ws.onmessage({
        event_type: WebsocketsEventType.SIMULT_INTERPRETATION_CREATED,
        id: 'test-id',
        detail: {
          logid: 'test-logid',
        },
      });

      await initPromise;

      // Simulate message completion
      ws.onmessage({
        event_type: WebsocketsEventType.SIMULT_INTERPRETATION_MESSAGE_COMPLETED,
        id: 'test-id',
        detail: {
          logid: 'test-logid',
        },
      });

      expect(closeWsSpy).toHaveBeenCalled();
    });

    it('should return existing websocket if already initialized', async () => {
      // First initialization
      const initPromise = client.init();

      await new Promise(resolve => setTimeout(resolve, 100));
      client.ws?.onmessage?.(
        {
          event_type: WebsocketsEventType.SIMULT_INTERPRETATION_CREATED,
          id: 'test-id',
          detail: {
            logid: 'test-logid',
          },
        },
        null as any as MessageEvent,
      );

      await initPromise;
      const firstWs = client.ws;

      // Reset mock to track second call
      vi.mocked(
        (client as any).api.websockets.audio.simultInterpretation.create,
      ).mockClear();

      // Second initialization
      await client.init();

      // Should not create a new websocket
      expect(
        (client as any).api.websockets.audio.simultInterpretation.create,
      ).not.toHaveBeenCalled();
      expect(client.ws).toBe(firstWs);
    });
  });

  describe('event listeners', () => {
    it('should register event listeners with on method', () => {
      const callback = vi.fn();
      client.on('test-event', callback);

      expect(client['listeners'].get('test-event')?.has(callback)).toBe(true);
    });

    it('should register multiple event listeners', () => {
      const callback = vi.fn();
      client.on(['event1', 'event2'], callback);

      expect(client['listeners'].get('event1')?.has(callback)).toBe(true);
      expect(client['listeners'].get('event2')?.has(callback)).toBe(true);
    });

    it('should remove event listeners with off method', () => {
      const callback = vi.fn();
      client.on('test-event', callback);
      client.off('test-event', callback);

      expect(client['listeners'].get('test-event')?.has(callback)).toBe(false);
    });

    it('should remove multiple event listeners', () => {
      const callback = vi.fn();
      client.on(['event1', 'event2'], callback);
      client.off(['event1', 'event2'], callback);

      expect(client['listeners'].get('event1')?.has(callback)).toBe(false);
      expect(client['listeners'].get('event2')?.has(callback)).toBe(false);
    });

    it('should emit events to registered listeners', () => {
      const callback = vi.fn();
      const data = { event_type: 'test-event', data: { result: 'success' } };

      client.on('test-event', callback);
      (client as any).emit('test-event', data);

      expect(callback).toHaveBeenCalledWith(data);
    });
  });

  describe('closeWs', () => {
    it('should close websocket connection if open', async () => {
      const initPromise = client.init();

      await new Promise(resolve => setTimeout(resolve, 100));
      client.ws?.onmessage?.(
        {
          event_type: WebsocketsEventType.SIMULT_INTERPRETATION_CREATED,
          id: 'test-id',
          detail: {
            logid: 'test-logid',
          },
        },
        null as any as MessageEvent,
      );

      await initPromise;

      // Mock readyState
      client.ws!.readyState = 1;

      (client as any).closeWs();

      expect(client.ws).toBeNull();
    });

    it('should not attempt to close if websocket is not open', () => {
      client.ws = {
        readyState: 3, // CLOSED
        close: vi.fn(),
      } as any;

      (client as any).closeWs();

      expect(client.ws).toBeNull();
    });
  });
});

describe('WsSimultInterpretationClient', () => {
  let client: WsSimultInterpretationClient;
  const mockConfig = {
    baseURL: 'https://api.example.com',
    token: 'test-token',
    audioCaptureConfig: { sampleRate: 16000 },
    websocketOptions: {
      language_code: 'en-US',
      target_language_code: 'zh-CN',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    client = new WsSimultInterpretationClient(mockConfig);
  });

  describe('constructor', () => {
    it('should initialize with isRecording set to false', () => {
      expect((client as any).isRecording).toBe(false);
    });
  });

  describe('connect', () => {
    it('should initialize websocket and start recorder', async () => {
      const initSpy = vi.spyOn(client, 'init').mockResolvedValue({} as any);
      const startSpy = vi.spyOn(client.recorder, 'start');
      const sendSpy = vi.fn();

      client.ws = { send: sendSpy } as any;

      await (client as any).connect();

      expect(initSpy).toHaveBeenCalled();
      expect(startSpy).toHaveBeenCalled();
      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          event_type: WebsocketsEventType.SIMULT_INTERPRETATION_UPDATE,
          data: expect.objectContaining({
            input_audio: expect.objectContaining({
              sample_rate: 16000,
            }),
          }),
        }),
      );
    });

    it('should handle empty voice_id in simultUpdate', async () => {
      const sendSpy = vi.fn();
      client.ws = { send: sendSpy } as any;

      await (client as any).connect({
        data: {
          output_audio: {
            voice_id: '',
          },
        },
      });

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            output_audio: expect.objectContaining({
              voice_id: undefined,
            }),
          }),
        }),
      );
    });
  });

  describe('destroy', () => {
    it('should destroy recorder, clear listeners and close websocket', () => {
      const recorderDestroySpy = vi.spyOn(client.recorder, 'destroy');
      const closeWsSpy = vi.spyOn(client as any, 'closeWs');

      client.destroy();

      expect(recorderDestroySpy).toHaveBeenCalled();
      expect((client as any).listeners.size).toBe(0);
      expect(closeWsSpy).toHaveBeenCalled();
    });
  });

  describe('getStatus', () => {
    it('should return "recording" when isRecording is true and recorder is not ended', () => {
      (client as any).isRecording = true;
      vi.mocked(client.recorder.getStatus).mockReturnValue('recording');

      expect(client.getStatus()).toBe('recording');
    });

    it('should return "paused" when isRecording is true but recorder is ended', () => {
      (client as any).isRecording = true;
      vi.mocked(client.recorder.getStatus).mockReturnValue('ended');

      expect(client.getStatus()).toBe('paused');
    });

    it('should return "ended" when isRecording is false', () => {
      (client as any).isRecording = false;

      expect(client.getStatus()).toBe('ended');
    });
  });

  describe('start', () => {
    it('should connect and start recording', async () => {
      const connectSpy = vi
        .spyOn(client as any, 'connect')
        .mockResolvedValue(undefined);
      const recordSpy = vi.spyOn(client.recorder, 'record');

      await client.start();

      expect(connectSpy).toHaveBeenCalled();
      expect(recordSpy).toHaveBeenCalled();
      expect((client as any).isRecording).toBe(true);
    });

    it('should not start if already recording', async () => {
      const connectSpy = vi.spyOn(client as any, 'connect');
      vi.spyOn(client, 'getStatus').mockReturnValue('recording');
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await client.start();

      expect(consoleSpy).toHaveBeenCalledWith('Recording is already started');
      expect(connectSpy).not.toHaveBeenCalled();
    });

    it('should send audio data when pcmAudioCallback is triggered', async () => {
      const sendSpy = vi.fn();
      client.ws = { send: sendSpy } as any;

      // Mock implementation to capture the callback
      vi.mocked(client.recorder.record).mockImplementation(async options => {
        // Create a sample ArrayBuffer
        const buffer = new ArrayBuffer(4);
        const view = new Uint8Array(buffer);
        view.set([1, 2, 3, 4]);

        // Call the callback with the sample data
        options.pcmAudioCallback({ raw: buffer });
        return true;
      });

      await client.start();

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_APPEND,
          data: expect.objectContaining({
            delta: expect.any(String), // Base64 encoded string
          }),
        }),
      );
    });
  });

  describe('stop', () => {
    it('should send buffer complete message, destroy recorder and close websocket', () => {
      const sendSpy = vi.fn();
      client.ws = { send: sendSpy } as any;
      const recorderDestroySpy = vi.spyOn(client.recorder, 'destroy');
      const closeWsSpy = vi.spyOn(client as any, 'closeWs');

      client.stop();

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_COMPLETE,
        }),
      );
      expect(recorderDestroySpy).toHaveBeenCalled();
      expect(closeWsSpy).toHaveBeenCalled();
      expect((client as any).isRecording).toBe(false);
    });
  });

  describe('pause', () => {
    it('should pause recording if status is recording', async () => {
      vi.spyOn(client, 'getStatus').mockReturnValue('recording');
      const pauseSpy = vi.spyOn(client.recorder, 'pause');

      await client.pause();

      expect(pauseSpy).toHaveBeenCalled();
    });

    it('should throw error if not recording', () => {
      vi.spyOn(client, 'getStatus').mockReturnValue('ended');

      expect(() => client.pause()).toThrow('Recording is not started');
    });
  });

  describe('resume', () => {
    it('should resume recording if status is paused', async () => {
      vi.spyOn(client, 'getStatus').mockReturnValue('paused');
      const resumeSpy = vi.spyOn(client.recorder, 'resume');

      await client.resume();

      expect(resumeSpy).toHaveBeenCalled();
    });

    it('should throw error if not paused', () => {
      vi.spyOn(client, 'getStatus').mockReturnValue('recording');
      expect(() => client.resume()).toThrow('Recording is not paused');
    });
  });

  describe('denoiser methods', () => {
    it('should get denoiser enabled status', () => {
      client.getDenoiserEnabled();

      expect(client.recorder.getDenoiserEnabled).toHaveBeenCalled();
    });

    it('should set denoiser enabled status', () => {
      client.setDenoiserEnabled(true);

      expect(client.recorder.setDenoiserEnabled).toHaveBeenCalledWith(true);
    });

    it('should set denoiser mode', () => {
      const mode = 'music' as any;
      client.setDenoiserMode(mode);

      expect(client.recorder.setDenoiserMode).toHaveBeenCalledWith(mode);
    });

    it('should set denoiser level', () => {
      const level = 'high' as any;
      client.setDenoiserLevel(level);

      expect(client.recorder.setDenoiserLevel).toHaveBeenCalledWith(level);
    });
  });
});
