/* eslint-disable max-params */
import {
  type AxiosRequestConfig,
  type AxiosResponseHeaders,
  type AxiosInstance,
} from 'axios';

import { getNodeClientUserAgent, getUserAgent } from './version.js';
import { isBrowser, isPersonalAccessToken, mergeConfig } from './utils.js';
import { type FetchAPIOptions, fetchAPI } from './fetcher.js';
import { APIError, type ErrorRes } from './error.js';
import * as Errors from './error.js';
import { COZE_COM_BASE_URL } from './constant.js';

export type RequestOptions = Omit<
  AxiosRequestConfig,
  'url' | 'method' | 'baseURL' | 'data' | 'responseType'
> &
  Record<string, unknown>;

export type GetToken = string | (() => Promise<string> | string);
export interface ClientOptions {
  /** baseURL, default is https://api.coze.com, Use https://api.coze.cn if you use https://coze.cn */
  baseURL?: string;
  /** Personal Access Token (PAT) or OAuth2.0 token, or a function to get token */
  token: GetToken;
  /** see https://github.com/axios/axios?tab=readme-ov-file#request-config */
  axiosOptions?: RequestOptions;
  /** Custom axios instance */
  axiosInstance?: AxiosInstance | unknown;
  /** Whether to enable debug mode */
  debug?: boolean;
  /** Custom headers */
  headers?: Headers | Record<string, unknown>;
  /** Whether Personal Access Tokens (PAT) are allowed in browser environments */
  allowPersonalAccessTokenInBrowser?: boolean;
}

export class APIClient {
  protected _config: ClientOptions;
  baseURL: string;
  token: GetToken;
  axiosOptions?: RequestOptions;
  axiosInstance?: AxiosInstance | unknown;
  debug: boolean;
  allowPersonalAccessTokenInBrowser: boolean;
  headers?: Headers | Record<string, unknown>;

  constructor(config: ClientOptions) {
    this._config = config;
    this.baseURL = config.baseURL || COZE_COM_BASE_URL;
    this.token = config.token;
    this.axiosOptions = config.axiosOptions || {};
    this.axiosInstance = config.axiosInstance;
    this.debug = config.debug || false;
    this.allowPersonalAccessTokenInBrowser =
      config.allowPersonalAccessTokenInBrowser || false;
    this.headers = config.headers;

    if (
      isBrowser() &&
      typeof this.token !== 'function' &&
      isPersonalAccessToken(this.token) &&
      !this.allowPersonalAccessTokenInBrowser
    ) {
      throw new Errors.CozeError(
        'Browser environments do not support authentication using Personal Access Token (PAT) by default.\nas it may expose secret API keys. \n\nPlease use OAuth2.0 authentication mechanism. see:\nhttps://www.coze.com/docs/developer_guides/oauth_apps?_lang=en \n\nIf you need to force use, please set the `allowPersonalAccessTokenInBrowser` option to `true`. \n\ne.g new CozeAPI({ token, allowPersonalAccessTokenInBrowser: true });\n\n',
      );
    }
  }

  static APIError = Errors.APIError;
  static BadRequestError = Errors.BadRequestError;
  static AuthenticationError = Errors.AuthenticationError;
  static PermissionDeniedError = Errors.PermissionDeniedError;
  static NotFoundError = Errors.NotFoundError;
  static RateLimitError = Errors.RateLimitError;
  static InternalServerError = Errors.InternalServerError;
  static GatewayError = Errors.GatewayError;
  static TimeoutError = Errors.TimeoutError;
  static UserAbortError = Errors.APIUserAbortError;

  protected async getToken(): Promise<string> {
    if (typeof this.token === 'function') {
      return await this.token();
    }
    return this.token;
  }

  protected async buildOptions(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: unknown,
    options?: RequestOptions,
  ): Promise<FetchAPIOptions> {
    const token = await this.getToken();
    const headers: Record<string, string> = {
      authorization: `Bearer ${token}`,
    };

    if (!isBrowser()) {
      headers['User-Agent'] = getUserAgent();
      headers['X-Coze-Client-User-Agent'] = getNodeClientUserAgent();
    } else {
      // headers['X-Coze-Client-User-Agent'] = getBrowserClientUserAgent();
    }

    const config = mergeConfig(this.axiosOptions, options, { headers });
    config.method = method;
    config.data = body;

    return config;
  }

  public async makeRequest<Req, Rsp>(
    apiUrl: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: Req,
    isStream?: boolean,
    options?: RequestOptions,
  ): Promise<Rsp> {
    const fullUrl = `${this.baseURL}${apiUrl}`;

    const fetchOptions = await this.buildOptions(method, body, options);
    fetchOptions.isStreaming = isStream;
    fetchOptions.axiosInstance = this.axiosInstance;

    this.debugLog(`--- request url: ${fullUrl}`);
    this.debugLog('--- request options:', fetchOptions);

    const { response, stream, json } = await fetchAPI(fullUrl, fetchOptions);

    this.debugLog(`--- response status: ${response.status}`);
    this.debugLog('--- response headers: ', response.headers);

    // Taro use `header`
    const contentType = (response.headers ??
      (response as unknown as Record<string, string>).header)['content-type'];

    if (isStream) {
      if (contentType && contentType.includes('application/json')) {
        const result = (await json()) as { code: number; msg: string } & Record<
          string,
          unknown
        >;
        const { code, msg } = result;
        if (code !== 0 && code !== undefined) {
          throw APIError.generate(
            response.status,
            result as ErrorRes,
            msg,
            response.headers as AxiosResponseHeaders,
          );
        }
      }
      return stream() as Rsp;
    }

    if (contentType && contentType.includes('application/json')) {
      const result = (await json()) as { code: number; msg: string } & Record<
        string,
        unknown
      >;
      const { code, msg } = result;
      if (code !== 0 && code !== undefined) {
        throw APIError.generate(
          response.status,
          result as ErrorRes,
          msg,
          response.headers as AxiosResponseHeaders,
        );
      }

      return result as Rsp;
    } else {
      return (await response.data) as Rsp;
    }
  }

  async post<Req, Rsp>(
    apiUrl: string,
    body?: Req,
    isStream = false,
    options?: RequestOptions,
  ): Promise<Rsp> {
    return this.makeRequest<Req, Rsp>(apiUrl, 'POST', body, isStream, options);
  }

  async get<Req, Rsp>(
    apiUrl: string,
    param?: Req,
    isStream?: boolean,
    options?: RequestOptions,
  ): Promise<Rsp> {
    // 拼接参数
    const queryString = Object.entries(param || {})
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    return this.makeRequest<Req, Rsp>(
      queryString
        ? `${apiUrl}${apiUrl.includes('?') ? '&' : '?'}${queryString}`
        : apiUrl,
      'GET',
      undefined,
      isStream,
      options,
    );
  }

  async put<Req, Rsp>(
    apiUrl: string,
    body?: Req,
    isStream?: boolean,
    options?: RequestOptions,
  ): Promise<Rsp> {
    return this.makeRequest<Req, Rsp>(apiUrl, 'PUT', body, isStream, options);
  }

  async delete<Req, Rsp>(
    apiUrl: string,
    isStream?: boolean,
    options?: RequestOptions,
  ): Promise<Rsp> {
    return this.makeRequest<Req, Rsp>(
      apiUrl,
      'DELETE',
      undefined,
      isStream,
      options,
    );
  }

  public getConfig() {
    return this._config;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public debugLog(...msgs: any[]) {
    if (this.debug) {
      console.debug(...msgs);
    }
  }
}
