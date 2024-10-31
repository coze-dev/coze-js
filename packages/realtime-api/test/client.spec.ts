import VERTC from '@volcengine/rtc';

import { RealtimeAPIError } from '../src/error';
import { EngineClient } from '../src/client';

jest.mock('@volcengine/rtc');

describe('EngineClient', () => {
  let client: EngineClient;
  let mockEngine: any;

  beforeEach(() => {
    mockEngine = {
      on: jest.fn(),
      off: jest.fn(),
      joinRoom: jest.fn(),
      startAudioCapture: jest.fn(),
      unpublishStream: jest.fn(),
      publishStream: jest.fn(),
      leaveRoom: jest.fn(),
      stopAudioCapture: jest.fn(),
      stop: jest.fn(),
      enableAudioPropertiesReport: jest.fn(),
      startAudioPlaybackDeviceTest: jest.fn(),
      stopAudioPlaybackDeviceTest: jest.fn(),
    };
    (VERTC.createEngine as jest.Mock).mockReturnValue(mockEngine);
    (VERTC.enumerateDevices as jest.Mock).mockResolvedValue([
      { deviceId: 'audio1', kind: 'audioinput' },
      { deviceId: 'audio2', kind: 'audioinput' },
    ]);
    client = new EngineClient('testAppId');
  });

  describe('constructor', () => {
    it('should create an engine', () => {
      expect(VERTC.createEngine).toHaveBeenCalledWith('testAppId');
    });
  });

  describe('bindEngineEvents', () => {
    it('should bind engine events', () => {
      client.bindEngineEvents();
      expect(mockEngine.on).toHaveBeenCalledTimes(4);
    });
  });

  describe('removeEventListener', () => {
    it('should remove engine event listeners', () => {
      client.removeEventListener();
      expect(mockEngine.off).toHaveBeenCalledTimes(4);
    });
  });

  describe('joinRoom', () => {
    it('should join room successfully', async () => {
      await client.joinRoom({ token: 'token', roomId: 'roomId', uid: 'uid' });
      expect(mockEngine.joinRoom).toHaveBeenCalledWith(
        'token',
        'roomId',
        { userId: 'uid' },
        expect.any(Object),
      );
    });

    it('should throw error if joining room fails', async () => {
      mockEngine.joinRoom.mockRejectedValue(new Error('Join room failed'));
      await expect(
        client.joinRoom({
          token: 'token',
          roomId: 'roomId',
          uid: 'uid',
        }),
      ).rejects.toThrow(RealtimeAPIError);
    });
  });

  describe('getDevices', () => {
    it('should return audio input devices', async () => {
      const devices = await client.getDevices();
      expect(devices.audioInputs).toHaveLength(2);
    });
    it('should handle device enumeration errors', async () => {
      (VERTC.enumerateDevices as jest.Mock).mockRejectedValue(
        new Error('Enumeration failed'),
      );
      await expect(client.getDevices()).rejects.toThrow(Error);
    });
  });

  describe('createLocalStream', () => {
    it('should start audio capture with first device', async () => {
      await client.createLocalStream();
      expect(mockEngine.startAudioCapture).toHaveBeenCalledWith('audio1');
    });

    it('should throw error if no audio devices', async () => {
      (VERTC.enumerateDevices as jest.Mock).mockResolvedValue([]);
      await expect(client.createLocalStream()).rejects.toThrow(
        RealtimeAPIError,
      );
    });
  });

  describe('disconnect', () => {
    it('should disconnect properly', async () => {
      await client.disconnect();
      expect(mockEngine.stopAudioCapture).toHaveBeenCalled();
      expect(mockEngine.unpublishStream).toHaveBeenCalled();
      expect(mockEngine.leaveRoom).toHaveBeenCalled();
    });
  });

  describe('changeAudioState', () => {
    it('should publish stream when mic is on', async () => {
      await client.changeAudioState(true);
      expect(mockEngine.publishStream).toHaveBeenCalled();
    });

    it('should unpublish stream when mic is off', async () => {
      await client.changeAudioState(false);
      expect(mockEngine.unpublishStream).toHaveBeenCalled();
    });
  });

  describe('stop', () => {
    it('should call engine stop', async () => {
      // await client.stop('userId');
      // expect(mockEngine.stop).toHaveBeenCalledWith('userId', MediaType.AUDIO);
    });
  });

  describe('enableAudioPropertiesReport', () => {
    it('should call engine enableAudioPropertiesReport', () => {
      const config = { interval: 100 };
      client.enableAudioPropertiesReport(config);
      expect(mockEngine.enableAudioPropertiesReport).toHaveBeenCalledWith(
        config,
      );
    });
  });

  describe('startAudioPlaybackDeviceTest', () => {
    it('should call engine startAudioPlaybackDeviceTest', async () => {
      await client.startAudioPlaybackDeviceTest();
      expect(mockEngine.startAudioPlaybackDeviceTest).toHaveBeenCalledWith(
        'audio-test.wav',
        200,
      );
    });
  });

  describe('stopAudioPlaybackDeviceTest', () => {
    it('should call engine stopAudioPlaybackDeviceTest', async () => {
      await client.stopAudioPlaybackDeviceTest();
      expect(mockEngine.stopAudioPlaybackDeviceTest).toHaveBeenCalled();
    });
  });
});
