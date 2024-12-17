import {
  ChatEventType,
  ChatStatus,
  type CozeAPI,
  type CreateChatData,
  RoleType,
} from '@coze/api';

export async function nonStreamingChat({
  client,
  botId,
  query,
}: {
  client: CozeAPI;
  botId: string;
  query: string;
}) {
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

export async function streamingChat({
  client,
  botId,
  query,
  callback,
}: {
  client: CozeAPI;
  botId: string;
  query: string;
  callback?: (v: CreateChatData) => void;
}) {
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
