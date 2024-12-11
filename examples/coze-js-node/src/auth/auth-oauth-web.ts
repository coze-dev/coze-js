/*
 * How to effectuate OpenAPI authorization through the OAuth authorization code method.
 *
 * Firstly, users need to access https://www.coze.com/open/oauth/apps. For the cn environment,
 * users need to access https://www.coze.cn/open/oauth/apps to create an OAuth App of the type
 * of Web application.
 *
 * The specific creation process can be referred to in the document:
 * https://www.coze.com/docs/developer_guides/oauth_code. For the cn environment, it can be
 * accessed at https://www.coze.cn/docs/developer_guides/oauth_code.
 *
 * After the creation is completed, the client ID, client secret, and redirect link, can be
 * obtained. For the client secret, users need to keep it securely to avoid leakage.
 */

import {
  CozeAPI,
  getWebAuthenticationUrl,
  getWebOAuthToken,
  refreshOAuthToken,
} from '@coze/api';

import config from '../config/config.js';

// 'en' for https://api.coze.com, 'zh' for https://api.coze.cn
const key = (process.env.COZE_ENV || 'en') as keyof typeof config;

const clientId = config[key].auth.oauth_web.COZE_CLIENT_ID;
const clientSecret = config[key].auth.oauth_web.COZE_CLIENT_SECRET;
const redirectUrl = config[key].auth.oauth_web.COZE_REDIRECT_URL;
const baseURL = config[key].COZE_BASE_URL;

// Generate the authentication URL using the provided parameters
const authUrl = getWebAuthenticationUrl({
  clientId,
  redirectUrl,
  baseURL,
  state: '123', // Set a state parameter for user data
});

console.log(
  `please open ${authUrl} and authorize and then get the code from the redirect url`,
);

import readline from 'readline';

import { streamingChat } from '../utils.js';
import { botId } from '../client.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to get the authorization code from user input
const getCodeFromUser = () =>
  new Promise(resolve => {
    rl.question('Please enter the code from the redirect URL: ', code => {
      rl.close();
      resolve(code.trim());
    });
  });

// Get the authorization code from user input
const code = (await getCodeFromUser()) as string;
console.log('Received code:', code);

// Exchange the authorization code for an OAuth token
let oauthToken = await getWebOAuthToken({
  clientId,
  clientSecret,
  redirectUrl,
  baseURL,
  code,
});

console.log('getOAuthToken', oauthToken);

// Initialize a new Coze API client using the obtained access token

const client = new CozeAPI({
  baseURL,
  token: async () => {
    // refresh token if expired
    if (oauthToken.expires_in * 1000 > Date.now() + 5000) {
      return oauthToken.access_token;
    }
    console.log('refresh token');
    const refreshTokenResult = await refreshOAuthToken({
      clientId,
      refreshToken: oauthToken.refresh_token,
      baseURL,
    });
    oauthToken = refreshTokenResult;
    return oauthToken.access_token;
  },
});

// Example of how to use the client (commented out)
// e.g. client.chat.stream(...);
streamingChat({
  client,
  botId,
  query: 'give me a joke',
});
