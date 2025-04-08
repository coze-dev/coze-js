import { type OAuthToken } from '@coze/api';

const baseServerURL = 'http://localhost:3004';
const redirectUrl = window.location.origin;
const workspaceId = ''; // 如果是协作处授权（OBO），需要设置 workspaceId

const useTokenWithWeb = () => {
  const getWebToken = async (code: string) => {
    const res = await fetch(`${baseServerURL}/get_web_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, redirect_url: redirectUrl }),
    });
    if (!res.ok) {
      throw new Error(
        `Failed to get web token: ${res.status} ${res.statusText}`,
      );
    }
    const data = await res.json();
    return data.data as OAuthToken;
  };

  const getRefreshToken = async (refreshToken: string) => {
    const res = await fetch(`${baseServerURL}/refresh_web_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) {
      throw new Error(
        `Failed to refresh web token: ${res.status} ${res.statusText}`,
      );
    }
    const data = await res.json();
    return data.data as OAuthToken;
  };

  const getToken = async () => {
    try {
      // 1. get code from url
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      // 2. get web token if code exists
      if (code) {
        const webToken = await getWebToken(code);
        localStorage.setItem('web_token', JSON.stringify(webToken));

        // remove code from url
        window.history.replaceState({}, '', window.location.pathname);
        // return web token
        return webToken.access_token;
      }

      // 3. get access token from local storage
      const tokenData = JSON.parse(
        localStorage.getItem('web_token') || '{}',
      ) as OAuthToken;
      if (tokenData.access_token) {
        if (tokenData.expires_in <= Date.now() / 1000) {
          // refresh token if token expired
          const refreshToken = await getRefreshToken(tokenData.refresh_token);
          localStorage.setItem('web_token', JSON.stringify(refreshToken));
          // return access token
          return refreshToken.access_token;
        }
        // return access token if token not expired
        return tokenData.access_token;
      }

      // 4. else redirect to web login
      window.location.href = `${baseServerURL}/web_login?redirect_url=${redirectUrl}&workspace_id=${workspaceId || ''}`;

      return '';
    } catch (error) {
      console.error('Failed to get token with web:', error);
      localStorage.removeItem('web_token');
      throw error;
    }
  };
  return {
    getToken,
  };
};

export { useTokenWithWeb };
