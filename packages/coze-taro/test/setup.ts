import { Events, taroRequest, taroUploadFile } from './stubs';

vi.doMock('@tarojs/taro', () => ({
  default: {
    Events,
    request: taroRequest,
    uploadFile: taroUploadFile,
  },
  Events,
  request: taroRequest,
  getEnv: () => 'WEAPP',
  ENV_TYPE: {
    WEB: 'WEB',
  },
}));
