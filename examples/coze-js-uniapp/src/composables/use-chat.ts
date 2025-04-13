/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue';
import { AbortController } from '@coze/uniapp-api';
import { RoleType, ChatEventType } from '@coze/api';

import { cozeClient } from '../api/client';

export function useChat() {
  const streamingMessage = ref('');
  const pollingMessage = ref('');
  const isResponsing = ref(false);
  const controller = ref<any>(null);

  const handleStreamingChat = async () => {
    if (!cozeClient) {
      return;
    }

    streamingMessage.value = '';
    try {
      controller.value = new AbortController();
      isResponsing.value = true;

      const res = cozeClient.chat.stream(
        {
          bot_id: import.meta.env.VITE_COZE_BOT_ID || '',
          user_id: 'abc',
          additional_messages: [
            {
              role: RoleType.User,
              content: '讲一个故事',
              content_type: 'text',
            },
          ],
        },
        {
          signal: controller.value?.signal,
        },
      );

      for await (const chunk of res) {
        if (chunk.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
          streamingMessage.value += chunk.data.content;
        }
      }
      isResponsing.value = false;
    } catch (e) {
      console.log('failed: ', e);
    }
  };

  const handlePollingChat = async () => {
    if (!cozeClient) {
      return;
    }

    pollingMessage.value = '';
    try {
      controller.value = new AbortController();

      const { messages = [] } = await cozeClient.chat.createAndPoll(
        {
          bot_id: import.meta.env.VITE_COZE_BOT_ID || '',
          user_id: 'abc',
          additional_messages: [
            { role: RoleType.User, content: 'hello', content_type: 'text' },
          ],
        },
        {
          signal: controller.signal,
        },
      );

      pollingMessage.value = (messages || []).reduce((acc, cur) => {
        if (cur.type === 'answer') {
          acc += cur.content;
        }
        return acc;
      }, '');
    } catch (e) {
      console.log('failed: ', e);
    }
  };

  const handleAbort = () => {
    controller.value?.abort();
    isResponsing.value = false;
  };

  return {
    streamingMessage,
    pollingMessage,
    isResponsing,
    handleStreamingChat,
    handlePollingChat,
    handleAbort,
  };
}
