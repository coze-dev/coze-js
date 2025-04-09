import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import VERTC, { MediaType, NetworkQuality, StreamIndex } from '@volcengine/rtc';

import * as utils from '../src/utils';
import EventNames from '../src/event-names';
import { RealtimeAPIError } from '../src/error';
import { EngineClient } from '../src/client';

const mockEngine = {
  on: vi.fn(),
  off: vi.fn(),
  joinRoom: vi.fn(),
  startAudioCapture: vi.fn(),
  stopAudioCapture: vi.fn(),
  setAudioPlaybackDevice: vi.fn(),
  startVideoCapture: vi.fn(),
  stopVideoCapture: vi.fn(),
  startScreenCapture: vi.fn(),
  stopScreenCapture: vi.fn(),
  setLocalVideoPlayer: vi.fn(),
  unpublishStream: vi.fn(),
  leaveRoom: vi.fn(),
  publishStream: vi.fn(),
  sendUserMessage: vi.fn(),
  enableAudioPropertiesReport: vi.fn(),
  setAudioCaptureConfig: vi.fn(),
  registerExtension: vi.fn(),
  startAudioPlaybackDeviceTest: vi.fn(),
  stopAudioPlaybackDeviceTest: vi.fn(),
  unpublishScreen: vi.fn(),
  publishScreen: vi.fn(),
  setVideoSourceType: vi.fn(),
};

// Mock VERTC
vi.mock('@volcengine/rtc', () => ({
  default: {
    setParameter: vi.fn(),
    createEngine: vi.fn(() => mockEngine),
    events: {
      onUserMessageReceived: 'onUserMessageReceived',
      onUserJoined: 'onUserJoined',
      onUserLeave: 'onUserLeave',
      onError: 'onError',
      onPlayerEvent: 'onPlayerEvent',
      onLocalAudioPropertiesReport: 'onLocalAudioPropertiesReport',
      onRemoteAudioPropertiesReport: 'onRemoteAudioPropertiesReport',
      onNetworkQuality: 'onNetworkQuality',
    },
    destroyEngine: vi.fn(),
  },
  StreamIndex: {
    STREAM_INDEX_MAIN: 0,
    STREAM_INDEX_SCREEN: 1,
  },
  MediaType: {
    AUDIO: 'audio',
  },
  VideoSourceType: {
    VIDEO_SOURCE_TYPE_INTERNAL: 'internal',
  },
  NetworkQuality: {
    EXCELLENT: 0,
  },
}));

// Mock RTCAIAnsExtension
vi.mock('@volcengine/rtc/extension-ainr', () => ({
  default: vi.fn().mockImplementation(() => ({
    enable: vi.fn(),
    disable: vi.fn(),
  })),
}));

// Mock utils
vi.mock('../src/utils', () => ({
  getAudioDevices: vi.fn(),
  isScreenShareDevice: vi.fn(),
  isScreenShareSupported: vi.fn(),
}));

describe('EngineClient', () => {
  let client: EngineClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new EngineClient('test-app-id', true);
  });

  describe('constructor and initialization', () => {
    it('should initialize with test environment', () => {
      // const VERTC = require('@volcengine/rtc').default;
      new EngineClient('test-app-id', true, true);
      expect(VERTC.setParameter).toHaveBeenCalledWith(
        'ICE_CONFIG_REQUEST_URLS',
        ['rtc-test.bytedance.com'],
      );
    });
  });

  describe('event handling', () => {
    it('should bind engine events', () => {
      client.bindEngineEvents();
      expect(mockEngine.on).toHaveBeenCalledTimes(7);
    });

    it('should remove event listeners', () => {
      client.removeEventListener();
      expect(mockEngine.off).toHaveBeenCalledTimes(7);
    });

    it('should handle message parsing error', () => {
      const dispatchSpy = vi.spyOn(client as any, 'dispatch');
      client.handleMessage({ message: 'invalid-json' } as any);
      expect(dispatchSpy).toHaveBeenCalledWith(
        EventNames.ERROR,
        expect.any(Object),
      );
    });
  });

  describe('room operations', () => {
    it('should join room successfully', async () => {
      mockEngine.joinRoom.mockResolvedValueOnce(undefined);
      await client.joinRoom({
        token: 'test-token',
        roomId: 'test-room',
        uid: 'test-uid',
      });
      expect(mockEngine.joinRoom).toHaveBeenCalled();
    });

    it('should handle join room error', async () => {
      mockEngine.joinRoom.mockRejectedValueOnce(new Error('Connection failed'));
      await expect(
        client.joinRoom({
          token: 'test-token',
          roomId: 'test-room',
          uid: 'test-uid',
        }),
      ).rejects.toThrow(RealtimeAPIError);
    });
  });

  describe('device management', () => {
    beforeEach(() => {
      (utils.getAudioDevices as Mock).mockResolvedValue({
        audioInputs: [{ deviceId: 'audio-in-1' }],
        audioOutputs: [{ deviceId: 'audio-out-1' }],
        videoInputs: [{ deviceId: 'video-1' }],
      });
    });

    it('should set audio input device', async () => {
      await client.setAudioInputDevice('audio-in-1');
      expect(mockEngine.startAudioCapture).toHaveBeenCalledWith('audio-in-1');
    });

    it('should throw error for invalid audio input device', async () => {
      (utils.getAudioDevices as Mock).mockResolvedValueOnce({
        audioInputs: [],
        audioOutputs: [],
        videoInputs: [],
      });
      await expect(client.setAudioInputDevice('invalid-id')).rejects.toThrow(
        RealtimeAPIError,
      );
    });

    it('should set video output device', async () => {
      await client.setAudioOutputDevice('audio-out-1');
      expect(mockEngine.setAudioPlaybackDevice).toHaveBeenCalledWith(
        'audio-out-1',
      );
    });

    it('should handle set audio output device error when no devices available', async () => {
      (utils.getAudioDevices as Mock).mockResolvedValueOnce({
        audioInputs: [],
        audioOutputs: [],
        videoInputs: [],
      });
      await expect(client.setAudioOutputDevice('audio-out-1')).rejects.toThrow(
        RealtimeAPIError,
      );
    });
  });

  describe('stream management', () => {
    it('should change audio state', async () => {
      await client.changeAudioState(true);
      expect(mockEngine.publishStream).toHaveBeenCalledWith(MediaType.AUDIO);

      await client.changeAudioState(false);
      expect(mockEngine.unpublishStream).toHaveBeenCalledWith(MediaType.AUDIO);
    });

    it('should change video state', async () => {
      (client as any)._streamIndex = StreamIndex.STREAM_INDEX_MAIN;
      await client.changeVideoState(true);
      expect(mockEngine.startVideoCapture).toHaveBeenCalled();

      await client.changeVideoState(false);
      expect(mockEngine.stopVideoCapture).toHaveBeenCalled();
    });

    it('should change screen share state', async () => {
      (utils.isScreenShareSupported as Mock).mockReturnValue(true);
      (client as any)._streamIndex = StreamIndex.STREAM_INDEX_SCREEN;
      await client.changeVideoState(true);
      expect(mockEngine.startScreenCapture).toHaveBeenCalled();
    });
  });

  describe('message handling', () => {
    it('should send message', async () => {
      mockEngine.sendUserMessage.mockResolvedValueOnce('success');
      await client.sendMessage({ test: 'message' });
      expect(mockEngine.sendUserMessage).toHaveBeenCalled();
    });

    it('should handle send message error', async () => {
      mockEngine.sendUserMessage.mockRejectedValueOnce(
        new Error('Send failed'),
      );
      await expect(client.sendMessage({ test: 'message' })).rejects.toThrow();
    });
  });

  describe('audio features', () => {
    it('should enable audio noise reduction', async () => {
      await client.enableAudioNoiseReduction();
      expect(mockEngine.setAudioCaptureConfig).toHaveBeenCalledWith({
        noiseSuppression: true,
        echoCancellation: true,
        autoGainControl: true,
      });
    });

    it('should initialize AI ANS extension', async () => {
      await client.initAIAnsExtension();
      expect(mockEngine.registerExtension).toHaveBeenCalled();
    });
  });

  describe('audio device testing', () => {
    it('should start audio playback device test', async () => {
      await client.startAudioPlaybackDeviceTest();
      expect(mockEngine.startAudioPlaybackDeviceTest).toHaveBeenCalledWith(
        'audio-test.wav',
        200,
      );
    });

    it('should stop audio playback device test', () => {
      client.stopAudioPlaybackDeviceTest();
      expect(mockEngine.stopAudioPlaybackDeviceTest).toHaveBeenCalled();
    });
  });

  describe('video operations', () => {
    beforeEach(() => {
      (utils.isScreenShareSupported as Mock).mockReturnValue(true);
      (utils.getAudioDevices as Mock).mockResolvedValue({
        audioInputs: [{ deviceId: 'audio-in-1' }],
        audioOutputs: [{ deviceId: 'audio-out-1' }],
        videoInputs: [{ deviceId: 'camera-1' }, { deviceId: 'screenShare' }],
      });
      (utils.isScreenShareDevice as Mock).mockImplementation(
        (deviceId: string) => deviceId === 'screenShare',
      );
    });

    it('should set video input device for camera', async () => {
      await client.setVideoInputDevice('camera-1');
      expect(mockEngine.startVideoCapture).toHaveBeenCalled();
      expect(mockEngine.setLocalVideoPlayer).toHaveBeenCalledWith(0, {
        renderDom: 'local-player',
        userId: undefined,
      });

      await client.setVideoInputDevice('screenShare');
    });

    it('should set video input device for screen share', async () => {
      await client.setVideoInputDevice('screenShare');
      expect(mockEngine.startScreenCapture).toHaveBeenCalled();
      expect(mockEngine.setLocalVideoPlayer).toHaveBeenCalledWith(1, {
        renderDom: 'local-player',
        userId: undefined,
      });

      await client.setVideoInputDevice('camera-1');
    });

    it('should throw error for invalid video device', async () => {
      (utils.getAudioDevices as Mock).mockResolvedValueOnce({
        audioInputs: [],
        audioOutputs: [],
        videoInputs: [],
      });
      await expect(client.setVideoInputDevice('invalid-id')).rejects.toThrow(
        RealtimeAPIError,
      );
    });

    it('should create local stream', async () => {
      await client.createLocalStream('test-user');
      expect(mockEngine.startAudioCapture).toHaveBeenCalledWith('audio-in-1');
    });

    it('should throw error when no devices available', async () => {
      (utils.getAudioDevices as Mock).mockResolvedValueOnce({
        audioInputs: [],
        audioOutputs: [],
        videoInputs: [],
      });
      await expect(client.createLocalStream('test-user')).rejects.toThrow(
        RealtimeAPIError,
      );
    });

    it('should throw error when no video devices available', async () => {
      (client as any)._isSupportVideo = true;
      (utils.getAudioDevices as Mock).mockResolvedValueOnce({
        audioInputs: [{ deviceId: 'audio-in-1' }],
        audioOutputs: [],
        videoInputs: [],
      });
      await expect(client.createLocalStream('test-user')).rejects.toThrow(
        RealtimeAPIError,
      );
    });
  });

  describe('connection management', () => {
    it('should disconnect properly', async () => {
      await client.disconnect();
      expect(mockEngine.leaveRoom).toHaveBeenCalled();
      expect(mockEngine.off).toHaveBeenCalled();
    });

    it('should handle disconnect error', async () => {
      const error = new Error('Disconnect failed');
      mockEngine.leaveRoom.mockRejectedValueOnce(error);
      const dispatchSpy = vi.spyOn(client as any, 'dispatch');

      await expect(client.disconnect()).rejects.toThrow();
      expect(dispatchSpy).toHaveBeenCalledWith(EventNames.ERROR, error);
    });
  });

  describe('stop and message operations', () => {
    it('should send stop message', async () => {
      mockEngine.sendUserMessage.mockResolvedValueOnce('success');
      await client.stop();
      expect(mockEngine.sendUserMessage).toHaveBeenCalledWith(
        '',
        expect.stringContaining('conversation.chat.cancel'),
      );
    });

    it('should handle stop error', async () => {
      const error = new Error('Stop failed');
      mockEngine.sendUserMessage.mockRejectedValueOnce(error);
      const dispatchSpy = vi.spyOn(client as any, 'dispatch');

      await expect(client.stop()).rejects.toThrow();
      expect(dispatchSpy).toHaveBeenCalledWith(EventNames.ERROR, error);
    });
  });

  describe('event handling', () => {
    it('should handle player events', () => {
      const event = { type: 'test-event' };
      const dispatchSpy = vi.spyOn(client as any, 'dispatch');

      client.handlePlayerEvent(event);
      expect(dispatchSpy).toHaveBeenCalledWith(EventNames.PLAYER_EVENT, event);
    });

    it('should handle local audio properties report', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const event = [{ audioPropertiesInfo: { linearVolume: 50 } }];

      client.handleLocalAudioPropertiesReport(event);
      expect(consoleSpy).toHaveBeenCalledWith(
        'handleLocalAudioPropertiesReport',
        event,
      );
    });

    it('should handle remote audio properties report', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const event = { volume: 50 };

      client.handleRemoteAudioPropertiesReport(event);
      expect(consoleSpy).toHaveBeenCalledWith(
        'handleRemoteAudioPropertiesReport',
        event,
      );
    });
    it('should handle event error', () => {
      const event = { type: 'test-event' };
      const dispatchSpy = vi.spyOn(client as any, 'dispatch');

      client.handleEventError(event);
      expect(dispatchSpy).toHaveBeenCalledWith(EventNames.ERROR, event);
    });
    it('should handle network quality', () => {
      const dispatchSpy = vi.spyOn(client as any, 'dispatch');

      client.handleNetworkQuality(
        NetworkQuality.EXCELLENT,
        NetworkQuality.EXCELLENT,
      );
      expect(dispatchSpy).toHaveBeenCalledWith(EventNames.NETWORK_QUALITY, {
        uplinkNetworkQuality: NetworkQuality.EXCELLENT,
        downlinkNetworkQuality: NetworkQuality.EXCELLENT,
      });
    });

    it('should handle user joined', () => {
      const event = { userInfo: { userId: 'test-user-id' } };
      const dispatchSpy = vi.spyOn(client as any, 'dispatch');

      client.handleUserJoin(event as any);
      expect(dispatchSpy).toHaveBeenCalledWith(EventNames.BOT_JOIN, event);
    });

    it('should handle user leave', () => {
      const event = { userInfo: { userId: 'test-user-id' } };
      const dispatchSpy = vi.spyOn(client as any, 'dispatch');

      client.handleUserLeave(event as any);
      expect(dispatchSpy).toHaveBeenCalledWith(EventNames.BOT_LEAVE, event);
    });
  });

  describe('getRtcEngine', () => {
    it('should get rtc engine', () => {
      const engine = client.getRtcEngine();
      expect(engine).toBeDefined();
    });
  });
});
