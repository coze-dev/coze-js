/// <reference types="vitest" />
// @vitest-environment jsdom
/* eslint-disable */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock MediaStream which is not available in jsdom environment
global.MediaStream = vi.fn().mockImplementation(() => ({
  getAudioTracks: vi.fn().mockReturnValue([]),
  getVideoTracks: vi.fn().mockReturnValue([]),
  getTracks: vi.fn().mockReturnValue([]),
  addTrack: vi.fn(),
  removeTrack: vi.fn(),
}));
import WsChatClient from '@ws-tools/chat';
import { APIError, RoleType, WebSocketAPI, WebsocketsEventType } from '@/index';
import { WavStreamPlayer } from '@ws-tools/wavtools';
import { PcmRecorder } from '@ws-tools/index';
import {
  AIDenoiserProcessorLevel,
  AIDenoiserProcessorMode,
} from 'agora-extension-ai-denoiser';

// Mock the pcm-recorder module
vi.mock('@ws-tools/index', () => ({
  PcmRecorder: vi.fn().mockImplementation(() => ({
    config: {
      deviceId: 'default',
    },
    destroy: vi.fn(),
    getStatus: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    record: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    getSampleRate: vi.fn().mockReturnValue(41000),
    setDenoiserEnabled: vi.fn(),
    setDenoiserLevel: vi.fn(),
    setDenoiserMode: vi.fn(),
    getRawMediaStream: vi.fn().mockReturnValue(new MediaStream()),
  })),
}));

// Mock WebSocketAPI
vi.mock('@/index', () => ({
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
    reconnect: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    readyState: 1,
  })),
  CozeAPI: vi.fn().mockImplementation(() => ({
    getToken: vi.fn().mockResolvedValue('test-token'),
  })),
}));

vi.mock(import('@/index'), async importOriginal => {
  const actual = await importOriginal();
  return {
    ...actual,
    // your mocked methods
  };
});

// Mock WavStreamPlayer
vi.mock('@ws-tools/wavtools', () => ({
  WavStreamPlayer: vi.fn().mockImplementation(() => ({
    add16BitPCM: vi.fn(),
    interrupt: vi.fn(),
    resume: vi.fn(),
    pause: vi.fn(),
    togglePlay: vi.fn(),
    isPlaying: vi.fn(),
    setMediaStream: vi.fn(),
    setSampleRate: vi.fn(),
    setDefaultFormat: vi.fn(),
    addG711a: vi.fn(),
    addG711u: vi.fn(),
    destroy: vi.fn(),
  })),
}));

vi.mock('@ws-tools/utils', () => ({
  getAudioDevices: vi.fn().mockResolvedValue({
    audioInputs: [
      { deviceId: 'default', label: 'Default Microphone' },
      { deviceId: 'device1', label: 'Microphone 1' },
      { deviceId: 'device2', label: 'Microphone 2' },
    ],
    audioOutputs: [
      { deviceId: 'default', label: 'Default Speaker' },
      { deviceId: 'output1', label: 'Speaker 1' },
    ],
  }),
  isBrowserExtension: vi.fn().mockReturnValue(false),
}));

describe('WebSocket Chat Tools', () => {
  let client: WsChatClient;

  beforeEach(() => {
    vi.clearAllMocks();

    client = new WsChatClient({
      baseWsURL: 'wss://api.coze.ai',
      token: 'test-token',
      botId: 'test-bot-id',
    });
  });

  afterEach(() => {
    // vi.resetAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(client.ws).toBeNull();
      expect(WavStreamPlayer).toHaveBeenCalledWith({
        sampleRate: 24000,
        enableLocalLookback: false,
      });
      expect(PcmRecorder).toHaveBeenCalled();
    });
  });

  describe('connect', () => {
    it('should connect to the chat', async () => {
      // mock
      const mockWebsocket = new WebSocketAPI('wss://coze.ai/test-url');
      vi.spyOn(client as any, 'init').mockResolvedValue(mockWebsocket);
      mockWebsocket.send = vi.fn();

      // act
      await client.connect();

      // assert
      expect(client.ws?.send).toHaveBeenCalled();
    });
  });

  describe('disconnect', () => {
    it('should disconnect from the chat', async () => {
      // mock
      const mockWebsocket = new WebSocketAPI('wss://coze.ai/test-url');
      vi.spyOn(client as any, 'init').mockResolvedValue(mockWebsocket);

      // act
      await client.connect();
      await client.disconnect();

      // assert
      expect(client.recorder?.destroy).toHaveBeenCalled();
      expect(client.ws).toBeNull();
    });
  });

  describe('setAudioEnable', () => {
    it('should set the audio enable', async () => {
      // mock
      const mockWebsocket = new WebSocketAPI('wss://coze.ai/test-url');
      vi.spyOn(client as any, 'init').mockResolvedValue(mockWebsocket);
      vi.spyOn(client['recorder'], 'getStatus').mockReturnValue('ended');
      client['recorder'].audioTrack = {} as any;

      // act
      await client.connect();
      await client.setAudioEnable(true);

      // assert
      expect(client.recorder?.resume).toHaveBeenCalled();
    });

    it('should start recording when audio is first enabled', async () => {
      // mock
      const mockWebsocket = new WebSocketAPI('wss://coze.ai/test-url');
      vi.spyOn(client as any, 'init').mockResolvedValue(mockWebsocket);
      vi.spyOn(client['recorder'], 'getStatus').mockReturnValue('ended');
      client['isMuted'] = true;

      // act
      await client.connect();
      await client.setAudioEnable(true);

      // assert
      expect(client.recorder?.start).toHaveBeenCalled();
      expect(client['isMuted']).toBe(false);
    });

    it('should set the audio enable to false', async () => {
      // mock
      const mockWebsocket = new WebSocketAPI('wss://coze.ai/test-url');
      vi.spyOn(client as any, 'init').mockResolvedValue(mockWebsocket);
      vi.spyOn(client['recorder'], 'getStatus').mockReturnValue('recording');

      // act
      await client.connect();
      await client.setAudioEnable(false);

      // assert
      expect(client.recorder?.pause).toHaveBeenCalled();
    });
  });

  describe('setAudioInputDevice', () => {
    it('should set the audio input device', async () => {
      // mock
      const mockWebsocket = new WebSocketAPI('wss://coze.ai/test-url');
      vi.spyOn(client as any, 'init').mockResolvedValue(mockWebsocket);
      vi.spyOn(client['recorder'], 'getStatus').mockReturnValue('ended');

      // act
      await client.connect();
      await client.setAudioInputDevice('default');
      // assert
      expect(client.recorder?.config.deviceId).toBeUndefined();
    });

    it('should set the audio input device to a specific device', async () => {
      // mock
      const mockWebsocket = new WebSocketAPI('wss://coze.ai/test-url');
      vi.spyOn(client as any, 'init').mockResolvedValue(mockWebsocket);
      vi.spyOn(client['recorder'], 'getStatus').mockReturnValue('ended');

      // act
      await client.connect();
      await client.setAudioInputDevice('device1');

      // assert
      expect(client.recorder?.config.deviceId).toBe('device1');
    });
  });

  describe('interrupt', () => {
    it('should interrupt the conversation', async () => {
      // mock
      const mockWebsocket = new WebSocketAPI('wss://coze.ai/test-url');
      vi.spyOn(client as any, 'init').mockResolvedValue(mockWebsocket);
      mockWebsocket.send = vi.fn();
      // act
      await client.connect();
      await client.interrupt();

      // assert
      expect(client.ws?.send).toHaveBeenCalledWith({
        id: expect.any(String),
        event_type: WebsocketsEventType.CONVERSATION_CHAT_CANCEL,
      });
    });
  });

  describe('setDenoiserEnabled', () => {
    it('should set the denoiser enabled', async () => {
      // act
      await client.setDenoiserEnabled(true);
      // assert
      expect(client.recorder?.setDenoiserEnabled).toHaveBeenCalledWith(true);
    });
  });

  describe('setDenoiserLevel', () => {
    it('should set the denoiser level', async () => {
      // act
      await client.setDenoiserLevel(AIDenoiserProcessorLevel.SOFT);
      // assert
      expect(client.recorder?.setDenoiserLevel).toHaveBeenCalledWith(
        AIDenoiserProcessorLevel.SOFT,
      );
    });
  });

  describe('setDenoiserMode', () => {
    it('should set the denoiser mode', async () => {
      // act
      await client.setDenoiserMode(AIDenoiserProcessorMode.NSNG);
      // assert
      expect(client.recorder?.setDenoiserMode).toHaveBeenCalledWith(
        AIDenoiserProcessorMode.NSNG,
      );
    });
  });

  describe('sendMessage', () => {
    it('should send a message', async () => {
      // mock
      const mockWebsocket = new WebSocketAPI('wss://coze.ai/test-url');
      vi.spyOn(client as any, 'init').mockResolvedValue(mockWebsocket);
      mockWebsocket.send = vi.fn();

      // act
      await client.connect();
      await client.sendMessage({
        id: expect.any(String),
        event_type: WebsocketsEventType.CONVERSATION_MESSAGE_CREATE,
        data: {
          role: RoleType.User,
          content_type: 'text',
          content: 'Hello, world!',
        },
      });
      // assert
      expect(client.ws?.send).toHaveBeenCalledWith({
        id: expect.any(String),
        event_type: WebsocketsEventType.CONVERSATION_MESSAGE_CREATE,
        data: {
          role: RoleType.User,
          content_type: 'text',
          content: 'Hello, world!',
        },
      });
    });
  });

  describe('sendTextMessage', () => {
    it('should send a text message', async () => {
      // mock
      const mockWebsocket = new WebSocketAPI('wss://coze.ai/test-url');
      vi.spyOn(client as any, 'init').mockResolvedValue(mockWebsocket);
      mockWebsocket.send = vi.fn();

      // act
      await client.connect();
      await client.sendTextMessage('Hello, world!');

      // assert
      expect(client.ws?.send).toHaveBeenCalledWith({
        id: expect.any(String),
        event_type: WebsocketsEventType.CONVERSATION_MESSAGE_CREATE,
        data: {
          role: RoleType.User,
          content_type: 'text',
          content: 'Hello, world!',
        },
      });
    });
  });

  describe('on', () => {
    it('should add an event listener', async () => {
      // act
      await client.on('test', () => {});
      // assert
      expect(client['listeners'].get('test')?.size).toBe(1);
    });

    it('should remove an event listener', async () => {
      const fn = () => {};
      // act
      await client.on('test', fn);
      await client.off('test', fn);
      // assert
      expect(client['listeners'].get('test')?.size).toBe(0);
    });

    it('should add array of event listeners', async () => {
      // act
      await client.on(['test', 'test2'], () => {});
      // assert
      expect(client['listeners'].get('test')?.size).toBe(1);
      expect(client['listeners'].get('test2')?.size).toBe(1);
    });

    it('should remove array of event listeners', async () => {
      const fn = () => {};
      // act
      await client.on(['test', 'test2'], fn);
      await client.off(['test', 'test2'], fn);
      // assert
      expect(client['listeners'].get('test')?.size).toBe(0);
      expect(client['listeners'].get('test2')?.size).toBe(0);
    });
  });

  describe('init', () => {
    it('should initialize websocket connection', async () => {
      const initPromise = client['init']();

      await new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, 100);
      });

      client.ws?.onopen?.(undefined as unknown as Event);
      client.ws?.onmessage?.(
        {
          event_type: WebsocketsEventType.CHAT_CREATED,
          data: {},
          id: 'test-id',
          detail: {
            logid: 'test-logid',
          },
        },
        undefined as unknown as MessageEvent,
      );

      client.ws?.onmessage?.(
        {
          event_type: WebsocketsEventType.CONVERSATION_AUDIO_DELTA,
          id: 'test-id',
          data: {
            content: btoa('test audio data'),
          },
          detail: {
            logid: 'test-logid',
          },
        },
        undefined as unknown as MessageEvent,
      );
      await new Promise(resolve => setTimeout(resolve, 50));

      await initPromise;

      expect(client.ws).toBeDefined();
    });

    it('should handle connection errors', async () => {
      const initPromise = client['init']();

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
      const initPromise = client['init']();

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
});
