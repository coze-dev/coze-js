import { useState } from 'react';

import { message } from 'antd';
import {
  getPKCEOAuthToken,
  refreshOAuthToken,
  type OAuthToken,
} from '@coze/api';

const DEFAULT_OAUTH_CLIENT_ID = '30367348905137699749500653976611.app.coze';

export const useAccessToken = (baseURL: string) => {
  const [accessToken, setAccessToken] = useState<string>('');

  const getCurrentLocation = () =>
    `${window.location.protocol}//${window.location.host}${window.location.pathname}`;

  const setToken = (token: OAuthToken) => {
    localStorage.setItem('accessToken', token.access_token);
    localStorage.setItem('refreshToken', token.refresh_token);
    localStorage.setItem(
      'tokenExpiresAt',
      (token.expires_in * 1000).toString(),
    );
    setAccessToken(token.access_token);
  };
  const getOrRefreshToken = async (
    forceRefreshToken = false,
  ): Promise<string> => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const codeVerifier = localStorage.getItem('pkce_code_verifier');

    const isTokenExpired = (expiresAt: string | null): boolean => {
      if (!expiresAt) {
        return true;
      }
      // Add 5-minute buffer before expiration
      return Date.now() >= parseInt(expiresAt) - 5 * 60 * 1000;
    };

    const isNeedRefreshToken = (): boolean => {
      if (forceRefreshToken) {
        return true;
      }
      // token expired, need refresh token
      if (
        storedRefreshToken &&
        tokenExpiresAt &&
        isTokenExpired(tokenExpiresAt)
      ) {
        console.log('token expired, need refresh token');
        return true;
      }
      if (storedRefreshToken && !storedAccessToken) {
        console.log('no access token, and has refresh token, need refresh');
        return true;
      }
      return false;
    };

    if (code && codeVerifier) {
      // pkce flow
      const token = await exchangeCodeForToken(code, codeVerifier);
      if (token) {
        console.log('pkce flow, set token', token);
        setToken(token);
        return token.access_token;
      }
      console.log('pkce flow failed, no token');
      return '';
    } else if (storedRefreshToken && isNeedRefreshToken()) {
      try {
        const refreshedToken = await refreshOAuthToken({
          baseURL,
          clientId: DEFAULT_OAUTH_CLIENT_ID,
          refreshToken: storedRefreshToken,
          clientSecret: '',
        });

        console.log('refresh token');
        setToken(refreshedToken);
        return refreshedToken.access_token;
      } catch (err) {
        console.error(err);
        message.error(`Failed to refresh token: ${err}`);
        // if contains `BadRequestError`, remove token
        if (`${err}`.includes('BadRequestError')) {
          setToken({
            access_token: '',
            refresh_token: '',
            expires_in: 0,
          });
        }
        console.log('refresh token failed');
        return '';
      }
    } else if (storedAccessToken) {
      console.log('has access token, return access token');
      return storedAccessToken;
    } else {
      console.log('no access token, return empty');
      return '';
    }
  };

  const exchangeCodeForToken = async (
    code: string,
    codeVerifier: string,
  ): Promise<OAuthToken | null> => {
    try {
      const token = await getPKCEOAuthToken({
        code,
        baseURL: localStorage.getItem('baseURL') || 'https://api.coze.cn',
        clientId: DEFAULT_OAUTH_CLIENT_ID,
        redirectUrl: getCurrentLocation(),
        codeVerifier,
      });

      setToken(token);

      window.history.replaceState({}, document.title, window.location.pathname);
      localStorage.removeItem('pkce_code_verifier');

      message.success('Successfully obtained access token');
      return token;
    } catch (error) {
      message.error('Failed to exchange code for token');
      console.error(error);
      return null;
    }
  };

  return {
    accessToken,
    getOrRefreshToken,
    getCurrentLocation,
    setAccessToken,
  };
};
