import nodeFetch from 'node-fetch';
import axios from 'axios';

import { fetchAPI, adapterFetch } from '../src/fetcher';
import { TimeoutError, APIUserAbortError, CozeError } from '../src/error';
import { COZE_CN_BASE_URL } from '../src/constant';

vi.mock('axios');
vi.mock('node-fetch');
vi.mock('../src/utils', () => ({
  isBrowser: vi.fn().mockReturnValue(false),
  isUniApp: vi.fn().mockReturnValue(false),
  isBrowserExtension: vi.fn().mockReturnValue(false),
}));

const mockedAxios = vi.mocked(axios);
const mockedFetch = vi.mocked(nodeFetch);

describe('fetchAPI', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should make a successful JSON request', async () => {
    mockedAxios.mockResolvedValue({ data: { message: 'Success' } });

    const result = await fetchAPI('https://api.example.com/data');
    const jsonResult = await result.json();

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://api.example.com/data',
        responseType: 'json',
      }),
    );
    expect(jsonResult).toEqual({ message: 'Success' });
  });

  it('should handle streaming requests', async () => {
    const mockStream = {
      [Symbol.asyncIterator]: vi.fn().mockImplementation(function* () {
        yield new TextEncoder().encode('data: {"chunk": 1}\n\n');
        yield new TextEncoder().encode('data: {"chunk": 2}\n\n');
      }),
    };
    mockedAxios.mockResolvedValue({ data: mockStream });

    const result = await fetchAPI('https://api.example.com/stream', {
      isStreaming: true,
    });
    const streamResult = result.stream();

    const chunks: { data: string }[] = [];
    for await (const chunk of streamResult) {
      chunks.push(chunk as { data: string });
    }

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://api.example.com/stream',
        responseType: 'stream',
        adapter: 'fetch',
      }),
    );
    expect(chunks).toEqual([
      { data: '{"chunk": 2}' },
      { data: '{"chunk": 2}' },
    ]);
  });

  it('should handle timeout errors', async () => {
    const mockError = {
      code: 'ECONNABORTED',
      message: 'timeout of 1000ms exceeded',
      isAxiosError: true,
    };
    mockedAxios.mockRejectedValue(mockError);

    await expect(fetchAPI('https://api.example.com/data')).rejects.toThrow(
      TimeoutError,
    );
  });

  it('should handle user abort errors', async () => {
    const mockError = {
      isAxiosError: true,
      code: 'ERR_CANCELED',
      message: 'Request aborted',
      response: {
        status: 499,
        data: null,
        headers: {},
      },
    };
    mockedAxios.mockRejectedValue(mockError);

    await expect(fetchAPI('https://api.example.com/data')).rejects.toThrow(
      APIUserAbortError,
    );
  });

  describe('checkError function tests', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should show warning with correct base URL', async () => {
      const url = 'https://api.coze.com/path';
      const consoleWarnSpy = vi.spyOn(console, 'warn');
      // Access the checkError function from fetchAPI function scope
      // We need to trigger it through the error handling flow
      mockedAxios.mockRejectedValueOnce({
        status: 401,
        response: { status: 401 },
      });

      // This will call checkError internally
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      await fetchAPI(url).catch(() => {});

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `鉴权失败，如果您是国内用户，请将 baseURL 设置为 ${COZE_CN_BASE_URL}`,
        ),
      );
    });

    it('should not show warning with incorrect base URL', async () => {
      const url = 'https://api.example.com/path';
      const consoleWarnSpy = vi.spyOn(console, 'warn');

      // Access the checkError function from fetchAPI function scope
      // We need to trigger it through the error handling flow
      mockedAxios.mockRejectedValueOnce({
        status: 401,
        response: { status: 401 },
      });

      // This will call checkError internally
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      await fetchAPI(url).catch(() => {});

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should show warning when streaming error with code 4101 occurs', async () => {
      const url = 'https://api.coze.com/stream';
      const consoleWarnSpy = vi.spyOn(console, 'warn');

      // Mock a stream that will end with an error
      const mockStream = {
        [Symbol.asyncIterator]: vi.fn().mockImplementation(function* () {
          // This will be the last chunk that causes an error
          yield new TextEncoder().encode(
            '{"code": 4101, "message": "Unauthorized"}',
          );
        }),
      };

      mockedAxios.mockResolvedValueOnce({ data: mockStream });

      const result = await fetchAPI(url, { isStreaming: true });
      const streamResult = result.stream();

      // Consume the stream to trigger the error handling
      // eslint-disable-next-line  @typescript-eslint/no-unused-vars,no-empty
      for await (const _ of streamResult) {
      }

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `鉴权失败，如果您是国内用户，请将 baseURL 设置为 ${COZE_CN_BASE_URL}`,
        ),
      );
    });
  });

  it('should handle API errors', async () => {
    const mockError = {
      response: {
        status: 404,
        data: { error: 'Not Found' },
        headers: {},
      },
      message: 'Request failed with status code 404',
      isAxiosError: true,
    };
    mockedAxios.mockRejectedValue(mockError);

    await expect(fetchAPI('https://api.example.com/data')).rejects.toThrow(
      CozeError,
    );
  });

  it('should handle unexpected errors', async () => {
    const mockError = new Error('Unexpected error');
    mockedAxios.mockRejectedValue(mockError);

    await expect(fetchAPI('https://api.example.com/data')).rejects.toThrow(
      CozeError,
    );
  });

  it('should throw an error if axios version is less than 1.7.1', async () => {
    // Mock axios.version to be an older version
    const originalVersion = axios.VERSION;
    Object.defineProperty(axios, 'VERSION', {
      value: '1.7.0',
      configurable: true,
    });

    await expect(
      fetchAPI('https://api.example.com/data', {
        isStreaming: true,
      }),
    ).rejects.toThrow(
      'Streaming requests require axios version 1.7.1 or higher. Please upgrade your axios version.',
    );

    // Restore original version
    Object.defineProperty(axios, 'VERSION', {
      value: originalVersion,
      configurable: true,
    });
  });

  it('should use adapterFetch for streaming requests', async () => {
    const mockStream = {
      [Symbol.asyncIterator]: vi.fn().mockImplementation(function* () {
        yield new TextEncoder().encode('data: {"chunk": 1}\n\n');
      }),
    };
    mockedAxios.mockResolvedValue({ data: mockStream });

    // Mock Node.js version to be lower than 18.0.0 to force using adapterFetch
    Object.defineProperty(process, 'version', { value: 'v16.0.0' });

    const result = await fetchAPI('https://api.example.com/stream', {
      isStreaming: true,
    });
    const streamResult = result.stream();

    const chunks: { data: string }[] = [];
    for await (const chunk of streamResult) {
      chunks.push(chunk as { data: string });
    }

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://api.example.com/stream',
        responseType: 'stream',
        isStreaming: true,
        adapter: expect.any(Function),
      }),
    );
    expect(chunks).toEqual([{ data: '{"chunk": 1}' }]);
  });
});

describe('adapterFetch', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should properly adapt node-fetch response', async () => {
    const mockBody = { test: 'data' };
    const mockResponse = {
      body: mockBody,
      status: 200,
      headers: new Map(),
      ok: true,
      json: () => Promise.resolve(mockBody),
    };

    mockedFetch.mockResolvedValue(mockResponse as any);

    const options = {
      url: 'https://api.example.com',
      data: JSON.stringify({ foo: 'bar' }),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };

    const result = await adapterFetch(options);

    expect(mockedFetch).toHaveBeenCalledWith(options.url, {
      data: options.data,
      body: options.data,
      method: options.method,
      headers: options.headers,
      url: options.url,
    });

    expect(result).toEqual({
      data: mockBody,
      ...mockResponse,
    });
  });
});
