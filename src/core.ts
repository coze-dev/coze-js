import { DEFAULT_BASE_URL } from './constant.js';
import { APIError, type ErrorRes } from './error.js';
import { fetch, FormData, type RequestInit, isBrowser } from './shims/index.js';
import * as Errors from './error.js';
import { fetchAPI, type StreamType } from './base/fetcher';

export interface ClientOptions {
  baseURL?: string;
  token: string;
  timeout?: number; // TODO unsupport yet!
  fetch?: typeof fetch; // TODO unsupport yet!
}
interface ResponseType {
  code: number;
  msg?: string;
  error?: ErrorRes;
}

export class APIClient {
  protected _config: ClientOptions;
  baseURL: string;
  token: string;
  protected fetch: typeof fetch;
  constructor(config: ClientOptions) {
    this._config = config;
    this.baseURL = config.baseURL || DEFAULT_BASE_URL;
    this.token = config.token;
    this.fetch = config.fetch || fetch;
  }

  static APIError = Errors.APIError;
  static BadRequestError = Errors.BadRequestError;
  static AuthenticationError = Errors.AuthenticationError;
  static PermissionDeniedError = Errors.PermissionDeniedError;
  static NotFoundError = Errors.NotFoundError;
  static RateLimitError = Errors.RateLimitError;
  static InternalServerError = Errors.InternalServerError;
  static GatewayError = Errors.GatewayError;

  protected buildHeaders() {
    const headers = {
      authorization: `Bearer ${this.token}`,
    };

    // FIXME: browser 下存在跨域问题，后续再看看
    if (!isBrowser) {
      headers['agw-js-conv'] = 'str';
    }
    return headers;
  }

  protected buildOptions(method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: unknown): RequestInit {
    const headers = this.buildHeaders();
    const options: RequestInit = { method, headers };
    if (body instanceof FormData) {
      options.body = body;
    } else if (body) {
      headers['content-type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
    return options;
  }
  protected async makeRequest<Req, Rsp>(apiUrl: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: Req, isStream?: boolean): Promise<Rsp> {
    const fullUrl = `${this.baseURL}${apiUrl}`;
    const options = this.buildOptions(method, body);

    // const response = await this.fetch(fullUrl, options);
    const { response, stream, output } = await fetchAPI<ResponseType | StreamType>(fullUrl, options);

    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      const text = await response.text();
      throw APIError.generate(
        response.status,
        { code: response.status, msg: 'HTTP error!', error: { detail: text } } as ErrorRes,
        'HTTP error!',
        response.headers,
      );
    }

    if (isStream) {
      if (contentType && contentType.includes('application/json')) {
        // 可能是出错了，因为 streaming 模式下，content-type 需要是 text/event-stream
        // 有时候 API 返回的是
        //   status_code: 200
        //   content_type: application/json; charset=utf-8
        //   body: {"code":4000,"msg":"Request parameter error"}
        // 这种奇葩设计

        const result = (await response.json()) as ResponseType;
        const { code, msg } = result;
        if (code !== 0 && code !== undefined) {
          console.debug('request url:', fullUrl, 'body:', body);
          throw APIError.generate(response.status, result as ErrorRes, msg, response.headers);
        }
      }
      return stream as StreamType;
    }

    if (contentType && contentType.includes('application/json')) {
      const result = await output();
      const { code, msg } = result as ResponseType;
      if (code !== 0 && code !== undefined) {
        console.debug('request url:', fullUrl, 'body:', body);
        throw APIError.generate(response.status, output as unknown as ErrorRes, msg, response.headers);
      }

      return result as Rsp;
    } else {
      return (await response.text()) as Rsp;
    }
  }

  async post<Req, Rsp>(apiUrl: string, body?: Req, isStream = false): Promise<Rsp> {
    return this.makeRequest<Req, Rsp>(apiUrl, 'POST', body, isStream);
  }

  async get<Req, Rsp>(apiUrl: string, param?: Req, isStream?: boolean): Promise<Rsp> {
    // 拼接参数
    const queryString = Object.entries(param || {})
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    return this.makeRequest<Req, Rsp>(
      queryString ? `${apiUrl}${apiUrl.includes('?') ? '&' : '?'}${queryString}` : apiUrl,
      'GET',
      undefined,
      isStream,
    );
  }

  async put<Req, Rsp>(apiUrl: string, body?: Req, isStream?: boolean): Promise<Rsp> {
    return this.makeRequest<Req, Rsp>(apiUrl, 'PUT', body, isStream);
  }

  async delete<Req, Rsp>(apiUrl: string, isStream?: boolean): Promise<Rsp> {
    return this.makeRequest<Req, Rsp>(apiUrl, 'DELETE', undefined, isStream);
  }
}
