/*
 * How to effectuate OpenAPI authorization through the OAuth Device Code flow.
 *
 * This method is particularly useful for devices that lack a web browser or have limited input capabilities.
 * It allows users to authorize the application on a separate device with a browser.
 *
 * The process involves obtaining a device code, displaying it to the user, and then polling for the access token.
 */

import { APIError, getDeviceCode, getDeviceToken } from '@coze/api';

import config from '../config/config.js';
import { sleep } from '../client.js';

// 'en' for https://api.coze.com, 'zh' for https://api.coze.cn
const key = process.env.COZE_ENV || 'en';

// Retrieve configuration values from the config file
const clientId = config[key].auth.oauth_device.COZE_CLIENT_ID;
const baseURL = config[key].COZE_BASE_URL;

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

// Start the polling process to obtain the access token
while (true) {
  // Wait for 5 seconds before polling again
  await sleep(5000);

  try {
    // Attempt to get the device token
    const deviceToken = await getDeviceToken({
      baseURL,
      clientId,
      deviceCode: deviceCode.device_code,
    });

    // If successful, log the token and exit the loop
    if (deviceToken.access_token) {
      console.log('deviceToken', deviceToken);
      break;
    }
  } catch (error) {
    if (error instanceof APIError) {
      console.log(
        'rawError',
        `error:${error.rawError.error}`,
        `error_description:${error.rawError.error_message}`,
      );
      // If the error is a 428 (authorization pending), continue polling
      if (error.status === 428) {
        continue;
      }
    }
    // For any other error, throw it
    throw error;
  }
}

// At this point, you have successfully obtained the access token
// You can now use it to initialize the Coze API client and make API calls

// Example of how to initialize the client (commented out):
// const client = new CozeAPI({ baseURL, token: deviceToken.access_token });

// Example of how to use the client (commented out):
// const data = await client.chat.create({...});
// console.log('client.chat.create', data);
