/* eslint-disable @typescript-eslint/naming-convention */
/*
 * How to effectuate OpenAPI authorization through the OAuth JWT (JSON Web Token) method for channel access.
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

import { streamingChat } from '../utils.js';
import config from '../config/config.js';
import { botId } from '../client.js';

// 'en' for https://api.coze.com, 'cn' for https://api.coze.cn
const key = (process.env.COZE_ENV || 'en') as keyof typeof config;

// Retrieve configuration values from the config file
const baseURL = config[key].COZE_BASE_URL;
const appId = config[key].auth.auth_jwt_channel.COZE_APP_ID;
const keyid = config[key].auth.auth_jwt_channel.COZE_KEY_ID;
const aud = config[key].auth.auth_jwt_channel.COZE_AUD;
const botIdList = [config[key].COZE_BOT_ID];

// Read the private key from a file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const privateKey = fs.readFileSync(
  join(__dirname, '../../tmp/private_key_channel.pem'),
);

async function main() {
  const scope = {
    account_permission: {
      permission_list: ['Connector.botChat'],
    },
    attribute_constraint: {
      connector_bot_chat_attribute: {
        bot_id_list: botIdList,
      },
    },
  };

  console.log('getJWTToken', baseURL, appId, aud, keyid);
  let jwtToken = await getJWTToken({
    baseURL,
    appId,
    aud,
    keyid,
    privateKey: privateKey.toString(),
    scope,
  });
  console.log('getJWTToken', jwtToken);

  // Initialize a new Coze API client using the obtained access token
  const client = new CozeAPI({
    baseURL,
    token: async () => {
      // refresh token if expired
      if (jwtToken.expires_in * 1000 > Date.now() + 5000) {
        // add 5 seconds buffer
        return jwtToken.access_token;
      }

      console.log('refresh token');
      jwtToken = await getJWTToken({
        baseURL,
        appId,
        aud,
        keyid,
        privateKey: privateKey.toString(),
        scope,
      });
      return jwtToken.access_token;
    },
  });

  // Example of how to use the client for chat creation
  streamingChat({
    client,
    botId,
    query: 'give me a joke',
  });
}

main().catch(console.error);
