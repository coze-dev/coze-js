/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    __denoiser: AIDenoiserExtension;
    __denoiserSupported: boolean;
  }
}
declare const chrome: any;

import { logger } from 'agora-rte-extension';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { AIDenoiserExtension } from 'agora-extension-ai-denoiser';

// 禁用日志上传与打印日志
AgoraRTC.disableLogUpload();
AgoraRTC.setLogLevel(3);
logger.setLogLevel(3);

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
    const permissionStatus = (await navigator.permissions?.query({
      name: 'microphone' as PermissionName,
    })) || {
      state: 'prompt',
    };

    // If permission has been denied
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

      // After obtaining successfully, close the audio stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  } catch (error) {
    // User denied authorization or other errors
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
    // Request microphone permission first, so we can get the complete device information
    const { audio: audioPermission } = await checkDevicePermission();

    if (!audioPermission) {
      throw new Error('Microphone permission denied');
    }

    // Get all media devices
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
 * Convert Float32Array to Int16Array (without going through ArrayBuffer)
 */
export function float32ToInt16Array(float32: Float32Array): Int16Array {
  const int16 = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return int16;
}

/**
 * Simple linear extraction method to downsample Float32Array from 48000Hz to 8000Hz
 * @param input Float32Array 48000Hz
 * @returns Float32Array 8000Hz
 */
export function downsampleTo8000(input: Float32Array): Float32Array {
  const ratio = 48000 / 8000; // 6
  const outputLength = Math.floor(input.length / ratio);
  const output = new Float32Array(outputLength);
  for (let i = 0; i < outputLength; i++) {
    output[i] = input[Math.floor(i * ratio)];
  }
  return output;
}

/**
 * Check if device is mobile
 * @returns {boolean} Whether device is mobile
 */
export const isMobile = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

export const isHarmonOS = () =>
  /harmony|hmos|huawei/i.test(navigator.userAgent);
/**
 * Check if AI denoising is supported
 * @param assetsPath - Public path for denoising plugin
 * @returns {boolean} Whether AI denoising is supported
 */
export const checkDenoiserSupport = (assetsPath?: string) => {
  if (window.__denoiserSupported !== undefined) {
    return window.__denoiserSupported;
  }
  // Pass in the public path where the Wasm file is located to create an AIDenoiserExtension instance, path does not end with / "
  const external =
    window.__denoiser ||
    new AIDenoiserExtension({
      assetsPath:
        assetsPath ??
        'https://lf3-static.bytednsdoc.com/obj/eden-cn/613eh7lpqvhpeuloz/websocket',
    });

  window.__denoiser = external;

  external.onloaderror = e => {
    // If the Wasm file fails to load, you can disable the plugin, for example:
    console.error('Denoiser load error', e);
    window.__denoiserSupported = false;
  };

  // Check compatibility
  if (!external.checkCompatibility()) {
    // The current browser may not support the AI denoising plugin, you can stop executing subsequent logic
    console.error('Does not support AI Denoiser!');
    window.__denoiserSupported = false;
    return false;
  } else {
    // Register the plugin
    // see https://github.com/AgoraIO/API-Examples-Web/blob/main/src/example/extension/aiDenoiser/agora-extension-ai-denoiser/README.md
    AgoraRTC.registerExtensions([external]);
    window.__denoiserSupported = true;
    return true;
  }
};

export const isBrowserExtension = (): boolean =>
  typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.id;

/**
 * Convert 16-bit linear PCM data to G.711 A-law
 * @param {Int16Array|Array} pcmData - 16-bit signed PCM sample data
 * @returns {Uint8Array} - G.711 A-law encoded data
 */
export function encodeG711A(pcmData: Int16Array) {
  const aLawData = new Uint8Array(pcmData.length);

  // A-law compression table - used to optimize performance
  const LOG_TABLE = [
    1, 1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5,
    5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
    6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7,
  ];

  for (let i = 0; i < pcmData.length; i++) {
    let sample = pcmData[i];
    const sign = sample < 0 ? 0 : 0x80;

    // Get the absolute value of the sample and limit it to the 16-bit range
    if (sign === 0) {
      sample = -sample;
    }
    if (sample > 32767) {
      sample = 32767;
    }

    // Use linear quantization for small signals, logarithmic quantization for large signals
    let compressedValue;
    if (sample < 256) {
      compressedValue = sample >> 4;
    } else {
      // Determine the "exponent" part of the sample
      const exponent = LOG_TABLE[(sample >> 8) & 0x7f];
      const mantissa = (sample >> (exponent + 3)) & 0x0f;
      compressedValue = (exponent << 4) | mantissa;
    }

    // Invert even bits (this is a feature of A-law)
    aLawData[i] = (sign | compressedValue) ^ 0x55;
  }

  return aLawData;
}

/**
 * Encode 16-bit PCM to G.711 μ-law (g711u)
 * @param pcm16 - Int16Array of PCM samples
 * @returns {Uint8Array} G.711U encoded data
 */
export function encodeG711U(pcm16: Int16Array): Uint8Array {
  const BIAS = 0x84;
  const CLIP = 32635;
  const out = new Uint8Array(pcm16.length);
  for (let i = 0; i < pcm16.length; i++) {
    let pcm = pcm16[i];
    const sign = (pcm >> 8) & 0x80;
    if (sign !== 0) {
      pcm = -pcm;
    }
    if (pcm > CLIP) {
      pcm = CLIP;
    }
    pcm = pcm + BIAS;
    let exponent = 7;
    for (
      let expMask = 0x4000;
      (pcm & expMask) === 0 && exponent > 0;
      expMask >>= 1
    ) {
      exponent--;
    }
    const mantissa = (pcm >> (exponent + 3)) & 0x0f;
    const ulaw = ~(sign | (exponent << 4) | mantissa);
    out[i] = ulaw;
  }
  return out;
}

/**
 * Sets a value in an object at a specified path using dot notation.
 * Creates nested objects along the path if they don't exist.
 *
 * @param obj - The target object to modify
 * @param path - The path in dot notation (e.g., 'a.b.c')
 * @param value - The value to set at the specified path
 * @returns The modified object
 *
 * @example
 * // Set a value at a nested path
 * const obj = {};
 * setValueByPath(obj, 'user.profile.name', 'John');
 * // Result: { user: { profile: { name: 'John' } } }
 */
export function setValueByPath<T extends Record<string, any>, V>(
  obj: T,
  path: string,
  value: V,
): T {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Target must be an object');
  }

  if (!path) {
    throw new Error('Path cannot be empty');
  }

  const keys = path.split('.');
  let current: Record<string, any> = obj;

  // Navigate to the last-but-one key
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    // Skip dangerous keys to prevent prototype pollution
    if (key === '__proto__' || key === 'constructor') {
      throw new Error(`Invalid key detected: ${key}`);
    }
    // Create empty object if the key doesn't exist or is not an object
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key] as Record<string, any>;
  }

  // Set the value at the final key
  const lastKey = keys[keys.length - 1];
  if (lastKey === '__proto__' || lastKey === 'constructor') {
    throw new Error(`Invalid key detected: ${lastKey}`);
  }
  current[lastKey] = value;

  return obj;
}
