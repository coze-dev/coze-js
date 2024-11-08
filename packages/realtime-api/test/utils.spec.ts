import VERTC from '@volcengine/rtc';

import { sleep, checkPermission } from '../src/utils';

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
});
