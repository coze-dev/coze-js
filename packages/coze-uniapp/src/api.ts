/* eslint-disable @typescript-eslint/no-magic-numbers -- ignore */
/* eslint-disable @typescript-eslint/no-invalid-void-type -- ignore */
/* eslint-disable @typescript-eslint/no-explicit-any -- ignore */
import axios, {
  type AxiosAdapter,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponseHeaders,
} from 'axios';
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

/**
 * Coze API for UniApp
 * 针对UniApp环境的Coze API实现
 */
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
          if (res?.token) {
            this.token = res.token;
            config.headers.Authorization = `Bearer ${res.token}`;
          }
        }
        return config;
      },
    );

    this.applyMixins();
  }

  /**
   * 获取适配器
   * 根据环境返回对应的适配器，web环境使用默认适配器，非web环境使用UniApp适配器
   */
  private getAdapter(): AxiosAdapter | undefined {
    // 使用uni-app的方式检测环境
    if (
      typeof uni === 'undefined' ||
      uni.getSystemInfoSync().uniPlatform === 'web'
    ) {
      return undefined;
    }

    // UniApp适配器，将axios请求适配到uni.request
    const uniAdapter: AxiosAdapter = config => {
      const { url, method, data, headers, timeout } = config;
      const header =
        typeof headers.toJSON === 'function' ? headers.toJSON() : headers;
      header['Content-Type'] = header['Content-Type'] || 'application/json';
      return new Promise((resolve, reject) => {
        uni.request({
          url: url as string,
          method: (method ?? 'GET').toUpperCase() as
            | 'GET'
            | 'POST'
            | 'PUT'
            | 'DELETE'
            | 'HEAD'
            | 'OPTIONS'
            | 'TRACE',
          data,
          header,
          timeout,
          success: (res: {
            data: any;
            statusCode: number;
            header: any;
            errMsg?: string;
          }) => {
            // 请求失败处理
            if (res.statusCode !== 200 || res.data?.code) {
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
              // 请求成功处理
              resolve({
                data: res.data,
                status: res.statusCode,
                statusText: res.errMsg ?? '',
                headers: res.header,
                config,
              });
            }
          },
          fail: (err: any) => {
            reject(err);
          },
        });
      });
    };
    return uniAdapter;
  }

  /**
   * 应用混入
   * 非web环境下应用混入
   */
  private applyMixins() {
    // 使用uni-app的方式检测环境
    if (
      typeof uni !== 'undefined' &&
      uni.getSystemInfoSync().uniPlatform !== 'web'
    ) {
      sharedMixins(this);
      platformMixins(this);
    }
  }
}
