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

import jwt from 'jsonwebtoken';
import { CozeAPI, getJWTToken } from '@coze/api';

import config from '../../config.js';

// 'en' for https://api.coze.com, 'cn' for https://api.coze.cn
const key = process.env.COZE_ENV || 'en';

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
  join(__dirname, '../../tmp/private_key2.pem'),
);

// Prepare the payload for the JWT
const payload = {
  iss: appId,
  aud,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 86399,
  jti: `uuidxxx${Date.now()}`,
};
console.log('payload', payload);

// Sign the JWT with the private key
jwt.sign(
  payload,
  privateKey,
  { algorithm: 'RS256', keyid },
  async (err, token) => {
    console.log('jwtToken', token);

    // Define the scope for channel access
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

    // Exchange the JWT for an OAuth token with specified scope
    const result = await getJWTToken({
      baseURL,
      token,
      duration_seconds: 86399,
      scope,
    });
    console.log('getJWTToken', result);

    // Initialize a new Coze API client using the obtained access token
    const client = new CozeAPI({ baseURL, token: result.access_token });

    // Example of how to use the client for chat creation
    const data = await client.chat.create({
      bot_id: botIdList[0],
      user_id: '1234567890',
      additional_messages: [
        {
          role: 'user',
          content: 'Hello',
          content_type: 'text',
        },
      ],
    });
    console.log('client.chat.create', data);
  },
);
