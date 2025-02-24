import jwt from 'jsonwebtoken';

import * as utils from '../src/utils.js';
import { APIError, BadRequestError } from '../src/error.js';
import { APIClient } from '../src/core.js';
import { POLL_INTERVAL } from '../src/constant.js';
import {
  getWebAuthenticationUrl,
  getPKCEAuthenticationUrl,
  getWebOAuthToken,
  getDeviceCode,
  getDeviceToken,
  getJWTToken,
  getPKCEOAuthToken,
  refreshOAuthToken,
  PKCEAuthErrorType,
} from '../src/auth';

vi.mock('../src/core');

vi.mock('jsonwebtoken', () => ({
  default: {
    // eslint-disable-next-line max-params
    sign: vi.fn((payload, privateKey, options, callback) => {
      callback(null, 'mock.jwt.token');
      return undefined;
    }),
  },
}));

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

      describe('with polling enabled', () => {
        beforeEach(() => {
          vi.spyOn(utils, 'isBrowser').mockReturnValue(false);
          vi.spyOn(utils, 'sleep').mockImplementation(() => Promise.resolve());
        });

        it('should return token immediately when successful', async () => {
          const mockPost = vi
            .fn()
            .mockResolvedValue({ access_token: 'test-token' });
          (APIClient as unknown as vi.Mock).mockImplementation(() => ({
            post: mockPost,
          }));

          const result = await getDeviceToken({
            clientId: mockConfig.clientId,
            baseURL: mockConfig.baseURL,
            deviceCode: 'test-device-code',
            poll: true,
          });

          expect(result).toEqual({ access_token: 'test-token' });
          expect(mockPost).toHaveBeenCalledTimes(1);
          expect(utils.sleep).not.toHaveBeenCalled();
        });

        it('should throw error immediately for non-polling related errors', async () => {
          const mockError = APIError.generate(
            400,
            undefined, // error code
            'Test error', // error message
            undefined, // raw error
            // { error: 'invalid_request' }, // raw error
          );
          const mockPost = vi.fn().mockRejectedValue(mockError);
          (APIClient as unknown as vi.Mock).mockImplementation(() => ({
            post: mockPost,
          }));

          await expect(
            getDeviceToken({
              clientId: mockConfig.clientId,
              baseURL: mockConfig.baseURL,
              deviceCode: 'test-device-code',
              poll: true,
            }),
          ).rejects.toThrow('Test error');

          expect(mockPost).toHaveBeenCalledTimes(1);
          expect(utils.sleep).not.toHaveBeenCalled();
        });

        it('should retry on authorization_pending and succeed', async () => {
          const mockPost = vi
            .fn()
            // First call throws authorization_pending error
            .mockRejectedValueOnce(
              APIError.generate(
                400,
                {
                  error: PKCEAuthErrorType.AUTHORIZATION_PENDING,
                } as any,
                'Authorization pending',
                undefined,
              ),
            )
            // Second call succeeds
            .mockResolvedValueOnce({ access_token: 'test-token' });

          (APIClient as unknown as vi.Mock).mockImplementation(() => ({
            post: mockPost,
          }));

          const result = await getDeviceToken({
            clientId: mockConfig.clientId,
            baseURL: mockConfig.baseURL,
            deviceCode: 'test-device-code',
            poll: true,
          });

          expect(result).toEqual({ access_token: 'test-token' });
          expect(mockPost).toHaveBeenCalledTimes(2);
          expect(utils.sleep).toHaveBeenCalledTimes(1);
          expect(utils.sleep).toHaveBeenCalledWith(POLL_INTERVAL);
        });

        it('should retry on slow_down and succeed', async () => {
          const mockPost = vi
            .fn()
            // First call throws slow_down error
            .mockRejectedValueOnce(
              APIError.generate(
                400,
                {
                  error: PKCEAuthErrorType.SLOW_DOWN,
                } as any,
                'Slow down',
                undefined,
              ),
            )
            // Second call succeeds
            .mockResolvedValueOnce({ access_token: 'test-token' });

          (APIClient as unknown as vi.Mock).mockImplementation(() => ({
            post: mockPost,
          }));

          const result = await getDeviceToken({
            clientId: mockConfig.clientId,
            baseURL: mockConfig.baseURL,
            deviceCode: 'test-device-code',
            poll: true,
          });

          expect(result).toEqual({ access_token: 'test-token' });
          expect(mockPost).toHaveBeenCalledTimes(2);
          expect(utils.sleep).toHaveBeenCalledTimes(1);
          expect(utils.sleep).toHaveBeenCalledWith(POLL_INTERVAL * 2);
        });
      });
    });

    describe('getJWTToken', () => {
      it('should throw an error in browser environment', async () => {
        vi.spyOn(utils, 'isBrowser').mockReturnValue(true);
        await expect(
          getJWTToken({
            appId: 'test-app-id',
            aud: 'test-aud',
            keyid: 'test-key-id',
            privateKey: 'test-private-key',
          }),
        ).rejects.toThrow('getJWTToken is not supported in browser');
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

    it('should return the correct authentication URL with workspaceId', () => {
      const url = getWebAuthenticationUrl({
        ...mockConfig,
        workspaceId: '123',
      });
      expect(url).toBe(
        'https://www.coze.com/api/permission/oauth2/workspace_id/123/authorize?response_type=code&client_id=test-client-id&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&state=test-state',
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

    it('should return the correct PKCE authentication URL with workspaceId', async () => {
      const { url, codeVerifier } = await getPKCEAuthenticationUrl({
        ...mockConfig,
        workspaceId: '123',
      });
      expect(url).toContain(
        'https://www.coze.com/api/permission/oauth2/workspace_id/123/authorize?response_type=code&client_id=test-client-id&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&state=test-state&code_challenge=',
      );
      expect(url).toContain('&code_challenge_method=S256');
      expect(codeVerifier).toBeTruthy();
    });

    it('should work in browser environment', async () => {
      // Mock browser environment
      vi.spyOn(utils, 'isBrowser').mockReturnValue(true);

      // Mock window.crypto
      const mockSubtle = {
        digest: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4])),
      };

      const mockCrypto = {
        subtle: mockSubtle,
        getRandomValues: vi.fn(array => {
          for (let i = 0; i < array.length; i++) {
            array[i] = i % 256; // Fill with predictable values
          }
          return array;
        }),
      };

      // Mock window object
      const mockWindow = {
        crypto: mockCrypto,
      };

      // @ts-expect-error - Mocking global window
      vi.stubGlobal('window', mockWindow);

      const { url, codeVerifier } = await getPKCEAuthenticationUrl(mockConfig);

      expect(url).toContain(
        'https://www.coze.com/api/permission/oauth2/authorize?response_type=code&client_id=test-client-id&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&state=test-state&code_challenge=',
      );
      expect(url).toContain('&code_challenge_method=S256');
      expect(codeVerifier).toBeTruthy();
      expect(mockCrypto.getRandomValues).toHaveBeenCalled();
      expect(mockSubtle.digest).toHaveBeenCalled();

      // Clean up
      vi.unstubAllGlobals();
    });
  });

  describe('getWebOAuthToken', () => {
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

  describe('getPKCEOAuthToken', () => {
    it('should call APIClient.post with correct parameters', async () => {
      const mockPost = vi
        .fn()
        .mockResolvedValue({ access_token: 'test-token' });
      (APIClient as unknown as vi.Mock).mockImplementation(() => ({
        post: mockPost,
      }));

      await getPKCEOAuthToken({
        ...mockConfig,
        code: 'test-code',
        codeVerifier: 'test-code-verifier',
      });

      expect(APIClient).toHaveBeenCalledWith({
        token: '',
        baseURL: mockConfig.baseURL,
      });
      expect(mockPost).toHaveBeenCalledWith(
        '/api/permission/oauth2/token',
        {
          grant_type: 'authorization_code',
          client_id: mockConfig.clientId,
          redirect_uri: mockConfig.redirectUrl,
          code: 'test-code',
          code_verifier: 'test-code-verifier',
        },
        false,
        undefined,
      );
    });

    it('should handle workspace specific token endpoint', async () => {
      const mockPost = vi
        .fn()
        .mockResolvedValue({ access_token: 'test-token' });
      (APIClient as unknown as vi.Mock).mockImplementation(() => ({
        post: mockPost,
      }));

      await getPKCEOAuthToken({
        ...mockConfig,
        code: 'test-code',
        codeVerifier: 'test-code-verifier',
      });

      expect(mockPost).toHaveBeenCalledWith(
        '/api/permission/oauth2/token',
        {
          grant_type: 'authorization_code',
          client_id: mockConfig.clientId,
          redirect_uri: mockConfig.redirectUrl,
          code: 'test-code',
          code_verifier: 'test-code-verifier',
        },
        false,
        undefined,
      );
    });
  });

  // ... existing code ...

  describe('refreshOAuthToken', () => {
    it('should call APIClient.post with correct parameters when clientSecret is provided', async () => {
      const mockPost = vi
        .fn()
        .mockResolvedValue({ access_token: 'test-token' });
      (APIClient as unknown as vi.Mock).mockImplementation(() => ({
        post: mockPost,
      }));

      await refreshOAuthToken({
        clientId: mockConfig.clientId,
        baseURL: mockConfig.baseURL,
        clientSecret: mockConfig.clientSecret,
        refreshToken: 'test-refresh-token',
      });

      expect(APIClient).toHaveBeenCalledWith({
        token: mockConfig.clientSecret,
        baseURL: mockConfig.baseURL,
      });
      expect(mockPost).toHaveBeenCalledWith(
        '/api/permission/oauth2/token',
        {
          grant_type: 'refresh_token',
          client_id: mockConfig.clientId,
          refresh_token: 'test-refresh-token',
        },
        false,
        undefined,
      );
    });

    it('should call APIClient.post with empty token when clientSecret is not provided', async () => {
      const mockPost = vi
        .fn()
        .mockResolvedValue({ access_token: 'test-token' });
      (APIClient as unknown as vi.Mock).mockImplementation(() => ({
        post: mockPost,
      }));

      await refreshOAuthToken({
        clientId: mockConfig.clientId,
        baseURL: mockConfig.baseURL,
        refreshToken: 'test-refresh-token',
      });

      expect(APIClient).toHaveBeenCalledWith({
        token: '',
        baseURL: mockConfig.baseURL,
      });
      expect(mockPost).toHaveBeenCalledWith(
        '/api/permission/oauth2/token',
        {
          grant_type: 'refresh_token',
          client_id: mockConfig.clientId,
          refresh_token: 'test-refresh-token',
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
    it('should return the correct device code with workspaceId', async () => {
      const mockPost = vi
        .fn()
        .mockResolvedValue({ device_code: 'test-device-code' });
      (APIClient as unknown as vi.Mock).mockImplementation(() => ({
        post: mockPost,
      }));

      await getDeviceCode({
        clientId: mockConfig.clientId,
        baseURL: mockConfig.baseURL,
        workspaceId: '123',
      });

      expect(mockPost).toHaveBeenCalledWith(
        '/api/permission/oauth2/workspace_id/123/device/code',
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
    const mockPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC9QFi6I/l8UZLZ
... (这里省略了中间内容)
xrGqcXz5Qf+wdt0=
-----END PRIVATE KEY-----`;

    beforeEach(() => {
      vi.clearAllMocks();
      // Mock jwt.sign to immediately resolve
      (jwt.sign as vi.Mock).mockImplementation(
        // eslint-disable-next-line max-params
        (payload, privateKey, options, callback) => {
          callback(null, 'mock.jwt.token');
          return undefined;
        },
      );
    });

    it('should call APIClient.post with correct parameters', async () => {
      const mockPost = vi
        .fn()
        .mockResolvedValue({ access_token: 'test-jwt-token' });
      (APIClient as unknown as vi.Mock).mockImplementation(() => ({
        post: mockPost,
      }));

      await getJWTToken({
        appId: 'test-app-id',
        aud: 'test-aud',
        keyid: 'test-key-id',
        privateKey: mockPrivateKey,
        baseURL: mockConfig.baseURL,
        sessionName: 'test-session-name',
      });

      expect(mockPost).toHaveBeenCalledWith(
        '/api/permission/oauth2/token',
        {
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          duration_seconds: 900,
          scope: undefined,
        },
        false,
        undefined,
      );
    });

    it('should call APIClient.post with correct parameters for accountId', async () => {
      const mockPost = vi
        .fn()
        .mockResolvedValue({ access_token: 'test-jwt-token' });
      (APIClient as unknown as vi.Mock).mockImplementation(() => ({
        post: mockPost,
      }));
      await getJWTToken({
        appId: 'test-app-id',
        aud: 'test-aud',
        keyid: 'test-key-id',
        privateKey: mockPrivateKey,
        baseURL: mockConfig.baseURL,
        accountId: '123',
      });

      expect(mockPost).toHaveBeenCalledWith(
        '/api/permission/oauth2/account/123/token',
        {
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          duration_seconds: 900,
          scope: undefined,
        },
        false,
        undefined,
      );
    });

    it('should use default RS256 algorithm if not specified', async () => {
      const mockPost = vi
        .fn()
        .mockResolvedValue({ access_token: 'test-jwt-token' });
      (APIClient as unknown as vi.Mock).mockImplementation(() => ({
        post: mockPost,
      }));

      await getJWTToken({
        appId: 'test-app-id',
        aud: 'test-aud',
        keyid: 'test-key-id',
        privateKey: mockPrivateKey,
        baseURL: mockConfig.baseURL,
      });

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          iss: 'test-app-id',
          aud: 'test-aud',
          iat: expect.any(Number),
          exp: expect.any(Number),
          jti: expect.any(String),
        },
        mockPrivateKey,
        {
          algorithm: 'RS256',
          keyid: 'test-key-id',
        },
        expect.any(Function),
      );
    });

    it('should support custom duration and scope', async () => {
      const mockPost = vi
        .fn()
        .mockResolvedValue({ access_token: 'test-jwt-token' });
      (APIClient as unknown as vi.Mock).mockImplementation(() => ({
        post: mockPost,
      }));

      const customScope = {
        account_permission: {
          permission_list: ['read'],
        },
        attribute_constraint: {
          connector_bot_chat_attribute: {
            bot_id_list: ['bot1'],
          },
        },
      };

      await getJWTToken({
        appId: 'test-app-id',
        aud: 'test-aud',
        keyid: 'test-key-id',
        privateKey: mockPrivateKey,
        baseURL: mockConfig.baseURL,
        durationSeconds: 1800,
        scope: customScope,
      });

      expect(mockPost).toHaveBeenCalledWith(
        '/api/permission/oauth2/token',
        {
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          duration_seconds: 1800,
          scope: customScope,
        },
        false,
        undefined,
      );
    });

    it('should throw an error if invalid private key', async () => {
      await expect(
        getJWTToken({
          appId: 'test-app-id',
          aud: 'test-aud',
          privateKey: 'invalid-private-key',
          baseURL: mockConfig.baseURL,
          keyid: 'test-key-id',
        }),
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw an error when jwt sign failed', async () => {
      (jwt.sign as vi.Mock).mockImplementationOnce(() => {
        throw new Error('jwt sign failed');
      });

      await expect(
        getJWTToken({
          appId: 'test-app-id',
          aud: 'test-aud',
          keyid: 'test-key-id',
          privateKey: mockPrivateKey,
          baseURL: mockConfig.baseURL,
        }),
      ).rejects.toThrow('jwt sign failed');
    });
  });
});
