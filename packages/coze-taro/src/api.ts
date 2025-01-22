/* eslint-disable @typescript-eslint/no-magic-numbers -- ignore */
/* eslint-disable @typescript-eslint/no-invalid-void-type -- ignore */
import axios, {
  type AxiosAdapter,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponseHeaders,
} from 'axios';
import { request, getEnv, ENV_TYPE } from '@tarojs/taro';
import {
  CozeAPI as InnerCozeAPI,
  type ClientOptions as InnerClientOptions,
  APIError,
} from '@coze/api';

import { sharedMixins } from './mixins/shared';
import { platformMixins } from './mixins/platform';

export interface ClientOptions extends InnerClientOptions {
  onBeforeAPICall?: (
    options: unknown,
  ) => ({ token?: string } | void) | Promise<{ token?: string } | void>;
}

export class CozeAPI extends InnerCozeAPI {
  constructor(public options: ClientOptions) {
    super({ ...options });
    this.axiosInstance = axios.create({
      adapter: this.getAdapter(),
    });
    (this.axiosInstance as AxiosInstance).interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (this.options.onBeforeAPICall) {
          const res = (await this.options.onBeforeAPICall(config)) ?? {};
          if (res.token) {
            this.token = res.token;
            config.headers.Authorization = `Bearer ${res.token}`;
          }
        }
        return config;
      },
    );

    this.applyMixins();
  }

  private getAdapter(): AxiosAdapter | undefined {
    if (getEnv() === ENV_TYPE.WEB) {
      return undefined;
    }

    const taroAdapter: AxiosAdapter = config => {
      const { url, method, data, headers } = config;
      const header =
        typeof headers.toJSON === 'function' ? headers.toJSON() : headers;
      header['Content-Type'] = header['Content-Type'] || 'application/json';
      return new Promise((resolve, reject) => {
        request({
          url: url as string,
          // @ts-expect-error -- ignore
          method: (method ?? 'GET').toUpperCase(),
          data,
          header,
          success: res => {
            // Request failed
            if (res.statusCode !== 200 || res.data.code) {
              const resData = res.data || {};
              resData.error = resData.error || resData.detail || {};
              const resHeader = res.header || {};
              resHeader['x-tt-logid'] =
                resHeader['X-Tt-Logid'] ||
                resHeader['x-tt-logid'] ||
                resData.error.logid;
              const error = APIError.generate(
                res.statusCode,
                resData,
                res.errMsg,
                resHeader as AxiosResponseHeaders,
              );
              reject(error);
            } else {
              resolve({
                data: res.data,
                status: res.statusCode,
                statusText: res.errMsg,
                headers: res.header,
                config,
              });
            }
          },
          fail: err => {
            reject(err);
          },
        });
      });
    };
    return taroAdapter;
  }

  private applyMixins() {
    if (getEnv() !== ENV_TYPE.WEB) {
      sharedMixins(this);
      platformMixins(this);
    }
  }
}
