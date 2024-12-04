/* eslint-disable @typescript-eslint/no-invalid-void-type -- ignore */
import Taro from '@tarojs/taro';
import {
  CozeAPI as InnerCozeAPI,
  type ClientOptions as InnerClientOptions,
} from '@coze/api';

import { sharedMixins } from './mixins/shared';
import { platformMixins } from './mixins/platform';

export interface ClientOptions extends InnerClientOptions {
  onBeforeAPICall?: (
    options: unknown,
  ) => (string | void) | Promise<string | void>;
}

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
      const token = await this.options.onBeforeAPICall(options);
      if (token) {
        this.token = token;
        (this.axiosOptions?.header as Record<string, string>).Authorization =
          `Bearer ${token}`;
        (options.header as Record<string, string>).Authorization =
          `Bearer ${token}`;
      }
    }
    return Taro.request(options);
  }
}
