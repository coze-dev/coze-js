/*
 * How to effectuate OpenAPI authorization through the OAuth Device Code flow.
 *
 * This method is particularly useful for devices that lack a web browser or have limited input capabilities.
 * It allows users to authorize the application on a separate device with a browser.
 *
 * The process involves obtaining a device code, displaying it to the user, and then polling for the access token.
 */

import {
  CozeAPI,
  getDeviceCode,
  getDeviceToken,
  refreshOAuthToken,
} from '@coze/api';

import { streamingChat } from '../utils.js';
import config from '../config/config.js';
import { botId } from '../client.js';

// 'en' for https://api.coze.com, 'zh' for https://api.coze.cn
const key = (process.env.COZE_ENV || 'en') as keyof typeof config;

// Retrieve configuration values from the config file
const clientId = config[key].auth.oauth_device.COZE_CLIENT_ID;
const baseURL = config[key].COZE_BASE_URL;

async function main() {
  // Obtain the device code
  const deviceCode = await getDeviceCode({
    baseURL,
    clientId,
  });
  console.log('deviceCode', deviceCode);

  // Instruct the user to visit the verification URI and enter the user code
  console.log(
    `please open ${deviceCode.verification_uri} and input the code ${deviceCode.user_code}`,
  );

  let deviceToken = await getDeviceToken({
    baseURL,
    clientId,
    deviceCode: deviceCode.device_code,
    poll: true,
  });
  console.log('deviceToken', deviceToken);

  // At this point, you have successfully obtained the access token
  // You can now use it to initialize the Coze API client and make API calls

  // Example of how to initialize the client:
  const client = new CozeAPI({
    baseURL,
    token: async () => {
      // refresh token if expired
      if (deviceToken.expires_in * 1000 > Date.now() + 5000) {
        // 5 seconds buffer
        return deviceToken.access_token;
      }

      console.log('refresh token');
      const refreshTokenResult = await refreshOAuthToken({
        baseURL,
        clientId,
        refreshToken: deviceToken.refresh_token,
      });
      deviceToken = refreshTokenResult;
      return deviceToken.access_token;
    },
  });

  // Example of how to use the client:
  streamingChat({
    client,
    botId,
    query: 'give me a joke',
  });
}

main().catch(console.error);
