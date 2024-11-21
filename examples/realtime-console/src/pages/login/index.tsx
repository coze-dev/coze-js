import { useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';

import {
  getPKCEAuthenticationUrl,
  getPKCEOAuthToken,
  refreshOAuthToken,
} from '@coze/api';

import {
  getBaseUrl,
  getCurrentLocation,
  saveOAuthToken,
} from '../../utils/utils';
import { LocalManager, LocalStorageKey } from '../../utils/local-manager';
import { DEFAULT_OAUTH_CLIENT_ID } from '../../utils/constants';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isTeamWorkspace = searchParams.get('state') === 'workspace';

  const localManager = new LocalManager(
    isTeamWorkspace ? LocalStorageKey.WORKSPACE_PREFIX : '',
  );

  const handleAuth = async () => {
    const code = searchParams.get('code');
    const baseUrl = getBaseUrl();
    if (code) {
      const codeVerifier = localManager.get(LocalStorageKey.PKCE_CODE_VERIFIER);
      if (!codeVerifier) {
        initiatePKCEFlow();
        return;
      }

      try {
        const response = await getPKCEOAuthToken({
          code,
          baseURL: getBaseUrl(),
          clientId: DEFAULT_OAUTH_CLIENT_ID,
          redirectUrl: getCurrentLocation(),
          codeVerifier,
        });
        saveOAuthToken(localManager, response);
        localManager.remove(LocalStorageKey.PKCE_CODE_VERIFIER);
        navigate('/');
      } catch (error) {
        console.error('Token exchange failed:', error);
        initiatePKCEFlow();
      }
      return;
    }

    const accessToken = localManager.get(LocalStorageKey.ACCESS_TOKEN);
    const refreshToken = localManager.get(LocalStorageKey.REFRESH_TOKEN);
    if (accessToken || refreshToken) {
      const expiresAt = Number(
        localManager.get(LocalStorageKey.TOKEN_EXPIRES_AT) || '0',
      );

      if (Date.now() <= expiresAt - 5 * 60 * 1000 && accessToken) {
        navigate('/');
        return;
      }

      try {
        if (refreshToken) {
          const response = await refreshOAuthToken({
            baseURL: baseUrl,
            clientId: DEFAULT_OAUTH_CLIENT_ID,
            refreshToken,
            clientSecret: '',
          });
          saveOAuthToken(localManager, response);
          navigate('/');
          return;
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    }

    initiatePKCEFlow();
  };

  const initiatePKCEFlow = async () => {
    const baseUrl = getBaseUrl();
    try {
      const { url, codeVerifier } = await getPKCEAuthenticationUrl({
        baseURL: baseUrl,
        clientId: DEFAULT_OAUTH_CLIENT_ID,
        redirectUrl: getCurrentLocation(),
        workspaceId:
          searchParams.get(LocalStorageKey.WORKSPACE_ID) || undefined,
        state: searchParams.get('state') === 'workspace' ? 'workspace' : '',
      });
      localManager.set(LocalStorageKey.PKCE_CODE_VERIFIER, codeVerifier);

      console.log('redirecting to', url);

      window.location.href = url;
    } catch (error) {
      console.error('Failed to initiate PKCE flow:', error);
    }
  };

  useEffect(() => {
    handleAuth();
  }, []);

  return (
    <div>
      <h1></h1>
    </div>
  );
};

export default Login;
