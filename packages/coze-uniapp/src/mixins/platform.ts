import { type CozeAPI } from '../api';
import { platformMixins as platformMixinsWeapp } from './platform.weapp';
import { platformMixins as platformMixinsTT } from './platform.tt';

/**
 * 为不同平台提供默认实现，仅用于类型兼容
 * Default implementation for multiple platforms, used only for type compatibility.
 */
export function platformMixins(api: CozeAPI) {
  // UniApp环境获取系统信息
  const systemInfo = uni.getSystemInfoSync();

  // 根据系统信息判断平台类型
  // 注意：这里的逻辑可能需要根据实际情况调整
  if (systemInfo.hostName === 'Douyin' || systemInfo.hostName === 'Toutiao') {
    return platformMixinsTT(api);
  } else if (systemInfo.hostName === 'WeChat') {
    return platformMixinsWeapp(api);
  }
  // 默认不做任何处理
}
