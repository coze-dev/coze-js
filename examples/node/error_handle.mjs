/* eslint-disable no-unused-vars */
import { client, spaceId } from './client.mjs';
import { CozeAPI } from '../../dist/index.js';
import assert from 'assert';

async function test_BadRequestError() {
  try {
    const bot = await client.bots.create({
      space_id: 'wrong space id',
      name: 'test',
      description: 'test',
    });
    console.log('client.bots.create', bot);
  } catch (err) {
    if (err instanceof CozeAPI.APIError) {
      console.error(`API Error: ${err}`);
    } else {
      console.error(`Unexpected Error: ${err}`);
    }
  }
}

async function test_AuthenticationError() {
  try {
    let client = new CozeAPI({
      token: 'wrong token',
    });
    const bot = await client.bots.create({
      space_id: 'space id',
      name: 'test',
      description: 'test',
    });
    console.log('client.bots.create', bot);
  } catch (err) {
    if (err instanceof CozeAPI.APIError) {
      console.error(`API Error: ${err}`);
    } else {
      console.error(`Unexpected Error: ${err}`);
    }
  }
}

async function test_PermissionDeniedError() {
  assert(spaceId, 'spaceId is required');
  try {
    const bot = await client.bots.create({
      space_id: spaceId,
      name: 'test',
      description: 'test',
    });
    console.log('client.bots.create', bot);
  } catch (err) {
    if (err instanceof CozeAPI.APIError) {
      console.error(`API Error: ${err}`);
    } else {
      console.error(`Unexpected Error: ${err}`);
    }
  }
}

async function test_NotFoundError() {
  assert(spaceId, 'spaceId is required');
  try {
    const client = new CozeAPI({
      baseURL: 'https://api.coze.cn/xxx',
      token: '',
    });
    await client.bots.create({
      space_id: spaceId,
      name: 'test',
      description: 'test',
    });
  } catch (err) {
    if (err instanceof CozeAPI.APIError) {
      console.error(`API Error: ${err}`);
    } else {
      console.error(`Unexpected Error: ${err}`);
    }
  }
}

async function test_Wrongchat() {
  try {
    const chat = await client.chat.retrieve({ chat_id: 'wrong chat id', conversation_id: 'wrong conversation id' });
  } catch (err) {
    if (err instanceof CozeAPI.APIError) {
      console.error(`API Error: ${err}`);
    } else {
      console.error(`Unexpected Error: ${err}`);
    }
  }
}

// test_AuthenticationError();
// test_PermissionDeniedError();
// test_NotFoundError();
test_Wrongchat();
