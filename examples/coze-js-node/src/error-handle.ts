/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import assert from 'assert';

import { type APIError, CozeAPI } from '@coze/api';

import { apiKey, baseURL, client, spaceId } from './client';

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
      baseURL,
      token: 'pat_1234567890',
    });
    await client.chat.retrieve('wrong chat id', 'wrong conversation id');
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
    const chat = await client.chat.retrieve(
      'wrong chat id',
      'wrong conversation id',
    );
  } catch (err) {
    assert(err instanceof CozeAPI.APIError);
    console.log('test_Wrongchat', err.name);
  }
}

// test onApiError
async function test_onApiError() {
  let error: APIError | undefined;
  let error2: APIError | undefined;
  try {
    await client.chat.retrieve('wrong chat id', 'wrong conversation id', {
      onApiError: (err: APIError) => {
        console.log('test_onApiError', err.msg);
        error = err;
      },
    });
  } catch (err) {
    error2 = err as APIError;
  } finally {
    assert(error === error2);
  }
}

// test global onApiError
async function test_global_onApiError() {
  let error: APIError | undefined;
  let error2: APIError | undefined;
  try {
    const client = new CozeAPI({
      baseURL: 'https://api.coze.cn',
      token: apiKey,
      onApiError: (err: APIError) => {
        console.log('test_global_onApiError', err.name, err.msg);
        error = err;
      },
      debug: false,
    });
    await client.chat.retrieve('wrong chat id', 'wrong conversation id');
  } catch (err) {
    error2 = err as APIError;
  } finally {
    assert(error === error2);
  }
}

async function main() {
  await test_BadRequestError();
  await test_AuthenticationError();
  await test_PermissionDeniedError();
  await test_NotFoundError();
  await test_Wrongchat();
  await test_onApiError();
  await test_global_onApiError();
}

main();
