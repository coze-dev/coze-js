import assert from 'assert';

import { CozeAPI, ChatStatus, RoleType, ChatEventType } from '@coze/api';

import { botId } from '../client';

const client = new CozeAPI({
  token: '', // proxy token in proxy-server.ts
  baseURL: 'http://localhost:8080/api', // proxy baseURL in proxy-server.ts
});

async function chat() {
  assert(botId, 'botId is required');
  try {
    const response = await client.chat.createAndPoll({
      bot_id: botId,
      additional_messages: [
        {
          role: RoleType.User,
          content: 'Hello through proxy!',
          content_type: 'text',
        },
      ],
    });

    if (response.chat.status === ChatStatus.COMPLETED) {
      console.log('Chat Response:', response.messages);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function streamingChat() {
  assert(botId, 'botId is required');
  const v = await client.chat.stream({
    bot_id: botId,
    auto_save_history: false,
    additional_messages: [
      {
        role: RoleType.User,
        content: 'Hello through proxy!',
        content_type: 'text',
      },
    ],
  });

  for await (const part of v) {
    if (part.event === ChatEventType.CONVERSATION_CHAT_CREATED) {
      console.log('[START]');
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

chat().catch(console.error);
streamingChat().catch(console.error);
