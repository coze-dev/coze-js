import '@testing-library/jest-dom';

const ENV_TYPE = {
  WEAPP: 'WEAPP',
  SWAN: 'SWAN',
  ALIPAY: 'ALIPAY',
  TT: 'TT',
  QQ: 'QQ',
  JD: 'JD',
  WEB: 'WEB',
  RN: 'RN',
  HARMONY: 'HARMONY',
  QUICKAPP: 'QUICKAPP',
  HARMONYHYBRID: 'HARMONYHYBRID',
};

const taro = {
  arrayBufferToBase64: (buffer: ArrayBuffer) => {
    const uint8Array = new Uint8Array(buffer);
    let binary = '';
    // 将 Uint8Array 中的每个字节转换为对应的字符
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    // 使用 btoa 方法将二进制字符串转换为 Base64 编码的字符串
    return btoa(binary);
  },
  getEnv: () => ENV_TYPE.WEB,
  ENV_TYPE,
  showToast: props => {
    console.log('props:', props);
  },
  createSelectorQuery: () => ({
    select: (selectorName: string) => ({
      scrollOffset: success => {
        success({
          scrollLeft: 0,
          scrollTop: 0,
        });
        return {
          exec: () => {
            console.log('test:...');
          },
        };
      },
    }),
  }),
};

export const Taro = {
  default: taro,
  ...taro,
};
