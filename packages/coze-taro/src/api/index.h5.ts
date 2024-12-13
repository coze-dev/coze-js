import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { CozeAPI as InnerCozeAPI } from '@coze/api';

import { type ClientOptions } from './types';

export class CozeAPI extends InnerCozeAPI {
  constructor(public options: ClientOptions) {
    super({ ...options });
    this.axiosInstance = axios.create();
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
  }
}
