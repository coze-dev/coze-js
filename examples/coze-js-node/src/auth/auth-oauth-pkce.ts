/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * How to effectuate OpenAPI authorization through the OAuth PKCE (Proof Key for Code Exchange) method.
 *
 * Firstly, users need to access https://www.coze.com/open/oauth/apps. For the cn environment,
 * users need to access https://www.coze.cn/open/oauth/apps to create an OAuth App of the type
 * of Web application.
 *
 * The specific creation process can be referred to in the document:
 * https://www.coze.com/docs/developer_guides/oauth_code. For the cn environment, it can be
 * accessed at https://www.coze.cn/docs/developer_guides/oauth_code.
 *
 * After the creation is completed, the client ID and redirect link can be obtained.
 * Note that PKCE does not require a client secret, enhancing security for public clients.
 */

import {
  CozeAPI,
  getPKCEAuthenticationUrl,
  getPKCEOAuthToken,
  refreshOAuthToken,
} from '@coze/api';

import config from '../config/config';

// 'en' for https://api.coze.com, 'zh' for https://api.coze.cn
const key = process.env.COZE_ENV || 'en';

const clientId = config[key].auth.oauth_pkce.COZE_CLIENT_ID;
const redirectUrl = config[key].auth.oauth_pkce.COZE_REDIRECT_URL;
const baseURL = config[key].COZE_BASE_URL;

// Generate the PKCE authentication URL and code verifier
const { url, codeVerifier } = await getPKCEAuthenticationUrl({
  clientId,
  redirectUrl,
  baseURL,
  state: '123', // Set a state parameter for user data
});

console.log(
  `please open ${url} and authorize and then get the code from the redirect url`,
);

import readline from 'readline';

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
const code = await getCodeFromUser();
console.log('Received code:', code);

// Exchange the authorization code for an OAuth token using PKCE
const oauthToken = await getPKCEOAuthToken({
  clientId,
  redirectUrl,
  baseURL,
  code,
  codeVerifier,
});

console.log('getPKCEOAuthToken', oauthToken);

// Initialize a new Coze API client using the obtained access token

const client = new CozeAPI({
  baseURL,
  token: oauthToken.access_token,
});

// Example of how to use the client (commented out)
// e.g. client.chat.stream(...);

// Refresh the OAuth token using the refresh token obtained earlier
const refreshedOAuthToken = await refreshOAuthToken({
  clientId,
  refreshToken: oauthToken.refresh_token,
  baseURL,
});

console.log('refreshOAuthToken', refreshedOAuthToken);
