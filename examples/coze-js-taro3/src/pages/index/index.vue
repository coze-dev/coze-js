<template>
  <View class="index">
    <Button @tap="handleClick">streaming chat</Button>
    <Text>{{ msg }}</Text>
  </View>
</template>

<script>
import { View, Text, Button } from '@tarojs/components';
import { CozeAPI, AbortController } from '@coze/taro-api';
import { RoleType, ChatEventType } from '@coze/api';
import { ref } from 'vue';
import './index.css';

export default {
  components: {
    View,
    Text,
    Button,
  },

  setup() {
    const msg = ref('');
    const client = new CozeAPI({
      baseURL: process.env.TARO_APP_COZE_BASE_URL,
      token: process.env.TARO_APP_COZE_PAT ?? '',
      allowPersonalAccessTokenInBrowser: true, // only for test
    });

    async function handleClick() {
      msg.value = '';
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
            msg.value += chunk.data.content;
          }
          console.log(chunk);
        }
      } catch (e) {
        console.log('failed: ', e);
      }
    }

    return {
      msg,
      handleClick,
    };
  },
};
</script>
