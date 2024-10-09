import { DEFAULT_BASE_URL } from './constant.js';
import { APIClient } from './core.js';
import { crypto } from './shims/index.js';

export const getAuthenticationUrl = (config: { baseURL?: string; clientId: string; redirectUrl: string; state?: string }) => {
  const baseUrl = (config.baseURL ?? DEFAULT_BASE_URL).replace('https://api', 'https://www');
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUrl,
    state: config.state ?? '',
  });
  return `${baseUrl}/api/permission/oauth2/authorize?${params.toString()}`;
};

export const getPKCEAuthenticationUrl = async (config: { baseURL?: string; clientId: string; redirectUrl: string; state?: string }) => {
  const baseUrl = (config.baseURL ?? DEFAULT_BASE_URL).replace('https://api', 'https://www');

  // Generate a random code_verifier
  const generateCodeVerifier = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

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

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUrl,
    state: config.state ?? '',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });
  return { url: `${baseUrl}/api/permission/oauth2/authorize?${params.toString()}`, codeVerifier };
};

export const getOAuthToken = async (config: {
  code: string;
  baseURL?: string;
  clientId: string;
  redirectUrl: string;
  clientSecret: string;
  codeVerifier?: string; // only for PKCE
}): Promise<OAuthTokenData> => {
  const api = new APIClient({ token: config.clientSecret, baseURL: config.baseURL });
  const apiUrl = `/api/permission/oauth2/token`;
  const payload = {
    grant_type: 'authorization_code',
    client_id: config.clientId,
    redirect_uri: config.redirectUrl,
    code: config.code,
    code_verifier: config.codeVerifier,
  };
  const result = await api.post<unknown, OAuthTokenData>(apiUrl, payload);

  return result;
};

export const getDeviceCode = async (config: { baseURL?: string; clientId: string }) => {
  const api = new APIClient({ token: '', baseURL: config.baseURL });

  const apiUrl = `/api/permission/oauth2/device/code`;
  const payload = {
    client_id: config.clientId,
  };

  const result = await api.post<unknown, DeviceCodeData>(apiUrl, payload);
  return result;
};

export const getDeviceToken = async (config: { baseURL?: string; clientId: string; deviceCode: string }) => {
  const api = new APIClient({ token: '', baseURL: config.baseURL });

  const apiUrl = `/api/permission/oauth2/token`;
  const payload = {
    grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    client_id: config.clientId,
    device_code: config.deviceCode,
  };

  const result = await api.post<unknown, DeviceTokenData>(apiUrl, payload);

  return result;
};

export const getJWTToken = async (config: { baseURL?: string; token: string; duration_seconds?: number; scope?: JWTScope }) => {
  const api = new APIClient({ token: config.token, baseURL: config.baseURL });

  const apiUrl = `/api/permission/oauth2/token`;
  const payload = {
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    duration_seconds: config.duration_seconds,
    scope: config.scope,
  };

  const result = await api.post<unknown, JWTTokenData>(apiUrl, payload);

  return result;
};

export interface DeviceCodeData {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

export interface OAuthTokenData {
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

export interface JWTTokenData {
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
