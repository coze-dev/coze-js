import { Modal } from 'antd';
import { type OAuthToken, refreshOAuthToken } from '@coze/api';

import { type LocalManager, LocalStorageKey } from './local-manager';
import { DEFAULT_OAUTH_CLIENT_ID } from './constants';

export const getBaseUrl = (): string => {
  const defaultBaseUrl =
    process.env.REACT_APP_BASE_URL || 'https://api.coze.cn';
  return localStorage.getItem('base_url') || defaultBaseUrl;
};

export const getCurrentLocation = () =>
  `${window.location.protocol}//${window.location.host}${window.location.pathname}`;

export const isShowVideo = `${process.env.REACT_APP_ENABLE_VIDEO}` === 'true';

export const redirectToLogin = (
  isTeamWorkspace?: boolean,
  workspaceId?: string,
  showConfirm = true,
) =>
  new Promise<boolean>(resolve => {
    if (!showConfirm) {
      resolve(true);
      window.location.href = `${process.env.PUBLIC_URL}/login?state=${
        isTeamWorkspace ? 'workspace' : ''
      }${workspaceId ? `&workspace_id=${workspaceId}` : ''}`;
      return;
    }
    Modal.confirm({
      title: 'Please authenticate',
      content: 'You need to authenticate to continue',
      onOk: () => {
        resolve(true);
        window.location.href = `${process.env.PUBLIC_URL}/login?state=${
          isTeamWorkspace ? 'workspace' : ''
        }${workspaceId ? `&workspace_id=${workspaceId}` : ''}`;
      },
      onCancel: () => {
        resolve(false);
      },
    });
  });

export const saveOAuthToken = (
  localManager: LocalManager,
  response: OAuthToken,
) => {
  const expiresAt = response.expires_in * 1000;
  localManager.set(LocalStorageKey.ACCESS_TOKEN, response.access_token);
  localManager.set(LocalStorageKey.REFRESH_TOKEN, response.refresh_token);
  localManager.set(LocalStorageKey.TOKEN_EXPIRES_AT, expiresAt.toString());
};

export const getOrRefreshToken = async (localManager: LocalManager) => {
  const baseUrl = getBaseUrl();

  const accessToken = localManager.get(LocalStorageKey.ACCESS_TOKEN);
  const refreshToken = localManager.get(LocalStorageKey.REFRESH_TOKEN);

  if (refreshToken) {
    const expiresAt = Number(
      localManager.get(LocalStorageKey.TOKEN_EXPIRES_AT) || '0',
    );

    if (Date.now() > expiresAt) {
      // refresh token
      const response = await refreshOAuthToken({
        baseURL: baseUrl,
        clientId: DEFAULT_OAUTH_CLIENT_ID,
        refreshToken,
        clientSecret: '',
      });

      console.log('refresh token', response);
      saveOAuthToken(localManager, response);

      return response.access_token;
    }
  }

  if (accessToken) {
    return accessToken;
  } else {
    return '';
  }
};

export const isTeamWorkspace = () => {
  const workspaceId = localStorage.getItem(LocalStorageKey.WORKSPACE_ID);
  return workspaceId?.startsWith('team_');
};
