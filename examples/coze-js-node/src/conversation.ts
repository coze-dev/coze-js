import assert from 'assert';

import { RoleType } from '@coze/api';

import { botId, client } from './client.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
async function createConversation(bot_id?: string) {
  const conversation = await client.conversations.create({
    bot_id,
    messages: [
      {
        role: RoleType.Assistant,
        content_type: 'text',
        content: 'Hi, you are an assistant',
      },
      {
        role: RoleType.User,
        content_type: 'object_string',
        content: JSON.stringify([
          { type: 'text', text: '123' },
          {
            type: 'image',
            file_url:
              'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
          } /*, { type: 'file', file_id: '{{file_id_1}}' }*/,
        ]),
      },
    ],
    meta_data: {
      a: 'b',
      c: 'd',
      k: 'z',
    },
  });
  return conversation;
}

async function main() {
  const conversation = await createConversation();
  console.log('client.conversations.create', conversation);

  const conversation2 = await client.conversations.retrieve(conversation.id);
  console.log('client.conversations.retrieve', conversation2);

  const message = await client.conversations.messages.create(conversation.id, {
    content_type: 'object_string',
    role: RoleType.User,
    content: JSON.stringify([
      { type: 'text', text: '是的方式的是否' },
      {
        type: 'image',
        file_url:
          'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      },
    ]),
    meta_data: {
      想想: '111',
      '🚗': 'eee',
    },
  });
  console.log('client.conversations.messages.create', message);

  const message2 = await client.conversations.messages.retrieve(
    conversation.id,
    message.id,
  );
  console.log('client.conversations.messages.retrieve', message2);

  const updatedMessage = await client.conversations.messages.update(
    conversation.id,
    message.id,
    {
      content: '121212121',
      content_type: 'text',
      meta_data: {
        x: '1',
        b: '2',
      },
    },
  );
  console.log('client.conversations.messages.update', updatedMessage);

  const deletedMessage = await client.conversations.messages.delete(
    conversation.id,
    updatedMessage.id,
  );
  console.log('client.conversations.messages.delete', deletedMessage);

  const messages = await client.conversations.messages.list(conversation.id);
  console.log('client.conversations.messages.list', messages);
}

async function withBotId() {
  assert(botId, 'botId is required');
  const conversation = await createConversation(botId);
  console.log('client.conversations.create', conversation);

  const list = await client.conversations.list({
    bot_id: botId,
    page_num: 1,
    page_size: 50,
  });
  console.log('client.conversations.list', list);

  const session = await client.conversations.clear(conversation.id);
  console.log('client.conversations.clear', session);
}

main().catch(console.error);
withBotId().catch(console.error);
