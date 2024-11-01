import VERTC from '@volcengine/rtc';

import { sleep, checkPermission } from '../src/utils';

jest.mock('@volcengine/rtc');

describe('Utils', () => {
  describe('sleep', () => {
    it('should resolve after the specified time', async () => {
      jest.useFakeTimers();
      const promise = sleep(1000);
      jest.advanceTimersByTime(1000);
      await expect(promise).resolves.toBeUndefined();
      jest.useRealTimers();
    });
  });

  describe('checkPermission', () => {
    it('should return true when audio permission is granted', async () => {
      (VERTC.enableDevices as jest.Mock).mockResolvedValue({ audio: true });
      const result = await checkPermission();
      expect(result).toBe(true);
    });

    it('should return false when audio permission is denied', async () => {
      (VERTC.enableDevices as jest.Mock).mockResolvedValue({ audio: false });
      const result = await checkPermission();
      expect(result).toBe(false);
    });
  });
});
