import { registerWebSocketFactory } from './global-registry';
import { getWebSocketImplementation } from './factory';

/**
 * 注册 UniApp WebSocket 实现以供核心包使用
 * 在使用任何 WebSocket 功能之前应该调用此函数
 */
export function registerUniAppWebSocket(): void {
  // 注册 WebSocket 工厂到全局注册表
  // 这样在所有环境（包括小程序）中都能正常工作
  registerWebSocketFactory({
    getWebSocketImplementation,
  });
}
