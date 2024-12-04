import { useState, useRef } from 'react';

import { useLoad } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { CozeAPI } from '@coze/taro-api';
import { RoleType } from '@coze/api';
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
      const res = clientRef.current.chat.stream({
        bot_id: process.env.TARO_APP_COZE_BOT_ID ?? '',
        user_id: 'abc',
        additional_messages: [
          { role: RoleType.User, content: 'hello', content_type: 'text' },
        ],
      });
      for await (const chunk of res) {
        if (chunk.event === 'conversation.message.delta') {
          setMessage(msg => msg + chunk.data.content);
        }
        console.log(chunk);
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
