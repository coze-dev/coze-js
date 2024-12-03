/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import assert from 'assert';

import { ChatEventType, CozeAPI, RoleType } from '@coze/api';

import { botId, baseURL, apiKey } from './client.js';

async function test_timeout_global() {
  try {
    assert(baseURL, 'baseURL is required');
    assert(apiKey, 'apiKey is required');

    const client = new CozeAPI({
      baseURL,
      token: apiKey,
      axiosOptions: {
        timeout: 100, // timeout in ms
      },
      debug: true,
    });

    const result = await client.chat.stream({
      bot_id: botId,
      user_id: '123',
      auto_save_history: true,
      additional_messages: [
        {
          role: RoleType.User,
          content: 'give me a joke',
          content_type: 'text',
        },
      ],
    });

    for await (const chunk of result) {
      console.log(chunk);
    }
  } catch (err) {
    assert(err instanceof CozeAPI.TimeoutError);
    console.log('test_timeout_global', err.name);
  }
}

async function test_timeout_with_options() {
  try {
    assert(baseURL, 'baseURL is required');
    assert(apiKey, 'apiKey is required');

    const client = new CozeAPI({
      baseURL,
      token: apiKey,
    });

    const result = await client.chat.create(
      {
        bot_id: botId,
        user_id: '123',
        auto_save_history: true,
        additional_messages: [
          {
            role: RoleType.User,
            content: 'Hello',
            content_type: 'text',
          },
        ],
      },
      {
        timeout: 10, // timeout in ms
      },
    );
    console.log(result);
  } catch (err) {
    assert(err instanceof CozeAPI.TimeoutError);
    console.log('test_timeout_with_options', err.name);
  }
}

async function test_timeout_with_signal() {
  try {
    assert(baseURL, 'baseURL is required');
    assert(apiKey, 'apiKey is required');

    const client = new CozeAPI({
      baseURL,
      token: apiKey,
    });

    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10);
    const result = await client.chat.create(
      {
        bot_id: botId,
        user_id: '123',
        auto_save_history: true,
        additional_messages: [
          {
            role: RoleType.User,
            content: 'Hello',
            content_type: 'text',
          },
        ],
      },
      {
        signal: controller.signal,
      },
    );
  } catch (err) {
    assert(err instanceof CozeAPI.UserAbortError);
    console.log('test_timeout_with_signal', err.name);
  }
}

async function test_headers() {
  try {
    assert(baseURL, 'baseURL is required');
    assert(apiKey, 'apiKey is required');

    const client = new CozeAPI({
      baseURL,
      token: apiKey,
      debug: true,
    });

    const result = await client.chat.create(
      {
        bot_id: botId,
        user_id: '123',
        auto_save_history: true,
        additional_messages: [
          {
            role: RoleType.User,
            content: 'Hello',
            content_type: 'text',
          },
        ],
      },
      {
        headers: {
          'X-Custom-Header': 'value',
        },
      },
    );
    // console.log(result);
  } catch (err) {
    assert('error');
  }
}

async function test_stream_with_signal() {
  assert(baseURL, 'baseURL is required');
  assert(apiKey, 'apiKey is required');

  const client = new CozeAPI({
    baseURL,
    token: apiKey,
  });

  const controller = new AbortController();
  setTimeout(() => {
    console.log('\n=====abort=====');
    controller.abort();
  }, 1500);
  const result = await client.chat.stream(
    {
      bot_id: botId,
      user_id: '123',
      auto_save_history: true,
      additional_messages: [
        {
          role: RoleType.User,
          content: 'Tell me a story about being in the forest.',
          content_type: 'text',
        },
      ],
    },
    {
      signal: controller.signal,
    },
  );

  for await (const chunk of result) {
    if (chunk.event === ChatEventType.CONVERSATION_CHAT_CREATED) {
      console.log('[START]');
    } else if (chunk.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
      process.stdout.write(chunk.data.content);
    } else if (chunk.event === ChatEventType.CONVERSATION_MESSAGE_COMPLETED) {
      const { role, type, content } = chunk.data;
      if (role === 'assistant' && type === 'answer') {
        process.stdout.write('\n');
      } else {
        console.log('[%s]:[%s]:%s', role, type, content);
      }
    } else if (chunk.event === ChatEventType.CONVERSATION_CHAT_COMPLETED) {
      console.log(chunk.data.usage);
    } else if (chunk.event === ChatEventType.DONE) {
      console.log(chunk.data);
    } else if (chunk.event === ChatEventType.ERROR) {
      console.error(chunk.data);
    }
  }
}

await test_timeout_global();
await test_timeout_with_options();
await test_timeout_with_signal();
await test_headers();
await test_stream_with_signal();
