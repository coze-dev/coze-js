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
 * @deprecated use checkDevicePermission instead
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
 * Checks device permissions for audio and video
 * @param checkVideo Whether to check video permissions (default: false)
 * @returns Promise that resolves with the device permission status
 */
export const checkDevicePermission = async (checkVideo = false) =>
  await VERTC.enableDevices({ audio: true, video: checkVideo });

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
    if (isScreenShareSupported()) {
      // @ts-expect-error - add screenShare device to devices
      devices.push({
        deviceId: 'screenShare',
        kind: 'videoinput',
        label: 'Screen Share',
        groupId: 'screenShare',
      });
    }
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

export const isScreenShareDevice = (deviceId?: string): boolean =>
  deviceId === 'screenShare';

/**
 * 判断是否前后置摄像头
 * @param deviceId
 * @returns
 */
export const isMobileVideoDevice = (deviceId?: string): boolean =>
  deviceId === 'user' || deviceId === 'environment';

/**
 * Check if browser supports screen sharing
 * 检查浏览器是否支持屏幕共享
 */
export function isScreenShareSupported(): boolean {
  return !!navigator?.mediaDevices?.getDisplayMedia;
}
