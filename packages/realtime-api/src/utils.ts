import VERTC from '@volcengine/rtc';

/**
+ * Delays execution for the specified duration
+ * @param milliseconds The time to sleep in milliseconds
+ * @throws {Error} If milliseconds is negative
+ * @returns Promise that resolves after the specified duration
+ */
export const sleep = (milliseconds: number): Promise<void> => {
  if (milliseconds < 0) {
    throw new Error('Sleep duration must be non-negative');
  }
  return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
};
/**
 * en: Check microphone permission，return boolean
 * zh: 检查麦克风权限，返回布尔值
 */
export const checkPermission: () => Promise<boolean> = async () =>
  (await VERTC.enableDevices({ audio: true, video: false })).audio;
