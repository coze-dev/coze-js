import { getEnv, ENV_TYPE } from '@tarojs/taro';
const env = getEnv();
export const isWeb = env === ENV_TYPE.WEB;
export const isWeapp = env === ENV_TYPE.WEAPP;
export const isTT = env === ENV_TYPE.TT;
export const isMini = !isWeb;
