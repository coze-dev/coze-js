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
export const checkPermission = async ({
  audio = true,
  video = false,
}: {
  audio?: boolean;
  video?: boolean;
} = {}): Promise<boolean> => {
  try {
    const result = await VERTC.enableDevices({ audio, video });
    return result.audio;
  } catch (error) {
    console.error('Failed to check device permissions:', error);
    return false;
  }
};

/**
 * Get audio devices
 * @returns Promise<AudioDevices> Object containing arrays of audio input and output devices
 */
export const getAudioDevices = async ({
  video = false,
}: {
  video?: boolean;
} = {}) => {
  let devices: MediaDeviceInfo[] = [];
  if (video) {
    devices = await VERTC.enumerateDevices();
  } else {
    devices = await [
      ...(await VERTC.enumerateAudioCaptureDevices()),
      ...(await VERTC.enumerateAudioPlaybackDevices()),
    ];
  }
  if (!devices?.length) {
    return {
      audioInputs: [],
      audioOutputs: [],
      videoInputs: [],
    };
  }
  return {
    audioInputs: devices.filter(i => i.deviceId && i.kind === 'audioinput'),
    audioOutputs: devices.filter(i => i.deviceId && i.kind === 'audiooutput'),
    videoInputs: devices.filter(i => i.deviceId && i.kind === 'videoinput'),
  };
};
