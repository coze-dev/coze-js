/* eslint-disable no-unused-vars */
import { CozeAPI, getDeviceCode, getDeviceToken, getJWTToken } from '../../dist/index.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';

const baseURL = 'https://api.coze.cn';

async function device_token() {
  const client_id = '***396512971595586715564048503.app.coze';
  const deviceCode = await getDeviceCode({
    baseURL,
    client_id,
  });
  console.log('deviceCode', deviceCode);

  const deviceToken = await getDeviceToken({
    baseURL,
    client_id,
    device_code: deviceCode.device_code,
  });
  console.log('deviceToken', deviceToken);
}

// https://www.coze.cn/docs/developer_guides/oauth_jwt
async function jwt_token() {
  const spaceId = '***0912839026278411';
  const appId = '***14427';
  const keyid = '***36E';
  const aud = 'api.coze.cn';

  const privateKey = fs.readFileSync('private_key.pem');

  const payload = {
    iss: appId,
    aud,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86399,
    jti: 'uuidxxx' + Date.now(),
  };
  jwt.sign(payload, privateKey, { algorithm: 'RS256', keyid }, async (err, token) => {
    console.log('jwtToken', token);
    const result = await getJWTToken({ baseURL, token, duration_seconds: 86399 });

    const client = new CozeAPI({ baseURL, token: result.access_token });
    const list = await client.bots.list({ space_id: spaceId, page_index: 1, page_size: 10 });
    console.log('client.bots.list', list);
  });
}

// https://bots.bytedance.net/docs/developer_guides/oauth_jwt_channel
// https://bots.bytedance.net/docs/developer_guides/configure_custom_channel1
async function jwt_channel_token() {
  const appId = '***1228191';
  const keyid = '***UIXgHCOJZcdk6k_jrfoEawOplkdVd6P3x60DbzFU';
  const aud = 'api.coze.cn';
  const bot_id_list = ['***805123866'];
  const baseURL = 'https://api.coze.cn';
  const privateKey = fs.readFileSync('private_key2.pem');

  const payload = {
    iss: appId,
    aud,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86399,
    jti: 'uuidxxx' + Date.now(),
  };
  jwt.sign(payload, privateKey, { algorithm: 'RS256', keyid }, async (err, token) => {
    console.log('jwtToken', token);
    const scope = {
      account_permission: {
        permission_list: ['Connector.botChat'],
      },
      attribute_constraint: {
        connector_bot_chat_attribute: {
          bot_id_list,
        },
      },
    };
    const result = await getJWTToken({ baseURL, token, duration_seconds: 86399, scope });

    const client = new CozeAPI({ baseURL, token: result.access_token });
    const data = await client.chat.create({
      bot_id: bot_id_list[0],
      additional_messages: [
        {
          role: 'user',
          content: 'Hello',
          content_type: 'text',
        },
      ],
    });
    console.log('client.chat.create', data);
  });
}

// device_token();
// jwt_token();
jwt_channel_token();
