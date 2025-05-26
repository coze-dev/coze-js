/* eslint-disable @typescript-eslint/no-explicit-any */

// 全局 WebSocket 工厂注册表，不依赖于 window 对象
// 这样在小程序环境中也能正常工作
let globalWebSocketFactory: {
  getWebSocketImplementation: () => typeof WebSocket;
} | null = null;

/**
 * 注册 WebSocket 工厂到全局
 */
export function registerWebSocketFactory(factory: {
  getWebSocketImplementation: () => typeof WebSocket;
}): void {
  globalWebSocketFactory = factory;

  // 如果在浏览器环境中，也注册到 window 对象上以保持兼容性
  if (typeof window !== 'undefined') {
    (window as any).UniAppWebSocketFactory = factory;
  }

  // 在全局作用域中定义获取函数，确保小程序环境可访问
  (globalThis as any).getUniAppWebSocketFactory = getWebSocketFactory;
}

/**
 * 获取全局注册的 WebSocket 工厂
 */
export function getWebSocketFactory(): {
  getWebSocketImplementation: () => typeof WebSocket;
} | null {
  return globalWebSocketFactory;
}
