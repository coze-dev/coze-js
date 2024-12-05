import { useState, useRef } from 'react';

import { useLoad } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { CozeAPI, AbortController } from '@coze/taro-api';
import { RoleType, ChatEventType } from '@coze/api';
import './index.css';

export default function Index() {
  const [message, setMessage] = useState('');
  const clientRef = useRef<CozeAPI | null>(null);

  useLoad(() => {
    clientRef.current = new CozeAPI({
      baseURL: process.env.TARO_APP_COZE_BASE_URL,
      token: process.env.TARO_APP_COZE_PAT ?? '',
      allowPersonalAccessTokenInBrowser: true, // only for test
    });
  });

  const handleClick = async () => {
    if (clientRef.current) {
      setMessage('');
      try {
        const controller = new AbortController();
        // setTimeout(() => {
        // controller.abort();
        // }, 10);

        const res = clientRef.current.chat.stream(
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
            setMessage(msg => msg + chunk.data.content);
          }
          console.log(chunk);
        }
      } catch (e) {
        console.log('failed: ', e);
      }
    }
  };

  return (
    <View className="index">
      <Button onClick={handleClick}>streaming chat</Button>
      <Text>{message}</Text>
    </View>
  );
}
