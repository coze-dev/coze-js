import { Events, taroStreamingRequest, taroUploadFile } from './stubs';

vi.doMock('@tarojs/taro', () => ({
  default: {
    Events,
    request: taroStreamingRequest,
    uploadFile: taroUploadFile,
  },
  Events,
  getEnv: () => 'TT',
}));
