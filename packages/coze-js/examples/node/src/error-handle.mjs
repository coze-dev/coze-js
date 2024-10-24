/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import assert from 'assert';

import { CozeAPI } from '@coze/api';

import { client, spaceId } from './client.mjs';

async function test_BadRequestError() {
  try {
    const bot = await client.bots.create({
      space_id: 'wrong space id',
      name: 'test',
      description: 'test',
    });
    console.log('client.bots.create', bot);
  } catch (err) {
    assert(err instanceof CozeAPI.BadRequestError);
    console.log('test_BadRequestError', err.name);
  }
}

async function test_AuthenticationError() {
  try {
    const client = new CozeAPI({
      token: 'wrong token',
    });
    const bot = await client.bots.create({
      space_id: 'space id',
      name: 'test',
      description: 'test',
    });
    console.log('client.bots.create', bot);
  } catch (err) {
    assert(err instanceof CozeAPI.AuthenticationError);
    console.log('test_AuthenticationError', err.name);
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
  } catch (err) {
    assert(err instanceof CozeAPI.PermissionDeniedError);
    console.log('test_PermissionDeniedError', err.name);
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
    assert(err instanceof CozeAPI.NotFoundError);
    console.log('test_NotFoundError', err.name);
  }
}

async function test_Wrongchat() {
  try {
    const chat = await client.chat.retrieve({
      chat_id: 'wrong chat id',
      conversation_id: 'wrong conversation id',
    });
  } catch (err) {
    assert(err instanceof CozeAPI.APIError);
    console.log('test_Wrongchat', err.name);
  }
}
await test_BadRequestError();
await test_AuthenticationError();
await test_PermissionDeniedError();
await test_NotFoundError();
await test_Wrongchat();
