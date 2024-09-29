import { CozeAPI } from '@coze/api';
import { useState } from 'react';

const client = new CozeAPI({
  authConfig: {
    type: 'pat_token',
    token: 'pat_xxx',
  },
  baseURL: 'https://api.coze.cn',
});

const useCozeAPI = (botId: string) => {
  const [message, setMessage] = useState('');

  console.log(message);

  async function streamingChat(query: string) {
    const v = await client.chat.stream({
      bot_id: botId,
      auto_save_history: true,
      additional_messages: [
        {
          role: 'user',
          content: query,
          content_type: 'text',
        },
      ],
    });

    for await (const part of v) {
      if (part.event === 'conversation.chat.created') {
        console.log('[START]');
      } else if (part.event === 'conversation.message.delta') {
        setMessage(prev => prev + part.data.content);
      } else if (part.event === 'conversation.message.completed') {
        const { role, type, content } = part.data;
        if (role === 'assistant' && type === 'answer') {
          setMessage(prev => prev + '\n');
        } else {
          console.log('[%s]:[%s]:%s', role, type, content);
        }
      } else if (part.event === 'conversation.chat.completed') {
        console.log(part.data.usage);
      } else if (part.event === 'done') {
        console.log(part.data);
      }
    }
    console.log('=== End of Streaming Chat ===');
  }

  const sendMessage = async (query: string) => {
    setMessage('');
    await streamingChat(query);
  };

  return { message, sendMessage };
};

export { useCozeAPI };
