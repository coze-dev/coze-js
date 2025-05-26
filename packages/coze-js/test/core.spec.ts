import { WebSocketAPI } from '../src/websocket-api';
import * as utils from '../src/utils.js';
import { fetchAPI } from '../src/fetcher';
import { APIError } from '../src/error';
import { APIClient } from '../src/core';

vi.mock('../src/fetcher');

// Add WebSocket mock
vi.mock('../src/websocket-api', () => ({
  WebSocketAPI: vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockResolvedValue(true),
  })),
}));

vi.mock('../src/version', () => ({
  ...vi.importActual('../src/version'),
  getBrowserClientUserAgent: vi
    .fn()
    .mockReturnValue('mocked-browser-user-agent'),
  getUniAppClientUserAgent: vi.fn().mockReturnValue('mocked-uniapp-user-agent'),
}));

describe('APIClient', () => {
  const mockConfig = {
    baseURL: 'https://api.example.com',
    token: 'test-token',
    debug: true,
  };

  let client: APIClient;

  beforeEach(() => {
    vi.spyOn(utils, 'isUniApp').mockReturnValue(false);
    client = new APIClient(mockConfig);
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with correct values', () => {
      expect(client.baseURL).toBe(mockConfig.baseURL);
      expect(client.token).toBe(mockConfig.token);
      expect(client.debug).toBe(mockConfig.debug);
    });

    it('should throw error when allowPersonalAccessTokenInBrowser is false', () => {
      vi.spyOn(utils, 'isBrowser').mockReturnValue(true);
      expect(
        () =>
          new APIClient({
            token: 'pat_xxx',
          }),
      ).toThrow(
        'Browser environments do not support authentication using Personal Access Token (PAT) by default.\nas it may expose secret API keys. \n\nPlease use OAuth2.0 authentication mechanism. see:\nhttps://www.coze.com/docs/developer_guides/oauth_apps?_lang=en \n\nIf you need to force use, please set the `allowPersonalAccessTokenInBrowser` option to `true`. \n\ne.g new CozeAPI({ token, allowPersonalAccessTokenInBrowser: true });\n\n',
      );
    });
  });

  describe('makeRequest', () => {
    const mockResponse = {
      status: 200,
      headers: { 'content-type': 'application/json' },
    };

    it('should make a successful request', async () => {
      const mockJson = vi.fn().mockResolvedValue({ code: 0, data: 'success' });
      (fetchAPI as vi.Mock).mockResolvedValue({
        response: mockResponse,
        json: mockJson,
      });

      const result = await client.makeRequest('/test', 'GET');
      expect(result).toEqual({ code: 0, data: 'success' });
      expect(fetchAPI).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            authorization: 'Bearer test-token',
          }),
        }),
      );
    });

    it('should use dynamic token', async () => {
      const client2 = new APIClient({
        ...mockConfig,
        token: async () => Promise.resolve('test-dynamic-token'),
      });
      const mockJson = vi.fn().mockResolvedValue({ code: 0, data: 'success' });
      (fetchAPI as vi.Mock).mockResolvedValue({
        response: mockResponse,
        json: mockJson,
      });

      const result = await client2.makeRequest('/test', 'GET');
      expect(result).toEqual({ code: 0, data: 'success' });
      expect(fetchAPI).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            authorization: 'Bearer test-dynamic-token',
          }),
        }),
      );
    });

    it('should handle errors', async () => {
      const mockJson = vi
        .fn()
        .mockResolvedValue({ code: 400, msg: 'Bad Request' });
      (fetchAPI as vi.Mock).mockResolvedValue({
        response: { ...mockResponse, status: 400 },
        json: mockJson,
      });

      await expect(client.makeRequest('/test', 'GET')).rejects.toThrow(
        APIError,
      );
    });

    it('should handle streaming responses', async () => {
      const mockStream = vi.fn().mockReturnValue('stream-data');
      (fetchAPI as vi.Mock).mockResolvedValue({
        response: {
          ...mockResponse,
          headers: { 'content-type': 'application/octet-stream' },
        },
        stream: mockStream,
      });

      const result = await client.makeRequest('/test', 'GET', undefined, true);
      expect(result).toBe('stream-data');
      expect(mockStream).toHaveBeenCalled();
    });
  });

  describe('HTTP methods', () => {
    beforeEach(() => {
      vi.spyOn(client as any, 'makeRequest').mockResolvedValue('success');
    });

    it('should make a GET request', async () => {
      await client.get('/test', { param: 'value' });
      expect(client.makeRequest).toHaveBeenCalledWith(
        '/test?param=value',
        'GET',
        undefined,
        undefined,
        undefined,
      );
    });

    it('should make a POST request', async () => {
      await client.post('/test', { data: 'value' });
      expect(client.makeRequest).toHaveBeenCalledWith(
        '/test',
        'POST',
        { data: 'value' },
        false,
        undefined,
      );
    });

    it('should make a PUT request', async () => {
      await client.put('/test', { data: 'value' });
      expect(client.makeRequest).toHaveBeenCalledWith(
        '/test',
        'PUT',
        { data: 'value' },
        undefined,
        undefined,
      );
    });

    it('should make a DELETE request', async () => {
      await client.delete('/test');
      expect(client.makeRequest).toHaveBeenCalledWith(
        '/test',
        'DELETE',
        undefined,
        undefined,
        undefined,
      );
    });
  });

  describe('debugLog', () => {
    it('should log when debug is true', () => {
      const consoleSpy = vi.spyOn(console, 'debug').mockImplementation();
      client.debugLog(false, 'test message');
      expect(consoleSpy).toHaveBeenCalledWith('test message');
    });

    it('should not log when debug is false', () => {
      client.debug = false;
      const consoleSpy = vi.spyOn(console, 'debug').mockImplementation();
      client.debugLog(false, 'test message');
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('makeWebsocket', () => {
    it('should make a websocket connection with correct configuration', async () => {
      const mockToken = 'test-token';
      const expectedUrl = 'wss://ws.coze.com/test';
      client.baseWsURL = 'wss://ws.coze.com';

      const websocket = await client.makeWebsocket('/test');

      expect(websocket).toBeDefined();
      expect(WebSocketAPI).toHaveBeenCalledWith(
        expectedUrl,
        expect.objectContaining({
          debug: true,
          headers: {
            'X-Coze-Client-User-Agent': 'mocked-browser-user-agent',
            authorization: `Bearer ${mockToken}`,
          },
        }),
      );
    });

    it('should merge custom websocket options', async () => {
      const customOptions = {
        maxReconnectionDelay: 5000,
        minReconnectionDelay: 1000,
        debug: false,
      };

      const websocket = await client.makeWebsocket('/test', customOptions);

      expect(WebSocketAPI).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining(customOptions),
      );

      expect(websocket).toBeDefined();
    });

    it('should use dynamic token for websocket connection', async () => {
      const dynamicToken = 'dynamic-test-token';
      const client2 = new APIClient({
        ...mockConfig,
        token: async () => Promise.resolve(dynamicToken),
      });

      const websocket = await client2.makeWebsocket('/test');

      expect(websocket).toBeDefined();

      expect(WebSocketAPI).toHaveBeenCalledWith(
        'wss://ws.coze.cn/test',
        expect.objectContaining({
          debug: true,
          headers: {
            'X-Coze-Client-User-Agent': 'mocked-browser-user-agent',
            authorization: `Bearer ${dynamicToken}`,
          },
        }),
      );
    });
  });
});
