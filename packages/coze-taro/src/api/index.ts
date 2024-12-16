import Taro from '@tarojs/taro';
import { CozeAPI as InnerCozeAPI } from '@coze/api';

import { sharedMixins } from '../mixins/shared';
import { platformMixins } from '../mixins/platform';
import { type ClientOptions } from './types';

export class CozeAPI extends InnerCozeAPI {
  constructor(public options: ClientOptions) {
    super({
      ...options,
      axiosOptions: {
        header: {
          ...options.headers,
          Authorization: `Bearer ${options.token}`,
        },
        responseType: 'text',
      },
    });
    this.axiosInstance = this.wrapRequest.bind(this);
    sharedMixins(this);
    platformMixins(this);
  }

  private async wrapRequest(options: Taro.request.Option) {
    if (this.options.onBeforeAPICall) {
      const config = (await this.options.onBeforeAPICall(options)) ?? {};
      if (config.token) {
        this.token = config.token;
        (this.axiosOptions?.header as Record<string, string>).Authorization =
          `Bearer ${config.token}`;
        (options.header as Record<string, string>).Authorization =
          `Bearer ${config.token}`;
      }
    }
    return Taro.request(options);
  }
}
