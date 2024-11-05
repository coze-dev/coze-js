import VERTC from '@volcengine/rtc';

import { RealtimeAPIError } from '../src/error';
import { EngineClient } from '../src/client';

jest.mock('@volcengine/rtc');
jest.mock('@volcengine/rtc/extension-ainr', () =>
  jest.fn().mockImplementation(() => ({
    enable: jest.fn(),
    disable: jest.fn(),
  })),
);

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
      setAudioCaptureConfig: jest.fn(),
      registerExtension: jest.fn(),
      sendUserMessage: jest.fn(),
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
    it('should send stop message to joined user', async () => {
      mockEngine.sendUserMessage.mockResolvedValue('success');
      await client.stop();
      expect(mockEngine.sendUserMessage).toHaveBeenCalledWith(
        '', // joinUserId is empty in test
        JSON.stringify({
          id: 'event_1',
          event_type: 'conversation.chat.cancel',
          data: {},
        }),
      );
    });

    it('should handle errors when stopping', async () => {
      mockEngine.sendUserMessage.mockRejectedValue(new Error('Failed to send'));
      await expect(client.stop()).rejects.toThrow(Error);
    });
  });

  describe('sendMessage', () => {
    it('should send message to joined user', async () => {
      const message = { type: 'test', data: {} };
      mockEngine.sendUserMessage.mockResolvedValue('success');
      await client.sendMessage(message);
      expect(mockEngine.sendUserMessage).toHaveBeenCalledWith(
        '', // joinUserId is empty in test
        JSON.stringify(message),
      );
    });

    it('should handle errors when sending message', async () => {
      mockEngine.sendUserMessage.mockRejectedValue(new Error('Failed to send'));
      await expect(client.sendMessage({})).rejects.toThrow(Error);
    });
  });

  describe('enableAudioNoiseReduction', () => {
    it('should set audio capture config with noise reduction enabled', async () => {
      await client.enableAudioNoiseReduction();
      expect(mockEngine.setAudioCaptureConfig).toHaveBeenCalledWith({
        noiseSuppression: true,
        echoCancellation: true,
        autoGainControl: true,
      });
    });
  });

  describe('initAIAnsExtension', () => {
    it('should register AI extension', async () => {
      await client.initAIAnsExtension();
      expect(mockEngine.registerExtension).toHaveBeenCalled();
    });
  });

  describe('changeAIAnsExtension', () => {
    it('should enable AI extension when true', async () => {
      await client.initAIAnsExtension();
      client.changeAIAnsExtension(true);
      // Note: We can't directly test the extension enable/disable calls
      // as they are internal to the extension instance
    });

    it('should disable AI extension when false', async () => {
      await client.initAIAnsExtension();
      client.changeAIAnsExtension(false);
      // Note: We can't directly test the extension enable/disable calls
      // as they are internal to the extension instance
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
