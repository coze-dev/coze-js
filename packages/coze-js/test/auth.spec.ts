import * as utils from '../src/utils.js';
import { APIClient } from '../src/core.js';
import {
  getWebAuthenticationUrl,
  getPKCEAuthenticationUrl,
  getWebOAuthToken,
  getDeviceCode,
  getDeviceToken,
  getJWTToken,
} from '../src/auth';

vi.mock('../src/core');

describe('Auth functions', () => {
  const mockConfig = {
    baseURL: 'https://api.coze.com',
    clientId: 'test-client-id',
    redirectUrl: 'https://example.com/callback',
    state: 'test-state',
    clientSecret: 'test-client-secret',
  };

  let isBrowserSpy: vi.SpyInstance;

  beforeEach(() => {
    vi.resetAllMocks();
    isBrowserSpy = vi.spyOn(utils, 'isBrowser');
  });

  afterEach(() => {
    isBrowserSpy.mockRestore();
  });

  describe('Browser environment checks', () => {
    describe('getDeviceCode', () => {
      it('should throw an error in browser environment', async () => {
        vi.spyOn(utils, 'isBrowser').mockReturnValue(true);
        await expect(
          getDeviceCode({ clientId: 'test-client-id' }),
        ).rejects.toThrow('getDeviceCode is not supported in browser');
      });

      it('should not throw an error in non-browser environment', async () => {
        vi.spyOn(utils, 'isBrowser').mockReturnValue(false);
        const mockPost = vi
          .fn()
          .mockResolvedValue({ device_code: 'test-device-code' });
        (APIClient as unknown as vi.Mock).mockImplementation(() => ({
          post: mockPost,
        }));

        await expect(
          getDeviceCode({ clientId: 'test-client-id' }),
        ).resolves.not.toThrow();
      });
    });

    describe('getDeviceToken', () => {
      it('should throw an error in browser environment', async () => {
        vi.spyOn(utils, 'isBrowser').mockReturnValue(true);
        await expect(
          getDeviceToken({
            clientId: 'test-client-id',
            deviceCode: 'test-device-code',
          }),
        ).rejects.toThrow('getDeviceToken is not supported in browser');
      });

      it('should not throw an error in non-browser environment', async () => {
        vi.spyOn(utils, 'isBrowser').mockReturnValue(false);
        const mockPost = vi
          .fn()
          .mockResolvedValue({ access_token: 'test-token' });
        (APIClient as unknown as vi.Mock).mockImplementation(() => ({
          post: mockPost,
        }));

        await expect(
          getDeviceToken({
            clientId: 'test-client-id',
            deviceCode: 'test-device-code',
          }),
        ).resolves.not.toThrow();
      });
    });

    describe('getJWTToken', () => {
      it('should throw an error in browser environment', async () => {
        vi.spyOn(utils, 'isBrowser').mockReturnValue(true);
        await expect(getJWTToken({ token: 'test-token' })).rejects.toThrow(
          'getJWTToken is not supported in browser',
        );
      });

      it('should not throw an error in non-browser environment', async () => {
        vi.spyOn(utils, 'isBrowser').mockReturnValue(false);
        const mockPost = vi
          .fn()
          .mockResolvedValue({ access_token: 'test-jwt-token' });
        (APIClient as unknown as vi.Mock).mockImplementation(() => ({
          post: mockPost,
        }));

        await expect(
          getJWTToken({ token: 'test-token' }),
        ).resolves.not.toThrow();
      });
    });
  });

  describe('getAuthenticationUrl', () => {
    it('should return the correct authentication URL', () => {
      const url = getWebAuthenticationUrl(mockConfig);
      expect(url).toBe(
        'https://www.coze.com/api/permission/oauth2/authorize?response_type=code&client_id=test-client-id&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&state=test-state',
      );
    });
  });

  describe('getPKCEAuthenticationUrl', () => {
    it('should return the correct PKCE authentication URL and code verifier', async () => {
      const { url, codeVerifier } = await getPKCEAuthenticationUrl(mockConfig);
      expect(url).toContain(
        'https://www.coze.com/api/permission/oauth2/authorize?response_type=code&client_id=test-client-id&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&state=test-state&code_challenge=',
      );
      expect(url).toContain('&code_challenge_method=S256');
      expect(codeVerifier).toBeTruthy();
    });

    it('should return the correct PKCE authentication URL with workspace_id', async () => {
      const { url, codeVerifier } = await getPKCEAuthenticationUrl({
        ...mockConfig,
        workspace_id: '123',
      });
      expect(url).toContain(
        'https://www.coze.com/api/permission/oauth2/workspace_id/123/authorize?response_type=code&client_id=test-client-id&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&state=test-state&code_challenge=',
      );
      expect(url).toContain('&code_challenge_method=S256');
      expect(codeVerifier).toBeTruthy();
    });
  });

  describe('getOAuthToken', () => {
    it('should call APIClient.post with correct parameters', async () => {
      const mockPost = vi
        .fn()
        .mockResolvedValue({ access_token: 'test-token' });
      (APIClient as unknown as vi.Mock).mockImplementation(() => ({
        post: mockPost,
      }));

      await getWebOAuthToken({ ...mockConfig, code: 'test-code' });

      expect(APIClient).toHaveBeenCalledWith({
        token: mockConfig.clientSecret,
        baseURL: mockConfig.baseURL,
      });
      expect(mockPost).toHaveBeenCalledWith(
        '/api/permission/oauth2/token',
        {
          grant_type: 'authorization_code',
          client_id: mockConfig.clientId,
          redirect_uri: mockConfig.redirectUrl,
          code: 'test-code',
          // code_verifier: undefined,
        },
        false,
        undefined,
      );
    });
  });

  describe('getDeviceCode', () => {
    it('should call APIClient.post with correct parameters', async () => {
      const mockPost = vi
        .fn()
        .mockResolvedValue({ device_code: 'test-device-code' });
      (APIClient as unknown as vi.Mock).mockImplementation(() => ({
        post: mockPost,
      }));

      await getDeviceCode({
        clientId: mockConfig.clientId,
        baseURL: mockConfig.baseURL,
      });

      expect(APIClient).toHaveBeenCalledWith({
        token: '',
        baseURL: mockConfig.baseURL,
      });
      expect(mockPost).toHaveBeenCalledWith(
        '/api/permission/oauth2/device/code',
        {
          client_id: mockConfig.clientId,
        },
        false,
        undefined,
      );
    });
  });

  describe('getDeviceToken', () => {
    it('should call APIClient.post with correct parameters', async () => {
      const mockPost = vi
        .fn()
        .mockResolvedValue({ access_token: 'test-token' });
      (APIClient as unknown as vi.Mock).mockImplementation(() => ({
        post: mockPost,
      }));

      await getDeviceToken({
        clientId: mockConfig.clientId,
        baseURL: mockConfig.baseURL,
        deviceCode: 'test-device-code',
      });

      expect(APIClient).toHaveBeenCalledWith({
        token: '',
        baseURL: mockConfig.baseURL,
      });
      expect(mockPost).toHaveBeenCalledWith(
        '/api/permission/oauth2/token',
        {
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
          client_id: mockConfig.clientId,
          device_code: 'test-device-code',
        },
        false,
        undefined,
      );
    });
  });

  describe('getJWTToken', () => {
    it('should call APIClient.post with correct parameters', async () => {
      const mockPost = vi
        .fn()
        .mockResolvedValue({ access_token: 'test-jwt-token' });
      (APIClient as unknown as vi.Mock).mockImplementation(() => ({
        post: mockPost,
      }));

      await getJWTToken({
        token: 'test-token',
        baseURL: mockConfig.baseURL,
        duration_seconds: 3600,
      });

      expect(APIClient).toHaveBeenCalledWith({
        token: 'test-token',
        baseURL: mockConfig.baseURL,
      });
      expect(mockPost).toHaveBeenCalledWith(
        '/api/permission/oauth2/token',
        {
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          duration_seconds: 3600,
          scope: undefined,
        },
        false,
        undefined,
      );
    });
  });
});
