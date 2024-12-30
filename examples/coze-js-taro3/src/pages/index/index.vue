<template>
  <View class="index">
    <Switch :checked="streaming" @change="handleChangeMode"></Switch>
    <Text v-if="streaming">streaming chat</Text>
    <Text v-else>polling chat</Text>
    <template v-if="streaming">
      <Button @tap="handleStreamingChat">streaming chat</Button>
      <Text>{{ streamingMessage }}</Text>
    </template>
    <template v-else>
      <Button @tap="handlePollingChat">polling chat</Button>
      <Text>{{ pollingMessage }}</Text>
    </template>
  </View>
</template>

<script>
import { View, Text, Button, Switch } from '@tarojs/components';
import { CozeAPI, AbortController } from '@coze/taro-api';
import { RoleType, ChatEventType } from '@coze/api';
import { ref } from 'vue';
import './index.css';

export default {
  components: {
    View,
    Text,
    Button,
    Switch,
  },

  setup() {
    const streaming = ref(true);
    const streamingMessage = ref('');
    const pollingMessage = ref('');
    const client = new CozeAPI({
      baseURL: process.env.TARO_APP_COZE_BASE_URL,
      token: process.env.TARO_APP_COZE_PAT ?? '',
      allowPersonalAccessTokenInBrowser: true, // only for test
    });

    function handleChangeMode(evt) {
      streaming.value = evt.detail.value;
    }

    async function handleStreamingChat() {
      streamingMessage.value = '';
      try {
        const controller = new AbortController();
        // setTimeout(() => {
        //   controller.abort();
        // }, 10);

        const res = client.chat.stream(
          {
            bot_id: process.env.TARO_APP_COZE_BOT_ID ?? '',
            user_id: 'abc',
            additional_messages: [
              { role: RoleType.User, content: 'hello', content_type: 'text' },
            ],
          },
          {
            signal: controller.signal,
          },
        );
        for await (const chunk of res) {
          if (chunk.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
            streamingMessage.value += chunk.data.content;
          }
          console.log(chunk);
        }
      } catch (e) {
        console.log('failed: ', e);
      }
    }

    async function handlePollingChat() {
      pollingMessage.value = '';
      try {
        const controller = new AbortController();
        // setTimeout(() => {
        //   controller.abort();
        // }, 10);

        const { messages } = await client.chat.createAndPoll(
          {
            bot_id: process.env.TARO_APP_COZE_BOT_ID ?? '',
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
        console.log('messages: ', messages);
      } catch (e) {
        console.log('failed: ', e);
      }
    }

    return {
      streaming,
      streamingMessage,
      pollingMessage,
      handleChangeMode,
      handleStreamingChat,
      handlePollingChat,
    };
  },
};
</script>
