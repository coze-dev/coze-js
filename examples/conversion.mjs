import { client } from './client.mjs';

const conversation = await client.conversations.create({
  messages: [
    {
      role: 'user',
      content: 'Hello, world!',
      content_type: 'text',
    },
  ],
});
console.log('client.conversations.create', conversation);

const conversation2 = await client.conversations.retrieve({
  conversation_id: conversation.id,
});
console.log('client.conversations.retrieve', conversation2);

const message = await client.conversations.messages.create({
  conversation_id: conversation.id,
  role: 'user',
  content: 'Hello, world!',
  content_type: 'text',
});
console.log('client.conversations.messages.create', message);

const message2 = await client.conversations.messages.retrieve({
  conversation_id: conversation.id,
  message_id: message.id,
});
console.log('client.conversations.messages.retrieve', message2);

const updatedMessage = await client.conversations.messages.update({
  conversation_id: conversation.id,
  message_id: message.id,
  content: 'Hello, world2!',
  role: 'user',
  content_type: 'text',
});
console.log('client.conversations.messages.update', updatedMessage);

const messages = await client.conversations.messages.list({
  conversation_id: conversation.id,
});
console.log('client.conversations.messages.list', messages);
