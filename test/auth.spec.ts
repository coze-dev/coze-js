import { getAuthenticationUrl, getPKCEAuthenticationUrl, getOAuthToken, getDeviceCode, getDeviceToken, getJWTToken } from '../src/auth';
import { APIClient } from '../src/core';

jest.mock('../src/core');

describe('Auth functions', () => {
  const mockConfig = {
    baseURL: 'https://api.coze.com',
    clientId: 'test-client-id',
    redirectUrl: 'https://example.com/callback',
    state: 'test-state',
    clientSecret: 'test-client-secret',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getAuthenticationUrl', () => {
    it('should return the correct authentication URL', () => {
      const url = getAuthenticationUrl(mockConfig);
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
  });

  describe('getOAuthToken', () => {
    it('should call APIClient.post with correct parameters', async () => {
      const mockPost = jest.fn().mockResolvedValue({ access_token: 'test-token' });
      (APIClient as unknown as jest.Mock).mockImplementation(() => ({
        post: mockPost,
      }));

      await getOAuthToken({ ...mockConfig, code: 'test-code' });

      expect(APIClient).toHaveBeenCalledWith({ token: mockConfig.clientSecret, baseURL: mockConfig.baseURL });
      expect(mockPost).toHaveBeenCalledWith('/api/permission/oauth2/token', {
        grant_type: 'authorization_code',
        client_id: mockConfig.clientId,
        redirect_uri: mockConfig.redirectUrl,
        code: 'test-code',
        code_verifier: undefined,
      });
    });
  });

  describe('getDeviceCode', () => {
    it('should call APIClient.post with correct parameters', async () => {
      const mockPost = jest.fn().mockResolvedValue({ device_code: 'test-device-code' });
      (APIClient as unknown as jest.Mock).mockImplementation(() => ({
        post: mockPost,
      }));

      await getDeviceCode({ clientId: mockConfig.clientId, baseURL: mockConfig.baseURL });

      expect(APIClient).toHaveBeenCalledWith({ token: '', baseURL: mockConfig.baseURL });
      expect(mockPost).toHaveBeenCalledWith('/api/permission/oauth2/device/code', {
        client_id: mockConfig.clientId,
      });
    });
  });

  describe('getDeviceToken', () => {
    it('should call APIClient.post with correct parameters', async () => {
      const mockPost = jest.fn().mockResolvedValue({ access_token: 'test-token' });
      (APIClient as unknown as jest.Mock).mockImplementation(() => ({
        post: mockPost,
      }));

      await getDeviceToken({ clientId: mockConfig.clientId, baseURL: mockConfig.baseURL, deviceCode: 'test-device-code' });

      expect(APIClient).toHaveBeenCalledWith({ token: '', baseURL: mockConfig.baseURL });
      expect(mockPost).toHaveBeenCalledWith('/api/permission/oauth2/token', {
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        client_id: mockConfig.clientId,
        device_code: 'test-device-code',
      });
    });
  });

  describe('getJWTToken', () => {
    it('should call APIClient.post with correct parameters', async () => {
      const mockPost = jest.fn().mockResolvedValue({ access_token: 'test-jwt-token' });
      (APIClient as unknown as jest.Mock).mockImplementation(() => ({
        post: mockPost,
      }));

      await getJWTToken({ token: 'test-token', baseURL: mockConfig.baseURL, duration_seconds: 3600 });

      expect(APIClient).toHaveBeenCalledWith({ token: 'test-token', baseURL: mockConfig.baseURL });
      expect(mockPost).toHaveBeenCalledWith('/api/permission/oauth2/token', {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        duration_seconds: 3600,
        scope: undefined,
      });
    });
  });
});
