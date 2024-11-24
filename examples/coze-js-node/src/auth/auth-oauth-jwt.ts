/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/*
 * How to effectuate OpenAPI authorization through the OAuth JWT (JSON Web Token) method.
 *
 * Firstly, users need to access https://www.coze.com/open/oauth/apps. For the cn environment,
 * users need to access https://www.coze.cn/open/oauth/apps to create an OAuth App of the type
 * of JWT application.
 *
 * The specific creation process can be referred to in the document:
 * https://www.coze.com/docs/developer_guides/oauth_jwt. For the cn environment, it can be
 * accessed at https://www.coze.cn/docs/developer_guides/oauth_jwt.
 *
 * After the creation is completed, the app ID, key ID, and audience can be obtained.
 * Users also need to generate a private key and upload the corresponding public key to Coze.
 */

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import fs from 'fs';

import { CozeAPI, getJWTToken } from '@coze/api';

import config from '../config/config';

// 'en' for https://api.coze.com, 'cn' for https://api.coze.cn
const key = process.env.COZE_ENV || 'en';

// Retrieve configuration values from the config file
const baseURL = config[key].COZE_BASE_URL;
const appId = config[key].auth.oauth_jwt.COZE_APP_ID;
const keyid = config[key].auth.oauth_jwt.COZE_KEY_ID;
const aud = config[key].auth.oauth_jwt.COZE_AUD;

// Read the private key from a file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const privateKey = fs
  .readFileSync(join(__dirname, '../../tmp/private_key.pem'))
  .toString();

const result = await getJWTToken({
  baseURL,
  appId,
  aud,
  keyid,
  privateKey,
  sessionName: 'test', // optional Isolate different sub-resources under the same jwt account
});
console.log('getJWTToken', result);

// Initialize a new Coze API client using the obtained access token
const client = new CozeAPI({ baseURL, token: result.access_token });

// Example of how to use the client (commented out)
// e.g. client.chat.stream(...);
