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
 * Check microphone permission，return boolean
 */
export const checkPermission: () => Promise<boolean> = async () =>
  (await VERTC.enableDevices({ audio: true, video: false })).audio;

/**
 * Get audio devices
 * @returns Promise<AudioDevices> Object containing arrays of audio input and output devices
 */
export const getAudioDevices = async () => {
  const devices = await VERTC.enumerateDevices();
  if (!devices?.length) {
    return { audioInputs: [], audioOutputs: [] };
  }
  return {
    audioInputs: devices.filter(i => i.deviceId && i.kind === 'audioinput'),
    audioOutputs: devices.filter(i => i.deviceId && i.kind === 'audiooutput'),
  };
};
