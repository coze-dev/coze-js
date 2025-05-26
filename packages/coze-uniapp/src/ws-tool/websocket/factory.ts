/* eslint-disable @typescript-eslint/no-explicit-any */
import { UniAppWebSocket } from './index';

// 获取适当的WebSocket实现的工厂函数
export function getWebSocketImplementation(): typeof WebSocket {
  // 确保我们在UniApp环境中
  if (typeof uni === 'undefined') {
    throw new Error('Not in a UniApp environment');
  }

  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync();

  // 根据平台选择适当的实现
  if (systemInfo.uniPlatform === 'web' || systemInfo.uniPlatform === 'h5') {
    // 对于H5，我们可以使用浏览器原生的WebSocket
    return window.WebSocket as any;
  } else {
    // 对于其他平台，使用默认的UniApp实现
    return UniAppWebSocket;
  }
}
