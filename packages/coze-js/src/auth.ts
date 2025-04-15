import * as nodeCrypto from 'crypto';

import jwt from 'jsonwebtoken';

import { isBrowser, isUniApp, sleep } from './utils';
import { APIError } from './error';
import { APIClient, type RequestOptions } from './core';
import {
  COZE_COM_BASE_URL,
  MAX_POLL_INTERVAL,
  POLL_INTERVAL,
} from './constant';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const uni: any;

const getCrypto = () => {
  if (isUniApp()) {
    return {
      getRandomValues: uni.getRandomValues,
      subtle: {
        // TODO Currently not supporting uniapp, will provide support later if needed
        digest: () => {
          console.error('digest is not supported in uniapp');
          throw new Error('digest is not supported in uniapp');
        },
      },
    };
  }
  if (isBrowser()) {
    return window.crypto;
  }

  // #ifndef MP
  return {
    getRandomValues: (array: Uint8Array) => nodeCrypto.randomFillSync(array),
    subtle: nodeCrypto.subtle,
  };
  // #endif
};

const generateRandomString = () => {
  const array = new Uint8Array(32);
  getCrypto().getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const getWebAuthenticationUrl = (config: WebAuthenticationConfig) => {
  const baseUrl = (config.baseURL ?? COZE_COM_BASE_URL).replace(
    'https://api',
    'https://www',
  );
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUrl,
    state: config.state ?? '',
  });
  if (config.workspaceId) {
    return `${baseUrl}/api/permission/oauth2/workspace_id/${config.workspaceId}/authorize?${params.toString()}`;
  }
  return `${baseUrl}/api/permission/oauth2/authorize?${params.toString()}`;
};

export const getPKCEAuthenticationUrl = async (
  config: PKCEAuthenticationConfig,
) => {
  const baseUrl = (config.baseURL ?? COZE_COM_BASE_URL).replace(
    'https://api',
    'https://www',
  );
  const crypto = getCrypto();

  // Generate code_challenge from code_verifier
  const generateCodeChallenge = async (codeVerifier: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  // Generate a random code_verifier
  const codeVerifier = generateRandomString();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUrl,
    state: config.state ?? '',
    code_challenge: codeChallenge,
    code_challenge_method: config.code_challenge_method || 'S256',
  });
  if (config.workspaceId) {
    return {
      url: `${baseUrl}/api/permission/oauth2/workspace_id/${config.workspaceId}/authorize?${params.toString()}`,
      codeVerifier,
    };
  }
  return {
    url: `${baseUrl}/api/permission/oauth2/authorize?${params.toString()}`,
    codeVerifier,
  };
};

export const getWebOAuthToken = async (
  config: WebOAuthTokenConfig,
  options?: RequestOptions,
): Promise<OAuthToken> => {
  const api = new APIClient({
    token: config.clientSecret,
    baseURL: config.baseURL,
  });
  const apiUrl = '/api/permission/oauth2/token';
  const payload = {
    grant_type: 'authorization_code',
    client_id: config.clientId,
    redirect_uri: config.redirectUrl,
    code: config.code,
  };
  const result = await api.post<unknown, OAuthToken>(
    apiUrl,
    payload,
    false,
    options,
  );

  return result;
};

export const getPKCEOAuthToken = async (
  config: PKCEOAuthTokenConfig,
  options?: RequestOptions,
): Promise<OAuthToken> => {
  const api = new APIClient({ token: '', baseURL: config.baseURL });
  const apiUrl = '/api/permission/oauth2/token';
  const payload = {
    grant_type: 'authorization_code',
    client_id: config.clientId,
    redirect_uri: config.redirectUrl,
    code: config.code,
    code_verifier: config.codeVerifier,
  };
  const result = await api.post<unknown, OAuthToken>(
    apiUrl,
    payload,
    false,
    options,
  );

  return result;
};

export const refreshOAuthToken = async (
  config: RefreshOAuthTokenConfig,
  options?: RequestOptions,
): Promise<OAuthToken> => {
  const api = new APIClient({
    token: config.clientSecret || '',
    baseURL: config.baseURL,
  });
  const apiUrl = '/api/permission/oauth2/token';
  const payload = {
    grant_type: 'refresh_token',
    client_id: config.clientId,
    refresh_token: config.refreshToken,
  };
  const result = await api.post<unknown, OAuthToken>(
    apiUrl,
    payload,
    false,
    options,
  );

  return result;
};

export const getDeviceCode = async (
  config: DeviceCodeConfig,
  options?: RequestOptions,
) => {
  if (isBrowser()) {
    throw new Error('getDeviceCode is not supported in browser');
  }
  const api = new APIClient({ token: '', baseURL: config.baseURL });

  let apiUrl;
  if (config.workspaceId) {
    apiUrl = `/api/permission/oauth2/workspace_id/${config.workspaceId}/device/code`;
  } else {
    apiUrl = '/api/permission/oauth2/device/code';
  }
  const payload = {
    client_id: config.clientId,
  };

  const result = await api.post<unknown, DeviceCodeData>(
    apiUrl,
    payload,
    false,
    options,
  );
  return result;
};

const _getDeviceToken = async (
  config: DeviceTokenConfig,
  options?: RequestOptions,
): Promise<OAuthToken> => {
  const api = new APIClient({ token: '', baseURL: config.baseURL });

  const apiUrl = '/api/permission/oauth2/token';
  const payload = {
    grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    client_id: config.clientId,
    device_code: config.deviceCode,
  };

  const result = await api.post<unknown, DeviceTokenData>(
    apiUrl,
    payload,
    false,
    options,
  );

  return result;
};

export const getDeviceToken = async (
  config: DeviceTokenConfig,
  options?: RequestOptions,
): Promise<OAuthToken> => {
  if (isBrowser()) {
    throw new Error('getDeviceToken is not supported in browser');
  }

  if (!config.poll) {
    return _getDeviceToken(config, options);
  }

  let interval = POLL_INTERVAL;
  while (true) {
    try {
      // Attempt to get the device token
      const deviceToken = await _getDeviceToken(config, options);
      return deviceToken;
    } catch (error) {
      if (error instanceof APIError) {
        // If the error is authorization_pending, continue polling
        if (
          error?.rawError?.error === PKCEAuthErrorType.AUTHORIZATION_PENDING
        ) {
          await sleep(interval);
          continue;
          // If the error is slow_down, increase the interval
        } else if (error?.rawError?.error === PKCEAuthErrorType.SLOW_DOWN) {
          if (interval < MAX_POLL_INTERVAL) {
            interval += POLL_INTERVAL;
          }
          await sleep(interval);
          continue;
        }
      }
      // For any other error, throw it
      throw error;
    }
  }
};

export const _getJWTToken = async (
  config: {
    token: string;
    baseURL?: string;
    durationSeconds?: number;
    scope?: JWTScope;
    accountId?: string;
  },
  options?: RequestOptions,
) => {
  const api = new APIClient({ token: config.token, baseURL: config.baseURL });

  let apiUrl;
  if (config.accountId) {
    apiUrl = `/api/permission/oauth2/account/${config.accountId}/token`;
  } else {
    apiUrl = '/api/permission/oauth2/token';
  }
  const payload = {
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    duration_seconds: config.durationSeconds ?? 900, // 15 minutes
    scope: config.scope,
  };

  const result = await api.post<unknown, JWTToken>(
    apiUrl,
    payload,
    false,
    options,
  );

  return result;
};

export const getJWTToken = async (
  config: JWTTokenConfig,
  options?: RequestOptions,
): Promise<JWTToken> => {
  if (isBrowser()) {
    throw new Error('getJWTToken is not supported in browser');
  }

  // Validate private key format
  const keyFormat = config.privateKey.includes('BEGIN RSA PRIVATE KEY')
    ? 'RSA'
    : config.privateKey.includes('BEGIN PRIVATE KEY')
      ? 'PKCS8'
      : null;
  if (!keyFormat) {
    throw APIError.generate(
      400,
      undefined,
      'Invalid private key format. Expected PEM format (RSA or PKCS8)',
      undefined,
    );
  }

  // Prepare the payload for the JWT
  const now = Math.floor(Date.now() / 1000);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: Record<string, any> = {
    iss: config.appId,
    aud: config.aud,
    iat: now,
    exp: now + 3600, // 1 hour
    jti: generateRandomString(),
  };

  if (config.sessionName) {
    payload.session_name = config.sessionName;
  }

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      config.privateKey,
      { algorithm: config.algorithm ?? 'RS256', keyid: config.keyid },
      async (err: Error | null, token: string | undefined) => {
        if (err || !token) {
          reject(err);
          return;
        }
        // Exchange the JWT for an OAuth token
        try {
          const result = await _getJWTToken(
            {
              ...config,
              token,
            },
            options,
          );
          resolve(result);
        } catch (err2) {
          reject(err2);
        }
      },
    );
  });
};

export interface DeviceCodeData {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

export interface OAuthToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface DeviceTokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  error?: string;
  error_description?: string;
}

export interface JWTToken {
  access_token: string;
  expires_in: number;
}

export interface JWTScope {
  account_permission: {
    permission_list: string[];
  };
  attribute_constraint: {
    connector_bot_chat_attribute: {
      bot_id_list: string[];
    };
  };
}

export interface WebAuthenticationConfig {
  baseURL?: string;
  clientId: string;
  redirectUrl: string;
  state?: string;
  workspaceId?: string;
}

export interface PKCEAuthenticationConfig extends WebAuthenticationConfig {
  code_challenge_method?: string;
  workspaceId?: string;
}

export interface WebOAuthTokenConfig {
  code: string;
  baseURL?: string;
  clientId: string;
  redirectUrl: string;
  clientSecret: string;
}

export interface PKCEOAuthTokenConfig {
  code: string;
  baseURL?: string;
  clientId: string;
  redirectUrl: string;
  codeVerifier: string;
}

export interface RefreshOAuthTokenConfig {
  refreshToken: string;
  baseURL?: string;
  clientId: string;
  clientSecret?: string;
}

export interface DeviceCodeConfig {
  baseURL?: string;
  clientId: string;
  workspaceId?: string;
}

export interface DeviceTokenConfig {
  baseURL?: string;
  clientId: string;
  deviceCode: string;
  poll?: boolean;
}

export interface JWTTokenConfig {
  baseURL?: string;
  durationSeconds?: number;
  appId: string;
  aud: string;
  keyid: string;
  privateKey: string;
  algorithm?: jwt.Algorithm;
  scope?: JWTScope;
  /**Isolate different sub-resources under the same jwt account */
  sessionName?: string;
  accountId?: string; // Same as  user id
}

export enum PKCEAuthErrorType {
  AUTHORIZATION_PENDING = 'authorization_pending',
  SLOW_DOWN = 'slow_down',
  ACCESS_DENIED = 'access_denied',
  EXPIRED_TOKEN = 'expired_token',
}
