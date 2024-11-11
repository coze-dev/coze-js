import VERTC from '@volcengine/rtc';

import { sleep, checkPermission, getAudioDevices } from '../src/utils';

vi.mock('@volcengine/rtc');

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
      (VERTC.enableDevices as vi.Mock).mockResolvedValue({ audio: true });
      const result = await checkPermission();
      expect(result).toBe(true);
    });

    it('should return false when audio permission is denied', async () => {
      (VERTC.enableDevices as vi.Mock).mockResolvedValue({ audio: false });
      const result = await checkPermission();
      expect(result).toBe(false);
    });
  });
  describe('getAudioDevices', () => {
    it('should return filtered audio input and output devices', async () => {
      const mockDevices = [
        { deviceId: '1', kind: 'audioinput', label: 'Mic 1' },
        { deviceId: '2', kind: 'audiooutput', label: 'Speaker 1' },
        { deviceId: '3', kind: 'videoinput', label: 'Camera 1' },
        { deviceId: '', kind: 'audioinput', label: 'Invalid Device' },
      ];

      (VERTC.enumerateDevices as jest.Mock).mockResolvedValue(mockDevices);

      const result = await getAudioDevices();

      expect(result).toEqual({
        audioInputs: [{ deviceId: '1', kind: 'audioinput', label: 'Mic 1' }],
        audioOutputs: [
          { deviceId: '2', kind: 'audiooutput', label: 'Speaker 1' },
        ],
      });

      expect(VERTC.enumerateDevices).toHaveBeenCalled();
    });

    it('should return empty arrays when no devices are found', async () => {
      (VERTC.enumerateDevices as jest.Mock).mockResolvedValue([]);

      const result = await getAudioDevices();

      expect(result).toEqual({
        audioInputs: [],
        audioOutputs: [],
      });
    });
  });
});
