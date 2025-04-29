import assert from 'assert';

import {
  ChatEventType,
  ChatStatus,
  type CreateChatData,
  RoleType,
} from '@coze/api';

import { client, botId, sleep } from './client';

const query = 'give me a joke';

async function streamingChat(callback?: (v: CreateChatData) => void) {
  assert(botId, 'botId is required');
  const v = await client.chat.stream({
    bot_id: botId,
    auto_save_history: false,
    additional_messages: [
      {
        role: RoleType.User,
        content: query,
        content_type: 'text',
      },
    ],
  });

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
    } else if (part.event === ChatEventType.ERROR) {
      console.error(part.data);
    }
  }

  console.log('=== End of Streaming Chat ===');
}

async function nonStreamingChat() {
  assert(botId, 'botId is required');

  const v = await client.chat.createAndPoll({
    bot_id: botId,
    additional_messages: [
      {
        role: RoleType.User,
        content: query,
        content_type: 'text',
      },
    ],
  });
  if (v.chat.status === ChatStatus.COMPLETED) {
    for (const item of v.messages || []) {
      console.log('[%s]:[%s]:%s', item.role, item.type, item.content);
    }
    console.log('usage', v.chat.usage);
  }
}

function streamingCancel() {
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
