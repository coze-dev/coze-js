import { Modal } from 'antd';
import { type OAuthToken, refreshOAuthToken } from '@coze/api';

import { LocalManager, LocalStorageKey } from './local-manager';
import { DEFAULT_OAUTH_CLIENT_ID } from './constants';

declare global {
  interface Window {
    isConfirming?: boolean;
  }
}

export const getBaseUrl = (): string => {
  const defaultBaseUrl =
    process.env.REACT_APP_BASE_URL || 'https://api.coze.cn';
  return localStorage.getItem('base_url') || defaultBaseUrl;
};

export const getCurrentLocation = () =>
  `${window.location.protocol}//${window.location.host}${window.location.pathname}`;

export const isShowVideo = () => {
  const enableVideo = localStorage.getItem(LocalStorageKey.ENABLE_VIDEO);
  return (
    enableVideo === 'true' && `${process.env.REACT_APP_ENABLE_VIDEO}` === 'true'
  );
};

export const getTokenByCookie = async () => {
  if (location.hostname !== 'www.coze.cn') {
    return null;
  }
  try {
    const result = await fetch(
      'https://www.coze.cn/api/permission_api/coze_web_app/impersonate_coze_user',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: '{}',
      },
    ).then(res => res.json());
    console.log('getTokenByCookie', result);
    return result.data as OAuthToken;
  } catch (e) {
    console.error('getTokenByCookie', e);
  }
  return null;
};

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
    if (window.isConfirming) {
      return;
    }
    window.isConfirming = true;
    let content = 'You need to authenticate to continue';
    if (isTeamWorkspace) {
      content =
        'You need to authenticate to continue, or you can cancel and switch to another workspace';
    }
    Modal.confirm({
      title: 'Please authenticate',
      content,
      onOk: () => {
        resolve(true);
        const url = `${process.env.PUBLIC_URL}/login?state=${
          isTeamWorkspace ? 'workspace' : ''
        }${workspaceId ? `&workspace_id=${workspaceId}` : ''}`;

        window.location.href = url;
        window.isConfirming = false;
      },
      onCancel: () => {
        resolve(false);
        window.isConfirming = false;
      },
    });
  });

export const saveOAuthToken = (
  localManager: LocalManager,
  response: OAuthToken,
) => {
  const expiresAt = response.expires_in * 1000;
  localManager.set(LocalStorageKey.ACCESS_TOKEN, response.access_token);
  localManager.set(
    LocalStorageKey.REFRESH_TOKEN,
    response.refresh_token || 'cookie_token',
  );
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

    if (Date.now() > expiresAt || !accessToken) {
      // refresh token
      let response;
      if (refreshToken === 'cookie_token') {
        response = await getTokenByCookie();
      }
      if (!response) {
        response = await refreshOAuthToken({
          baseURL: baseUrl,
          clientId: DEFAULT_OAUTH_CLIENT_ID,
          refreshToken,
          clientSecret: '',
        });
      }

      console.log('refresh token', response);
      saveOAuthToken(localManager, response);

      return response.access_token;
    }
  } else {
    const result = await getTokenByCookie();
    if (result) {
      saveOAuthToken(localManager, result);
      return result.access_token;
    }
  }

  if (accessToken) {
    return accessToken;
  } else {
    return '';
  }
};

export const isTeamWorkspace = (workspaceId?: string) => {
  const localManager = new LocalManager();
  const refreshToken = localManager.get(LocalStorageKey.REFRESH_TOKEN);
  if (refreshToken === 'cookie_token') {
    return false;
  }

  const id = workspaceId || localStorage.getItem(LocalStorageKey.WORKSPACE_ID);
  return id?.startsWith('team_');
};

export const getTranslateConfig = () => {
  const localManager = new LocalManager();
  const translateConfig = localManager.get(LocalStorageKey.TRANSLATE_CONFIG);
  if (!translateConfig) {
    return {
      from: 'zh',
      to: 'en',
    };
  }
  const arr = translateConfig.split('-');
  return {
    from: arr[0],
    to: arr[1],
  };
};
