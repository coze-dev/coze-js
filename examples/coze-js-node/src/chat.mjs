/* eslint-disable no-unused-vars */
import { clearLine, cursorTo } from 'node:readline';
import assert from 'assert';

import { ChatEventType, ChatStatus } from '@coze/api';

import { client, botId, sleep } from './client.mjs';

const query = '来一段有趣的代码';

async function streamingChat(callback) {
  assert(botId, 'botId is required');
  const v = await client.chat.stream({
    bot_id: botId,
    user_id: '123',
    auto_save_history: false,
    additional_messages: [
      {
        role: 'user',
        content: query,
        content_type: 'text',
      },
    ],
  });
  console.log('xx', v);
  for await (const part of v) {
    if (part.event === ChatEventType.CONVERSATION_CHAT_CREATED) {
      console.log('[START]');
      callback && callback(part.data);
    } else if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
      process.stdout.write(part.data.content);
    } else if (part.event === ChatEventType.CONVERSATION_MESSAGE_COMPLETED) {
      const { role, type, content } = part.data;
      if (role === 'assistant' && type === 'answer') {
        process.stdout.write('\n');
      } else {
        console.log('[%s]:[%s]:%s', role, type, content);
      }
    } else if (part.event === ChatEventType.CONVERSATION_CHAT_COMPLETED) {
      console.log(part.data.usage);
    } else if (part.event === ChatEventType.DONE) {
      console.log(part.data);
    }
  }

  console.log('=== End of Streaming Chat ===');
}

async function nonStreamingChat() {
  assert(botId, 'botId is required');

  const v = await client.chat.createAndPoll({
    bot_id: botId,
    user_id: '123',
    additional_messages: [
      {
        role: 'user',
        content: query,
        content_type: 'text',
      },
    ],
  });
  if (v.chat.status === ChatStatus.COMPLETED) {
    for (const item of v.messages) {
      console.log('[%s]:[%s]:%s', item.role, item.type, item.content);
    }
    console.log('usage', v.chat.usage);
  }
}

// TODO  test
async function submitToolOutputs() {
  const v = await client.chat.submitToolOutputs({
    conversation_id: '123',
    chat_id: '123',
    tool_outputs: [{ id: '123', output: '123' }],
    stream: false,
  });
  console.log('client.chat.submitToolOutputs', v);
}

async function streamingCancel() {
  streamingChat(async v => {
    sleep(2000);
    const result = await client.chat.cancel(v.conversation_id, v.id);
    console.log('client.chat.cancel', result);
  });
}

async function main() {
  await streamingChat();
  await nonStreamingChat();
  streamingCancel();
}

main().catch(console.error);
