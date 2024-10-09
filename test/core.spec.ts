import { APIClient } from '../src/core';
import { fetch } from '../src/shims/index';
import { DEFAULT_BASE_URL } from '../src/constant';

jest.mock('../src/shims/index');

describe('APIClient', () => {
  let client: APIClient;

  beforeEach(() => {
    client = new APIClient({ token: 'test-token' });
    (fetch as jest.Mock).mockClear();
  });

  it('should initialize with default base URL', () => {
    expect(client['baseURL']).toBe(DEFAULT_BASE_URL);
  });

  it('should initialize with custom base URL', () => {
    const customBaseURL = 'https://api.coze.com';
    client = new APIClient({ token: 'test-token', baseURL: customBaseURL });
    expect(client['baseURL']).toBe(customBaseURL);
  });

  it('should make a GET request', async () => {
    const mockResponse = {
      ok: true,
      headers: {
        get: jest.fn().mockReturnValue('application/json'),
      },
      json: jest.fn().mockResolvedValue({ data: 'test' }),
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const response = await client.get('/test');

    expect(fetch).toHaveBeenCalledWith(`${DEFAULT_BASE_URL}/test`, {
      method: 'GET',
      headers: {
        'agw-js-conv': 'str',
        authorization: 'Bearer test-token',
      },
    });
    expect(response).toEqual({ data: 'test' });
  });

  it('should make a POST request', async () => {
    const mockResponse = {
      ok: true,
      headers: {
        get: jest.fn().mockReturnValue('application/json'),
      },
      json: jest.fn().mockResolvedValue({ data: 'test' }),
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const postData = { key: 'value' };
    const response = await client.post('/test', postData);

    expect(fetch).toHaveBeenCalledWith(`${DEFAULT_BASE_URL}/test`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'agw-js-conv': 'str',
        authorization: 'Bearer test-token',
      },
      body: JSON.stringify(postData),
    });
    expect(response).toEqual({ data: 'test' });
  });

  it('should handle errors', async () => {
    const errorMessage = 'Test error';
    (fetch as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(client.get('/test')).rejects.toThrow(errorMessage);
  });
});
