import { type JWTToken } from '@coze/api';

const baseServerURL = 'http://localhost:3001';

const useTokenWithJWT = () => {
  const getJWTToken = async () => {
    const res = await fetch(`${baseServerURL}/get_jwt_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error(
        `Failed to get jwt token: ${res.status} ${res.statusText}`,
      );
    }
    const data = await res.json();
    return data.data as JWTToken;
  };

  const getToken = async () => {
    try {
      // 1. get access token from local storage
      const tokenData = JSON.parse(
        localStorage.getItem('jwt_token') || '{}',
      ) as JWTToken;

      if (tokenData.access_token) {
        if (tokenData.expires_in > Date.now() / 1000) {
          // return access token if token not expired
          return tokenData.access_token;
        }
      }

      // 2. get jwt token
      const jwtToken = await getJWTToken();

      // 3. save token to local storage
      localStorage.setItem('jwt_token', JSON.stringify(jwtToken));

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
