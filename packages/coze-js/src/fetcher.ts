/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, {
  type AxiosResponseHeaders,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

import {
  APIError,
  TimeoutError,
  type ErrorRes,
  CozeError,
  APIUserAbortError,
} from './error.js';

export interface FetchAPIOptions extends AxiosRequestConfig {
  // Custom axios instance
  axiosInstance?: typeof axios;
  // Whether to use streaming mode
  isStreaming?: boolean;
}

const handleError = (error: any) => {
  if (error.isAxiosError || (error.code && error.message)) {
    if (
      (error.code === 'ECONNABORTED' && error.message.includes('timeout')) ||
      error.code === 'ETIMEDOUT'
    ) {
      return new TimeoutError(
        408,
        undefined,
        `Request timed out: ${error.message}`,
        error.response?.headers as AxiosResponseHeaders,
      );
    } else if (error.code === 'ERR_CANCELED') {
      return new APIUserAbortError(error.message);
    } else {
      return APIError.generate(
        error.response?.status || 500,
        error.response?.data as ErrorRes,
        error.message,
        error.response?.headers as AxiosResponseHeaders,
      );
    }
  } else {
    return new CozeError(`Unexpected error: ${error.message}`);
  }
};

export async function fetchAPI<ResultType>(
  url: string,
  options: FetchAPIOptions = {},
) {
  const axiosInstance = options.axiosInstance || axios;
  const response: AxiosResponse = await axiosInstance({
    url,
    responseType: options.isStreaming ? 'stream' : 'json',
    adapter: options.isStreaming ? 'fetch' : undefined,
    ...options,
  }).catch(error => {
    throw handleError(error);
  });

  return {
    async *stream(): AsyncGenerator<ResultType> {
      try {
        const stream = response.data;
        const reader = stream[Symbol.asyncIterator]();
        const decoder = new TextDecoder();
        const fieldValues: Record<string, string> = {};
        let buffer = '';
        while (true) {
          const { done, value } = await reader.next();
          if (done) {
            break;
          }
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i];

            const index = line.indexOf(':');
            if (index !== -1) {
              const field = line.substring(0, index).trim();
              const content = line.substring(index + 1).trim();
              fieldValues[field] = content;
              if (field === 'data') {
                yield fieldValues as ResultType;
              }
            }
          }
          buffer = lines[lines.length - 1]; // Keep the last incomplete line in the buffer
        }
      } catch (error) {
        handleError(error);
      }
    },
    json: () => response.data as ResultType,
    response,
  };
}
