/* eslint-disable max-params */
import {
  type AxiosRequestConfig,
  type AxiosResponseHeaders,
  type AxiosInstance,
} from 'axios';

import { WebSocketAPI } from './websocket-api';
import {
  getBrowserClientUserAgent,
  getNodeClientUserAgent,
  getUniAppClientUserAgent,
  getUserAgent,
} from './version';
import {
  isBrowser,
  isBrowserExtension,
  isPersonalAccessToken,
  isUniApp,
  mergeConfig,
} from './utils';
import { type FetchAPIOptions, fetchAPI } from './fetcher';
import { APIError, type ErrorRes } from './error';
import * as Errors from './error';
import { COZE_COM_BASE_URL, COZE_CN_BASE_WS_URL } from './constant';

export type RequestOptions = Omit<
  AxiosRequestConfig,
  'url' | 'method' | 'baseURL' | 'data' | 'responseType'
> & {
  /** Whether to enable debug mode in current request */
  debug?: boolean;
} & Record<string, unknown>;

export interface WebsocketOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  WebSocket?: any; // WebSocket constructor, if none provided, defaults to global WebSocket
  maxReconnectionDelay?: number; // max delay in ms between reconnections
  minReconnectionDelay?: number; // min delay in ms between reconnections
  reconnectionDelayGrowFactor?: number; // how fast the reconnection delay grows
  minUptime?: number; // min time in ms to consider connection as stable
  connectionTimeout?: number; // retry connect if not connected after this time, in ms
  maxRetries?: number; // maximum number of retries
  maxEnqueuedMessages?: number; // maximum number of messages to buffer until reconnection
  startClosed?: boolean; // start websocket in CLOSED state, call `.reconnect()` to connect
  debug?: boolean; // enables debug output
  headers?: Record<string, string>; // custom headers
}

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
  /** base websocket URL, default is wss://ws.coze.cn */
  baseWsURL?: string;
  /** websocket options */
  websocketOptions?: WebsocketOptions;
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
  baseWsURL: string;
  constructor(config: ClientOptions) {
    this._config = config;
    this.baseURL = config.baseURL || COZE_COM_BASE_URL;
    this.baseWsURL = config.baseWsURL || COZE_CN_BASE_WS_URL;
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

    if (isUniApp()) {
      headers['X-Coze-Client-User-Agent'] = getUniAppClientUserAgent();
    } else if (isBrowser() || isBrowserExtension()) {
      headers['X-Coze-Client-User-Agent'] = getBrowserClientUserAgent();
    } else {
      headers['User-Agent'] = getUserAgent();
      headers['X-Coze-Client-User-Agent'] = getNodeClientUserAgent();
    }

    const config = mergeConfig(
      this.axiosOptions,
      options,
      { headers },
      { headers: this.headers || {} },
    );
    config.method = method;
    config.data = body;

    return config;
  }

  protected async buildWebsocketOptions(
    options?: WebsocketOptions,
  ): Promise<WebsocketOptions> {
    const token = await this.getToken();
    const headers: Record<string, string> = {
      authorization: `Bearer ${token}`,
    };

    if (isUniApp()) {
      headers['X-Coze-Client-User-Agent'] = getUniAppClientUserAgent();
    } else if (!isBrowser()) {
      headers['User-Agent'] = getUserAgent();
      headers['X-Coze-Client-User-Agent'] = getNodeClientUserAgent();
    } else {
      headers['X-Coze-Client-User-Agent'] = getBrowserClientUserAgent();
    }

    const config = mergeConfig(
      {
        debug: this._config.debug ?? false,
      },
      this._config.websocketOptions,
      options,
      { headers },
      { headers: this.headers || {} },
    );

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

    this.debugLog(options?.debug, `--- request url: ${fullUrl}`);
    this.debugLog(options?.debug, '--- request options:', fetchOptions);

    const { response, stream, json } = await fetchAPI(fullUrl, fetchOptions);

    this.debugLog(options?.debug, `--- response status: ${response.status}`);
    this.debugLog(options?.debug, '--- response headers: ', response.headers);

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

  public async makeWebsocket<Req, Rsp>(
    apiUrl: string,
    options?: WebsocketOptions,
  ) {
    const fullUrl = `${this.baseWsURL}${apiUrl}`;

    const websocketOptions = await this.buildWebsocketOptions(options);

    this.debugLog(options?.debug, `--- websocket url: ${fullUrl}`);
    this.debugLog(options?.debug, '--- websocket options:', websocketOptions);

    const ws = new WebSocketAPI<Req, Rsp>(fullUrl, websocketOptions);

    return ws;
  }

  public getConfig() {
    return this._config;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public debugLog(forceDebug = false, ...msgs: any[]) {
    if (this.debug || forceDebug) {
      console.debug(...msgs);
    }
  }
}
