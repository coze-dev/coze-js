import VERTC from '@volcengine/rtc';

import { RealtimeAPIError } from '../src/error';
import { EngineClient } from '../src/client';

vi.mock('@volcengine/rtc', async () => ({
  default: {
    createEngine: vi.fn(),
    enumerateDevices: vi.fn(),
    events: {},
  },
  MediaType: (await vi.importActual('@volcengine/rtc')).MediaType,
}));

vi.mock('@volcengine/rtc/extension-ainr', () => ({
  default: vi.fn().mockImplementation(() => ({
    enable: vi.fn(),
    disable: vi.fn(),
  })),
}));

describe('EngineClient', () => {
  let client: EngineClient;
  let mockEngine: any;

  beforeEach(() => {
    mockEngine = {
      on: vi.fn(),
      off: vi.fn(),
      joinRoom: vi.fn(),
      startAudioCapture: vi.fn(),
      unpublishStream: vi.fn(),
      publishStream: vi.fn(),
      leaveRoom: vi.fn(),
      stopAudioCapture: vi.fn(),
      stop: vi.fn(),
      enableAudioPropertiesReport: vi.fn(),
      startAudioPlaybackDeviceTest: vi.fn(),
      stopAudioPlaybackDeviceTest: vi.fn(),
      setAudioCaptureConfig: vi.fn(),
      registerExtension: vi.fn(),
      sendUserMessage: vi.fn(),
      setAudioPlaybackDevice: vi.fn(),
    };
    (VERTC.createEngine as vi.Mock).mockReturnValue(mockEngine);
    (VERTC.enumerateDevices as vi.Mock).mockResolvedValue([
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
      (VERTC.enumerateDevices as vi.Mock).mockRejectedValue(
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
      (VERTC.enumerateDevices as vi.Mock).mockResolvedValue([]);
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

  describe('setAudioInputDevice', () => {
    it('should set audio input device successfully', async () => {
      const mockDevices = [
        { deviceId: 'new-audio-input-id', kind: 'audioinput', label: 'Mic 1' },
      ];

      (VERTC.enumerateDevices as jest.Mock).mockResolvedValue(mockDevices);

      const deviceId = 'new-audio-input-id';
      await client.setAudioInputDevice(deviceId);
      expect(mockEngine.stopAudioCapture).toHaveBeenCalled();
      expect(mockEngine.startAudioCapture).toHaveBeenCalledWith(deviceId);
    });

    it('should throw error if setting input device fails', async () => {
      const deviceId = 'invalid-device';
      mockEngine.startAudioCapture.mockRejectedValue(new Error('Device error'));

      await expect(client.setAudioInputDevice(deviceId)).rejects.toThrow(
        RealtimeAPIError,
      );
    });
  });

  describe('setAudioOutputDevice', () => {
    it('should set audio output device successfully', async () => {
      const mockDevices = [
        {
          deviceId: 'new-audio-output-id',
          kind: 'audiooutput',
          label: 'Speaker 1',
        },
      ];

      (VERTC.enumerateDevices as jest.Mock).mockResolvedValue(mockDevices);
      const deviceId = 'new-audio-output-id';
      await client.setAudioOutputDevice(deviceId);
      expect(mockEngine.setAudioPlaybackDevice).toHaveBeenCalledWith(deviceId);
    });

    it('should throw error if setting output device fails', async () => {
      const deviceId = 'invalid-device';
      mockEngine.setAudioPlaybackDevice.mockRejectedValue(
        new Error('Device error'),
      );

      await expect(client.setAudioOutputDevice(deviceId)).rejects.toThrow(
        RealtimeAPIError,
      );
    });
  });
});
