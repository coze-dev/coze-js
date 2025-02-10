import { type DeviceCodeData, type OAuthToken } from '@coze/api';

const baseServerURL = 'http://localhost:3002';
const workspaceId = '7457832409259147264'; // 如果是协作处授权（OBO），需要设置 workspaceId

const useTokenWithDevice = () => {
  const getDeviceCode = async () => {
    const res = await fetch(
      `${baseServerURL}/get_device_code?workspace_id=${workspaceId || ''}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!res.ok) {
      throw new Error(
        `Failed to get device code: ${res.status} ${res.statusText}`,
      );
    }
    const data = await res.json();
    return data.data as DeviceCodeData;
  };

  const getDeviceToken = async (deviceCode: DeviceCodeData) => {
    const res = await fetch(`${baseServerURL}/get_devcie_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ device_code: deviceCode.device_code }),
    });
    if (!res.ok) {
      throw new Error(
        `Failed to get device token: ${res.status} ${res.statusText}`,
      );
    }
    const data = await res.json();
    return data.data as OAuthToken;
  };

  const getRefreshToken = async (refreshToken: string) => {
    const res = await fetch(`${baseServerURL}/refresh_device_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) {
      throw new Error(
        `Failed to refresh device token: ${res.status} ${res.statusText}`,
      );
    }
    const data = await res.json();
    return data.data as OAuthToken;
  };

  const getToken = async () => {
    try {
      // 0. get access token from local storage for the first time
      const tokenData = JSON.parse(
        localStorage.getItem('device_token') || '{}',
      );
      if (tokenData.access_token) {
        if (tokenData.expires_in <= Date.now() / 1000) {
          // refresh token if token expired
          const refreshToken = await getRefreshToken(tokenData.refresh_token);
          localStorage.setItem('device_token', JSON.stringify(refreshToken));
          // return access token
          return refreshToken.access_token;
        }
        // return access token if token not expired
        return tokenData.access_token;
      }

      // 1. get device code
      const deviceCode = await getDeviceCode();

      // 2. open device code verification uri
      window.open(
        `${deviceCode.verification_uri}?user_code=${deviceCode.user_code}`,
        '_blank',
      );

      // 3. poll and get device token
      const deviceToken = await getDeviceToken(deviceCode);

      // 4. save token to local storage
      localStorage.setItem('device_token', JSON.stringify(deviceToken));
      // 5. return access token
      return deviceToken.access_token;
    } catch (error) {
      console.error('Failed to get token with device:', error);
      localStorage.removeItem('device_token');
      throw error;
    }
  };
  return {
    getToken,
  };
};

export { useTokenWithDevice };
