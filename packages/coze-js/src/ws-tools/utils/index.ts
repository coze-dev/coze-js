declare global {
  interface Window {
    __denoiser: AIDenoiserExtension;
  }
}

import { AIDenoiserExtension } from 'agora-extension-ai-denoiser';
import AgoraRTC from 'agora-rtc-sdk-ng';

/**
 * 检查语音设备权限
 * @returns {Promise<{audio: boolean}>} 是否具有语音设备权限
 */
export const checkDevicePermission = async (): Promise<{
  audio: boolean;
}> => {
  const result = {
    audio: true,
  };
  try {
    // 检查浏览器是否支持 mediaDevices API
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Browser does not support mediaDevices API');
      result.audio = false;
    }

    // 先通过 permissions API 查询权限状态
    const permissionStatus = await navigator.permissions.query({
      name: 'microphone' as PermissionName,
    });

    // 如果权限已被拒绝
    if (permissionStatus.state === 'denied') {
      console.error('Microphone permission denied');
      result.audio = false;
    }

    // 如果权限状态是 prompt 或 granted，尝试获取设备
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
 * 获取音频设备列表
 * @returns {Promise<{audioInputs: MediaDeviceInfo[], audioOutputs: MediaDeviceInfo[]}>} 音频设备
 */
export const getAudioDevices = async () => {
  try {
    // 先请求麦克风权限，这样可以获取到完整的设备信息
    const { audio: audioPermission } = await checkDevicePermission();
    if (!audioPermission) {
      throw new Error('Microphone permission denied');
    }

    // 获取所有媒体设备
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
 * 将浮点数转换为16位PCM
 * @param float32Array - 浮点数数组
 * @returns {ArrayBuffer} 16位PCM
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
 * 检查是否是移动设备
 * @returns {boolean} 是否是移动设备
 */
export const isMobile = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

/**
 * 检查是否支持 AI 降噪
 * @param assetsPath - 降噪插件的公共路径
 * @returns {boolean} 是否支持 AI 降噪
 */
export const checkDenoiserSupport = (assetsPath?: string) => {
  if (!window.__denoiser) {
    // 传入 Wasm 文件所在的公共路径以创建 AIDenoiserExtension 实例，路径结尾不带 / "
    const external = new AIDenoiserExtension({
      assetsPath:
        assetsPath ??
        'https://lf3-static.bytednsdoc.com/obj/eden-cn/613eh7lpqvhpeuloz/websocket',
    });

    window.__denoiser = external;

    external.onloaderror = e => {
      // 如果 Wasm 文件加载失败，你可以关闭插件，例如：
      console.error('Denoiser load error', e);
    };

    // 检查兼容性
    if (!external.checkCompatibility()) {
      // 当前浏览器可能不支持 AI 降噪插件，你可以停止执行之后的逻辑
      console.error('Does not support AI Denoiser!');
      return false;
    } else {
      // 注册插件
      // see https://github.com/AgoraIO/API-Examples-Web/blob/main/src/example/extension/aiDenoiser/agora-extension-ai-denoiser/README.md
      AgoraRTC.registerExtensions([external]);
      return true;
    }
  }
  return window.__denoiser.checkCompatibility();
};
