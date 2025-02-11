import { type JWTToken } from '@coze/api';

const useTokenWithJWT = () => {
  const baseServerURL =
    localStorage.getItem('base_server_url') || 'http://localhost:8080';
  const getJWTToken = async () => {
    const res = await fetch(`${baseServerURL}/callback`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    if (!res.ok) {
      throw new Error(
        `Failed to get jwt token: ${res.status} ${res.statusText}`,
      );
    }
    const data = await res.json();
    return data as JWTToken;
  };

  const getToken = async () => {
    try {
      // 1. get access token from local storage
      const tokenData = JSON.parse(
        localStorage.getItem('jwt_token') || '{}',
      ) as JWTToken;
      if (tokenData.access_token) {
        const expiresIn = Number(
          (tokenData.expires_in as unknown as string).split(' ')[0],
        );
        if (expiresIn > Date.now() / 1000) {
          // return access token if token not expired
          localStorage.setItem('access_token', tokenData.access_token);
          return tokenData.access_token;
        }
      }

      // 2. get jwt token
      const jwtToken = await getJWTToken();

      // 3. save token to local storage
      localStorage.setItem('jwt_token', JSON.stringify(jwtToken));
      localStorage.setItem('access_token', jwtToken.access_token);

      // 4. return access token
      return jwtToken.access_token;
    } catch (error) {
      console.error('Failed to get token with jwt:', error);
      localStorage.removeItem('jwt_token');
      throw error;
    }
  };
  return {
    getToken,
  };
};

export { useTokenWithJWT };
