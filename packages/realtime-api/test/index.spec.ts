import {
  RealtimeClient,
  type RealtimeClientConfig,
  EventNames,
} from '../src/index.js';
import { EngineClient } from '../src/client.js';

vi.mock('../src/client.js');
vi.mock('@volcengine/rtc/extension-ainr', () => ({
  default: vi.fn().mockImplementation(() => ({
    enable: vi.fn(),
    disable: vi.fn(),
  })),
}));

vi.mock('@coze/api', () => ({
  CozeAPI: vi.fn().mockImplementation(() => ({
    audio: {
      rooms: {
        create: vi.fn().mockResolvedValue({
          app_id: 'test-app-id',
          room_id: 'test-room-id',
          uid: 'test-uid',
          token: 'test-token',
        }),
      },
    },
  })),
}));

describe('RealtimeClient', () => {
  let client: RealtimeClient;
  let config: RealtimeClientConfig;

  beforeEach(() => {
    config = {
      accessToken: 'test-token',
      botId: 'test-bot-id',
      voiceId: 'test-voice-id',
      conversationId: 'test-conversation-id',
      debug: true,
      connectorId: '999',
    };
    client = new RealtimeClient(config);
  });

  describe('constructor', () => {
    it('should create a RealtimeClient instance', () => {
      expect(client).toBeInstanceOf(RealtimeClient);
    });
  });

  describe('connect', () => {
    let mockEngineClient: vi.Mocked<EngineClient>;

    beforeEach(() => {
      mockEngineClient = {
        joinRoom: vi.fn(),
        createLocalStream: vi.fn(),
        bindEngineEvents: vi.fn(),
        on: vi.fn(),
        enableAudioNoiseReduction: vi.fn(),
        initAIAnsExtension: vi.fn(),
        changeAIAnsExtension: vi.fn(),
      } as any;
      (EngineClient as vi.Mock).mockImplementation(() => mockEngineClient);
    });

    it('should connect successfully', async () => {
      const dispatchSpy = vi.spyOn(client, 'dispatch');

      await client.connect();

      expect(mockEngineClient.joinRoom).toHaveBeenCalledWith({
        token: 'test-token',
        roomId: 'test-room-id',
        uid: 'test-uid',
        audioMutedDefault: false,
        videoOnDefault: true,
      });
      expect(mockEngineClient.createLocalStream).toHaveBeenCalled();
      expect(mockEngineClient.bindEngineEvents).toHaveBeenCalled();
      expect(client.isConnected).toBe(true);
      expect(dispatchSpy).toHaveBeenCalledWith(
        EventNames.CONNECTED,
        expect.any(Object),
      );
    });

    it('should connect successfully with noise suppression', async () => {
      const configWithNoise = {
        ...config,
        suppressStationaryNoise: true,
        suppressNonStationaryNoise: true,
      };
      client = new RealtimeClient(configWithNoise);
      const dispatchSpy = vi.spyOn(client, 'dispatch');

      await client.connect();

      expect(mockEngineClient.enableAudioNoiseReduction).toHaveBeenCalled();
      expect(mockEngineClient.initAIAnsExtension).toHaveBeenCalled();
      expect(mockEngineClient.changeAIAnsExtension).toHaveBeenCalledWith(true);
      expect(dispatchSpy).toHaveBeenCalledWith(
        EventNames.SUPPRESS_STATIONARY_NOISE,
        {},
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        EventNames.SUPPRESS_NON_STATIONARY_NOISE,
        {},
      );
      // ... existing expectations ...
    });
  });

  describe('interrupt', () => {
    it('should interrupt the conversation', async () => {
      const mockStop = vi.fn();
      (client as any)._client = { stop: mockStop };
      const dispatchSpy = vi.spyOn(client, 'dispatch');

      await client.interrupt();

      expect(mockStop).toHaveBeenCalledWith();
      expect(dispatchSpy).toHaveBeenCalledWith(EventNames.INTERRUPTED, {});
    });
  });

  describe('disconnect', () => {
    it('should disconnect from the session', async () => {
      const mockDisconnect = vi.fn();
      (client as any)._client = { disconnect: mockDisconnect };
      const dispatchSpy = vi.spyOn(client, 'dispatch');

      await client.disconnect();

      expect(mockDisconnect).toHaveBeenCalled();
      expect(client.isConnected).toBe(false);
      expect(dispatchSpy).toHaveBeenCalledWith(EventNames.DISCONNECTED, {});
    });
  });

  describe('setAudioEnable', () => {
    it('should enable audio', async () => {
      const mockChangeAudioState = vi.fn();
      (client as any)._client = { changeAudioState: mockChangeAudioState };
      const dispatchSpy = vi.spyOn(client, 'dispatch');

      await client.setAudioEnable(true);

      expect(mockChangeAudioState).toHaveBeenCalledWith(true);
      expect(dispatchSpy).toHaveBeenCalledWith(EventNames.AUDIO_UNMUTED, {});
    });

    it('should disable audio', async () => {
      const mockChangeAudioState = vi.fn();
      (client as any)._client = { changeAudioState: mockChangeAudioState };
      const dispatchSpy = vi.spyOn(client, 'dispatch');

      await client.setAudioEnable(false);

      expect(mockChangeAudioState).toHaveBeenCalledWith(false);
      expect(dispatchSpy).toHaveBeenCalledWith(EventNames.AUDIO_MUTED, {});
    });
  });

  describe('enableAudioPropertiesReport', () => {
    it('should enable audio properties report in debug mode', async () => {
      const mockEnableAudioPropertiesReport = vi.fn();
      (client as any)._client = {
        enableAudioPropertiesReport: mockEnableAudioPropertiesReport,
      };

      const result = await client.enableAudioPropertiesReport({
        interval: 100,
      });

      expect(mockEnableAudioPropertiesReport).toHaveBeenCalledWith({
        interval: 100,
      });
      expect(result).toBe(true);
    });

    it('should not enable audio properties report in non-debug mode', async () => {
      const nonDebugClient = new RealtimeClient({ ...config, debug: false });
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation();

      const result = await nonDebugClient.enableAudioPropertiesReport();

      expect(consoleSpy).toHaveBeenCalledWith(
        'enableAudioPropertiesReport is not supported in non-debug mode',
      );
      expect(result).toBe(false);
    });
  });

  describe('startAudioPlaybackDeviceTest', () => {
    it('should start audio playback device test in debug mode', async () => {
      const mockStartAudioPlaybackDeviceTest = vi.fn();
      (client as any)._client = {
        startAudioPlaybackDeviceTest: mockStartAudioPlaybackDeviceTest,
      };

      await client.startAudioPlaybackDeviceTest();

      expect(mockStartAudioPlaybackDeviceTest).toHaveBeenCalled();
    });

    it('should not start audio playback device test in non-debug mode', async () => {
      const nonDebugClient = new RealtimeClient({ ...config, debug: false });
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation();

      await nonDebugClient.startAudioPlaybackDeviceTest();

      expect(consoleSpy).toHaveBeenCalledWith(
        'startAudioPlaybackDeviceTest is not supported in non-debug mode',
      );
    });
  });

  describe('stopAudioPlaybackDeviceTest', () => {
    it('should stop audio playback device test in debug mode', async () => {
      const mockStopAudioPlaybackDeviceTest = vi.fn();
      (client as any)._client = {
        stopAudioPlaybackDeviceTest: mockStopAudioPlaybackDeviceTest,
      };

      await client.stopAudioPlaybackDeviceTest();

      expect(mockStopAudioPlaybackDeviceTest).toHaveBeenCalled();
    });

    it('should not stop audio playback device test in non-debug mode', async () => {
      const nonDebugClient = new RealtimeClient({ ...config, debug: false });
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation();

      await nonDebugClient.stopAudioPlaybackDeviceTest();

      expect(consoleSpy).toHaveBeenCalledWith(
        'stopAudioPlaybackDeviceTest is not supported in non-debug mode',
      );
    });
  });
});
