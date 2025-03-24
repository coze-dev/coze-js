import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import Taro from '@tarojs/taro';
import {
  CozeAPI,
  RequestOptions,
  type ClientOptions,
  type CreateFileReq,
  type FileObject,
} from '@coze/api';

import { safeJSONParse } from './safe-json-parse';
import { convertToMinChatError, MiniChatError } from './mini-chat-error';
import { logger } from './logger';
import { requestSSE } from './event-source/request';
import { EventJsonDataType } from './event-source/event-source';
import { isTT, isWeb } from './device';
import { taroAdapter } from './adapter';

enum ApiAuthError {
  ERROR_FORBIDDEN = 401,
  ERROR_INVALID_TOKEN = 4100,
  ERROR_TOKEN_FORBIDDEN = 4101,
  ERROR_TOKEN_FAILED = 700012006,
}
type OnRefreshToken = (oldToken?: string) => Promise<string> | string;
interface FileResult {
  code: number;
  data: FileObject;
}
export class MiniCozeApi2 extends CozeAPI {}
export class MiniCozeApi extends CozeAPI {
  private onRefreshToken?: OnRefreshToken;
  private refreshTokenPromise?: Promise<string> | string;
  constructor({
    onRefreshToken,
    axiosOptions,
    ...config
  }: ClientOptions & {
    onRefreshToken?: OnRefreshToken;
  }) {
    super({
      ...config,
      axiosOptions: {
        ...(axiosOptions || {}),
        timeout: 10 * 60 * 1000,
        validateStatus: () => true,
      },
    });
    this.onRefreshToken = onRefreshToken;
    this.axiosInstance = axios.create({
      adapter: !isWeb ? taroAdapter : undefined,
    });
    this.useAuthError();
    this.mixTaroUpload();
  }
  useAuthError() {
    this.useResponseInterceptors(
      async response => {
        const { code } = response?.data || {};
        if (this.isAuthErrorCode(code || response.status)) {
          // 由于 鉴权问题导致的失败，进行一次重新发送数据。
          logger.error('request auth error :', code || response.status);
          const oldToken = this.getTokenFromHeaderAuth(
            String(response.config.headers.getAuthorization() || ''),
          );
          const token = await this.refreshToken(oldToken);
          if (token) {
            response.config.headers.Authorization = `Bearer ${token}`;
            return await axios.request(response.config);
          }
        }
        if (response.status < 200 || response.status > 400) {
          logger.error('request error:', response);
          throw new Error(response.statusText);
        }
        return response;
      },
      async response => {
        const { code } = response?.data || {};
        if (this.isAuthErrorCode(code || response.status)) {
          // 由于 鉴权问题导致的失败，进行一次重新发送数据。
          const oldToken = this.getTokenFromHeaderAuth(
            String(response.config.headers.getAuthorization() || ''),
          );
          const token = await this.refreshToken(oldToken);
          if (token) {
            response.config.headers.Authorization = `Bearer ${token}`;
            return await axios.request(response.config);
          }
        }
        return response;
      },
    );
  }
  isAuthErrorCode(code: number) {
    return [
      ApiAuthError.ERROR_FORBIDDEN,
      ApiAuthError.ERROR_INVALID_TOKEN,
      ApiAuthError.ERROR_TOKEN_FORBIDDEN,
      ApiAuthError.ERROR_TOKEN_FAILED,
    ].includes(code);
  }
  getTokenFromHeaderAuth(authorization: string) {
    return authorization.replace(/^\s*Bearer\s*/, '').replace(/\s+$/, '');
  }
  async refreshToken(oldToken: string): Promise<string> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }
    if (oldToken !== this.token) {
      // 同时并发的接口已经获取过token，直接返回
      return this.token as string;
    }
    this.refreshTokenPromise = this.onRefreshToken?.(this.token);
    const token = await this.refreshTokenPromise;
    this.refreshTokenPromise = undefined;
    this.token = token || '';
    return this.token;
  }
  useResponseInterceptors(
    responseInterceptor:
      | ((response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>)
      | undefined,
    rejectResponseInterceptor:
      | ((response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>)
      | undefined,
  ) {
    this.getAxiosInstance().interceptors.response.use(
      responseInterceptor,
      rejectResponseInterceptor,
    );
  }
  useRequestInterceptors(
    requestInterceptor: (
      request: InternalAxiosRequestConfig,
    ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
  ) {
    this.getAxiosInstance().interceptors.request.use(requestInterceptor);
  }
  getAxiosInstance() {
    return this.axiosInstance as AxiosInstance;
  }
  // eslint-disable-next-line max-params
  makeRequest<Req, Rsp>(
    apiUrl: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: Req,
    isStream?: boolean,
    options?: RequestOptions,
  ): Promise<Rsp> {
    if (isWeb || !isStream) {
      try {
        return super.makeRequest(apiUrl, method, body, isStream, options);
      } catch (err) {
        console.log('makeRequestError:', err);
      }
    }
    return this.requestMiniSse({
      apiUrl,
      method,
      body,
      options,
    }) as unknown as Promise<Rsp>;
  }
  // eslint-disable-next-line complexity
  private async *requestMiniSse<Req, Rsp>({
    apiUrl,
    method,
    body,
    options,
    retryNum = 0,
  }: {
    apiUrl: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: Req;
    options?: RequestOptions;
    retryNum?: number;
  }): AsyncGenerator<Rsp> {
    // request intercptions处理
    const refreshTokenAndRetry = async (code = -1, msg = 'unknown error') => {
      if (retryNum === 0) {
        await this.refreshToken(oldToken as string);
        return this.requestMiniSse({
          apiUrl,
          method,
          body,
          options,
          retryNum: retryNum + 1,
        });
      } else {
        throw new MiniChatError(code, msg);
      }
    };
    const oldToken = this.token;
    const url = `${this.baseURL ?? ''}/${apiUrl}`;
    const res = requestSSE({
      url,
      method,
      data: body as Record<string, unknown>,
      header: {
        ...(this.axiosOptions?.headers || {}),
        ...(options?.headers || {}),
        Authorization: `Bearer ${this.token}`,
      },
      ...(options || {}),
    });
    let eventDataNum = 0;

    for await (const eventData of res) {
      if (eventData?.event === EventJsonDataType) {
        const { code = -1, msg = 'unknown error' } = (eventData.data || {}) as {
          code: number;
          msg: string;
        };
        if (this.isAuthErrorCode(code)) {
          return await refreshTokenAndRetry(code, msg);
        }
        throw new MiniChatError(code || 0, msg);
      }

      if (eventData) {
        eventDataNum++;
        yield eventData as Rsp;
      }
    }
    if (eventDataNum === 0) {
      if (isTT) {
        // 无法分辨是否token过期了， 直接重试
        return await refreshTokenAndRetry();
      } else {
        throw new MiniChatError(-1, 'unknown error');
      }
    }
  }
  private mixTaroUpload() {
    if (!isWeb) {
      this.files.upload = (params: CreateFileReq, options?: RequestOptions) =>
        this._uploadFile({
          params,
          options,
          urlPath: '/v1/files/upload',
        });
    }
    // @ts-expect-error -- linter-disable-autofix
    this.audio.transcriptions = (
      params: CreateFileReq,
      options?: RequestOptions,
    ) => {
      logger.debug('translation params', params);
      return this._uploadFile({
        params,
        options,
        urlPath: '/v1/audio/transcriptions',
      });
    };
  }
  // eslint-disable-next-line complexity
  private async _uploadFile({
    params,
    options,
    retryNum = 0,
    urlPath,
  }: {
    params: CreateFileReq;
    options?: RequestOptions;
    urlPath: string;
    retryNum?: number;
  }): Promise<FileResult['data']> {
    const url = `${this.baseURL ?? ''}${urlPath}`;
    const oldToken = this.token;
    try {
      const rawResult = await Taro.uploadFile({
        url,
        filePath: params.file.filePath,
        name: 'file',
        fileName: params.file.fileName,
        withCredentials: false,
        header: {
          ...(this.axiosOptions?.headers || {}),
          ...(options?.headers || {}),
          Authorization: `Bearer ${this.token}`,
        },
        timeout: options?.timeout,
      });
      const { code = -1, data } = safeJSONParse<FileResult>(rawResult.data) || {
        code: -1,
      };
      logger.debug('_uploadFile:', { code, data });
      if (code !== 0 || !data) {
        if (
          this.isAuthErrorCode(code || rawResult.statusCode) &&
          retryNum !== 0
        ) {
          // 需要重试
          await this.refreshToken(oldToken as string);
          return await this._uploadFile({
            params,
            options,
            retryNum: retryNum + 1,
            urlPath,
          });
        }
        throw new MiniChatError(code || -1, 'upload file failed');
      }
      return data;
    } catch (error) {
      const miniChatError = convertToMinChatError(error);
      logger.error('upload file error', error);
      throw miniChatError;
    }
  }
}
