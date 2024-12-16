import { Events, taroStreamingRequest } from './stubs';

vi.doMock('@tarojs/taro', () => ({
  default: {
    Events,
    request: taroStreamingRequest,
  },
  Events,
}));
