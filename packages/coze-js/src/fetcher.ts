/* eslint-disable @typescript-eslint/no-explicit-any */

import fetch from 'node-fetch';
import axios, {
  type AxiosResponseHeaders,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosInstance,
  type AxiosStatic,
} from 'axios';

import { isBrowser } from './utils';
import {
  APIError,
  TimeoutError,
  type ErrorRes,
  CozeError,
  APIUserAbortError,
} from './error';

export interface FetchAPIOptions extends AxiosRequestConfig {
  // Custom axios instance
  axiosInstance?: AxiosInstance | unknown;
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

// node-fetch is used for streaming requests
const adapterFetch = async (options: any): Promise<any> => {
  const response = await fetch(options.url, {
    body: options.data,
    ...options,
  });
  return {
    data: response.body,
    ...response,
  };
};

const isSupportNativeFetch = () => {
  if (isBrowser()) {
    return true;
  }
  // native fetch is supported in node 18.0.0 or higher
  const version = process.version.slice(1);
  return compareVersions(version, '18.0.0') >= 0;
};

export async function fetchAPI<ResultType>(
  url: string,
  options: FetchAPIOptions = {},
) {
  const axiosInstance = options.axiosInstance || axios;

  // Add version check for streaming requests
  if (options.isStreaming && isAxiosStatic(axiosInstance)) {
    const axiosVersion = axiosInstance.VERSION || axios.VERSION;
    if (!axiosVersion || compareVersions(axiosVersion, '1.7.1') < 0) {
      throw new CozeError(
        'Streaming requests require axios version 1.7.1 or higher. Please upgrade your axios version.',
      );
    }
  }

  const response: AxiosResponse = await (axiosInstance as AxiosInstance)({
    url,
    responseType: options.isStreaming ? 'stream' : 'json',
    adapter: options.isStreaming
      ? isSupportNativeFetch()
        ? 'fetch'
        : adapterFetch
      : undefined,
    ...options,
  }).catch(error => {
    throw handleError(error);
  });

  return {
    async *stream(): AsyncGenerator<ResultType> {
      try {
        const stream = response.data;
        const reader = stream[Symbol.asyncIterator]
          ? stream[Symbol.asyncIterator]()
          : stream.getReader();
        const decoder = new TextDecoder();
        const fieldValues: Record<string, string> = {};
        let buffer = '';
        while (true) {
          const { done, value } = await (reader.next
            ? reader.next()
            : reader.read());
          if (done) {
            if (buffer) {
              // If the stream ends without a newline, it means an error occurred
              fieldValues.event = 'error';
              fieldValues.data = buffer;
              yield fieldValues as ResultType;
            }
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

// Add version comparison utility
function compareVersions(v1: string, v2: string): number {
  const v1Parts = v1.split('.').map(Number);
  const v2Parts = v2.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const part1 = v1Parts[i] || 0;
    const part2 = v2Parts[i] || 0;
    if (part1 > part2) {
      return 1;
    }
    if (part1 < part2) {
      return -1;
    }
  }
  return 0;
}

function isAxiosStatic(instance: unknown): instance is AxiosStatic {
  return !!(instance as AxiosStatic)?.Axios;
}
