import axios from 'axios';

import { fetchAPI } from '../src/fetcher';
import { TimeoutError, APIUserAbortError, CozeError } from '../src/error';

vi.mock('axios');

const mockedAxios = vi.mocked(axios);

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
});
