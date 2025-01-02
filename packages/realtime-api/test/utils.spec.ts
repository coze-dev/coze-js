import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import type { Mock } from 'vitest';
import VERTC from '@volcengine/rtc';

import {
  sleep,
  checkPermission,
  getAudioDevices,
  checkDevicePermission,
  isScreenShareSupported,
} from '../src/utils';

vi.mock('@volcengine/rtc', () => ({
  default: {
    enableDevices: vi.fn(),
    enumerateDevices: vi.fn(),
    enumerateAudioCaptureDevices: vi.fn(),
    enumerateAudioPlaybackDevices: vi.fn(),
  },
}));

// Mock navigator.mediaDevices
const mockNavigator = {
  mediaDevices: {
    getDisplayMedia: () => Promise.resolve({}),
  },
};

// Add this before the tests
beforeAll(() => {
  // @ts-expect-error - mock global navigator
  global.navigator = mockNavigator;
});

afterAll(() => {
  // @ts-expect-error - cleanup
  delete global.navigator;
});

describe('Utils', () => {
  describe('sleep', () => {
    it('should resolve after the specified time', async () => {
      vi.useFakeTimers();
      const promise = sleep(1000);
      vi.advanceTimersByTime(1000);
      await expect(promise).resolves.toBeUndefined();
      vi.useRealTimers();
    });
  });

  describe('checkPermission', () => {
    it('should return true when audio permission is granted', async () => {
      (VERTC.enableDevices as Mock).mockResolvedValue({ audio: true });
      const result = await checkPermission();
      expect(result).toBe(true);
    });

    it('should return false when audio permission is denied', async () => {
      (VERTC.enableDevices as Mock).mockResolvedValue({ audio: false });
      const result = await checkPermission();
      expect(result).toBe(false);
    });
    it('should throw error when enableDevices failed', async () => {
      (VERTC.enableDevices as Mock).mockRejectedValue(new Error('test'));
      const result = await checkPermission();
      expect(result).toBe(false);
    });
  });

  describe('checkDevicePermission', () => {
    it('should return true when audio permission is granted', async () => {
      (VERTC.enableDevices as Mock).mockResolvedValue({ audio: true });
      const result = await checkDevicePermission();
      expect(result.audio).toBe(true);
    });

    it('should return false when audio permission is denied', async () => {
      (VERTC.enableDevices as Mock).mockResolvedValue({ audio: false });
      const result = await checkDevicePermission();
      expect(result.audio).toBe(false);
    });
  });

  describe('getAudioDevices', () => {
    it('should return filtered audio input and output devices', async () => {
      const mockDevices = [
        { deviceId: '1', kind: 'audioinput', label: 'Mic 1' },
        { deviceId: '2', kind: 'audiooutput', label: 'Speaker 1' },
        { deviceId: '3', kind: 'videoinput', label: 'Camera 1' },
      ];

      (VERTC.enumerateDevices as Mock).mockResolvedValue(mockDevices);

      const result = await getAudioDevices({ video: true });

      expect(result).toEqual({
        audioInputs: [{ deviceId: '1', kind: 'audioinput', label: 'Mic 1' }],
        audioOutputs: [
          { deviceId: '2', kind: 'audiooutput', label: 'Speaker 1' },
        ],
        videoInputs: [
          { deviceId: '3', kind: 'videoinput', label: 'Camera 1' },
          expect.objectContaining({
            deviceId: 'screenShare',
            kind: 'videoinput',
            label: 'Screen Share',
          }),
        ],
      });

      expect(VERTC.enumerateDevices).toHaveBeenCalled();
    });

    it('should return empty arrays when no devices are found', async () => {
      (VERTC.enumerateDevices as Mock).mockResolvedValue([]);

      const originalNavigator = global.navigator;
      // @ts-expect-error - mock navigator without getDisplayMedia
      global.navigator = { mediaDevices: {} };

      const result = await getAudioDevices({ video: true });

      expect(result).toEqual({
        audioInputs: [],
        audioOutputs: [],
        videoInputs: [],
      });

      // @ts-expect-error - restore navigator
      global.navigator = originalNavigator;
    });

    it('should handle legacy device enumeration when enumerateDevices fails', async () => {
      // Mock enumerateDevices to fail
      (VERTC.enumerateDevices as Mock).mockRejectedValue(
        new Error('Not supported'),
      );

      // Mock legacy device enumeration methods
      (VERTC.enumerateAudioCaptureDevices as Mock).mockResolvedValue([
        { deviceId: '1', kind: 'audioinput', label: 'Legacy Mic 1' },
      ]);
      (VERTC.enumerateAudioPlaybackDevices as Mock).mockResolvedValue([
        { deviceId: '2', kind: 'audiooutput', label: 'Legacy Speaker 1' },
      ]);

      const result = await getAudioDevices({ video: false });

      expect(result).toEqual({
        audioInputs: [
          { deviceId: '1', kind: 'audioinput', label: 'Legacy Mic 1' },
        ],
        audioOutputs: [
          { deviceId: '2', kind: 'audiooutput', label: 'Legacy Speaker 1' },
        ],
        videoInputs: [],
      });

      expect(VERTC.enumerateAudioCaptureDevices).toHaveBeenCalled();
      expect(VERTC.enumerateAudioPlaybackDevices).toHaveBeenCalled();
    });

    it('should handle when both modern and legacy device enumeration fails', async () => {
      (VERTC.enumerateAudioCaptureDevices as Mock).mockResolvedValue([]);
      (VERTC.enumerateAudioPlaybackDevices as Mock).mockResolvedValue([]);

      const result = await getAudioDevices({ video: false });

      expect(result).toEqual({
        audioInputs: [],
        audioOutputs: [],
        videoInputs: [],
      });
    });
  });

  describe('isScreenShareSupported', () => {
    it('should return true when getDisplayMedia is available', () => {
      expect(isScreenShareSupported()).toBe(true);
    });

    it('should return false when getDisplayMedia is not available', () => {
      const originalNavigator = global.navigator;
      // @ts-expect-error - mock navigator without getDisplayMedia
      global.navigator = { mediaDevices: {} };
      expect(isScreenShareSupported()).toBe(false);
      // @ts-expect-error - restore navigator
      global.navigator = originalNavigator;
    });
  });
});
