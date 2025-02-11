import { type OAuthToken } from '@coze/api';

const baseServerURL = 'http://localhost:3003';
const redirectUrl = window.location.origin;
const workspaceId = ''; // 如果是协作处授权（OBO），需要设置 workspaceId

const useTokenWithPKCE = () => {
  const getPkceToken = async (code: string) => {
    const res = await fetch(`${baseServerURL}/get_pkce_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        code,
        redirect_url: redirectUrl,
      }),
    });
    if (!res.ok) {
      throw new Error(
        `Failed to get pkce token: ${res.status} ${res.statusText}`,
      );
    }
    const data = await res.json();
    return data.data as OAuthToken;
  };

  const getRefreshToken = async (refreshToken: string) => {
    const res = await fetch(`${baseServerURL}/refresh_pkce_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) {
      throw new Error(
        `Failed to refresh pkce token: ${res.status} ${res.statusText}`,
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

      // 2. get pkce token if code exists
      if (code) {
        const pkceToken = await getPkceToken(code);
        localStorage.setItem('pkce_token', JSON.stringify(pkceToken));

        // remove code from url
        window.history.replaceState({}, '', window.location.pathname);
        return pkceToken.access_token;
      }

      // 3. get access token from local storage
      const tokenData = JSON.parse(
        localStorage.getItem('pkce_token') || '{}',
      ) as OAuthToken;
      if (tokenData.access_token) {
        if (tokenData.expires_in <= Date.now() / 1000) {
          // refresh token if token expired
          const refreshToken = await getRefreshToken(tokenData.refresh_token);
          localStorage.setItem('pkce_token', JSON.stringify(refreshToken));
          // return access token
          return refreshToken.access_token;
        }
        // return access token if token not expired
        return tokenData.access_token;
      }

      // 4. else redirect to pkce login
      window.location.href = `${baseServerURL}/pkce_login?redirect_url=${redirectUrl}&workspace_id=${workspaceId || ''}`;

      return '';
    } catch (error) {
      console.error('Failed to get token with pkce:', error);
      localStorage.removeItem('pkce_token');
      throw error;
    }
  };
  return {
    getToken,
  };
};

export { useTokenWithPKCE };
