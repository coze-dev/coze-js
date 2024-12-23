import { getEnv } from '@tarojs/taro';

import { type CozeAPI } from '../api';
import { platformMixins as platformMixinsWeapp } from './platform.weapp';
import { platformMixins as platformMixinsTT } from './platform.tt';

/**
 * Default implementation for multiple platforms, used only for type compatibility.
 */
export function platformMixins(api: CozeAPI) {
  if (getEnv() === 'TT') {
    return platformMixinsTT(api);
  } else if (getEnv() === 'WEAPP') {
    return platformMixinsWeapp(api);
  }
  // donothing
}
