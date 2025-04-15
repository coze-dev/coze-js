declare global {
  interface Window {
    __denoiser: AIDenoiserExtension;
    __denoiserSupported: boolean;
  }
}

import AgoraRTC from 'agora-rtc-sdk-ng';
import { AIDenoiserExtension } from 'agora-extension-ai-denoiser';

/**
 * Check audio device permissions
 * @returns {Promise<{audio: boolean}>} Whether audio device permission is granted
 */
export const checkDevicePermission = async (): Promise<{
  audio: boolean;
}> => {
  const result = {
    audio: true,
  };
  try {
    // Check if browser supports mediaDevices API
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Browser does not support mediaDevices API');
      result.audio = false;
    }

    // Check permission status first through permissions API
    const permissionStatus = await navigator.permissions.query({
      name: 'microphone' as PermissionName,
    });

    // 如果权限已被拒绝
    if (permissionStatus.state === 'denied') {
      console.error('Microphone permission denied');
      result.audio = false;
    }

    // If permission status is prompt or granted, try to get device
    if (
      permissionStatus.state === 'prompt' ||
      permissionStatus.state === 'granted'
    ) {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // 获取成功后，关闭音频流
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  } catch (error) {
    // 用户拒绝授权或其他错误
    console.error('Failed to get audio permission:', error);
    result.audio = false;
  }
  return result;
};

/**
 * Get list of audio devices
 * @returns {Promise<{audioInputs: MediaDeviceInfo[], audioOutputs: MediaDeviceInfo[]}>} Audio devices
 */
export const getAudioDevices = async () => {
  try {
    // request microphone permission first, so we can get the complete device information
    const { audio: audioPermission } = await checkDevicePermission();

    if (!audioPermission) {
      throw new Error('Microphone permission denied');
    }

    // get all media devices
    const devices = await navigator.mediaDevices.enumerateDevices();

    if (!devices?.length) {
      return {
        audioInputs: [],
        audioOutputs: [],
      };
    }

    return {
      audioInputs: devices.filter(i => i.deviceId && i.kind === 'audioinput'),
      audioOutputs: devices.filter(i => i.deviceId && i.kind === 'audiooutput'),
    };
  } catch (error) {
    console.error('Failed to get audio devices:', error);
    return {
      audioInputs: [],
      audioOutputs: [],
    };
  }
};

/**
 * Convert floating point numbers to 16-bit PCM
 * @param float32Array - Array of floating point numbers
 * @returns {ArrayBuffer} 16-bit PCM
 */
export const floatTo16BitPCM = (float32Array: Float32Array) => {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  for (let i = 0; i < float32Array.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
};

/**
 * Check if device is mobile
 * @returns {boolean} Whether device is mobile
 */
export const isMobile = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

/**
 * Check if AI denoising is supported
 * @param assetsPath - Public path for denoising plugin
 * @returns {boolean} Whether AI denoising is supported
 */
export const checkDenoiserSupport = (assetsPath?: string) => {
  if (window.__denoiserSupported !== undefined) {
    return window.__denoiserSupported;
  }
  // 传入 Wasm 文件所在的公共路径以创建 AIDenoiserExtension 实例，路径结尾不带 / "
  const external =
    window.__denoiser ||
    new AIDenoiserExtension({
      assetsPath:
        assetsPath ??
        'https://lf3-static.bytednsdoc.com/obj/eden-cn/613eh7lpqvhpeuloz/websocket',
    });

  window.__denoiser = external;

  external.onloaderror = e => {
    // 如果 Wasm 文件加载失败，你可以关闭插件，例如：
    console.error('Denoiser load error', e);
    window.__denoiserSupported = false;
  };

  // 检查兼容性
  if (!external.checkCompatibility()) {
    // 当前浏览器可能不支持 AI 降噪插件，你可以停止执行之后的逻辑
    console.error('Does not support AI Denoiser!');
    window.__denoiserSupported = false;
    return false;
  } else {
    // 注册插件
    // see https://github.com/AgoraIO/API-Examples-Web/blob/main/src/example/extension/aiDenoiser/agora-extension-ai-denoiser/README.md
    AgoraRTC.registerExtensions([external]);
    window.__denoiserSupported = true;
    return true;
  }
};

export const isBrowserExtension = (): boolean =>
  // Check for Chrome extension API
  typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.id;
