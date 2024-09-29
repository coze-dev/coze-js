import { Coze } from './api.js';
import { type JWTScope, type OAuthTokenData } from './v2.js';
import { DEFAULT_BASE_URL } from './constant.js';

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
  const api = new Coze({ token: config.clientSecret, endpoint: config.baseURL });
  const result = await api.getOAuthToken({
    grant_type: 'authorization_code',
    client_id: config.clientId,
    redirect_uri: config.redirectUrl,
    code: config.code,
    code_verifier: config.codeVerifier,
  });

  return result;
};

export const getDeviceCode = async (config: { baseURL?: string; clientId: string }) => {
  const api = new Coze({ token: '', endpoint: config.baseURL });
  const result = await api.getDeviceCode({
    client_id: config.clientId,
  });

  return result;
};

export const getDeviceToken = async (config: { baseURL?: string; clientId: string; deviceCode: string }) => {
  const api = new Coze({ token: '', endpoint: config.baseURL });
  const result = await api.getDeviceToken({
    grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    client_id: config.clientId,
    device_code: config.deviceCode,
  });

  return result;
};

export const getJWTToken = async (config: { baseURL?: string; token: string; duration_seconds?: number; scope?: JWTScope }) => {
  const api = new Coze({ token: config.token, endpoint: config.baseURL });
  const result = await api.getJWTToken({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    duration_seconds: config.duration_seconds,
    scope: config.scope,
  });

  return result;
};
