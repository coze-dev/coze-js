import { useState, useRef } from 'react';

import { useLoad } from '@tarojs/taro';
import { View, Text, Button, Switch } from '@tarojs/components';
import { CozeAPI, AbortController } from '@coze/taro-api';
import { RoleType, ChatEventType } from '@coze/api';
import './index.css';

export default function Index() {
  const [streaming, setStreaming] = useState(true);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [pollingMessage, setPollingMessage] = useState('');
  const clientRef = useRef<CozeAPI | null>(null);

  useLoad(() => {
    clientRef.current = new CozeAPI({
      baseURL: process.env.TARO_APP_COZE_BASE_URL,
      token: process.env.TARO_APP_COZE_PAT ?? '',
      allowPersonalAccessTokenInBrowser: true, // only for test
    });
  });

  const handleStreamingChat = async () => {
    if (clientRef.current) {
      setStreamingMessage('');
      try {
        const controller = new AbortController();
        // setTimeout(() => {
        //   controller.abort();
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
            setStreamingMessage(msg => msg + chunk.data.content);
          }
          console.log(chunk);
        }
      } catch (e) {
        console.log('failed: ', e);
      }
    }
  };

  const handlePollingChat = async () => {
    if (clientRef.current) {
      setPollingMessage('');
      try {
        const controller = new AbortController();
        // setTimeout(() => {
        //   controller.abort();
        // }, 10);

        const { messages = [] } = await clientRef.current.chat.createAndPoll(
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
        setPollingMessage(
          (messages || []).reduce((acc, cur) => {
            if (cur.type === 'answer') {
              acc += cur.content;
            }
            return acc;
          }, ''),
        );
        console.log('messages: ', messages);
      } catch (e) {
        console.log('failed: ', e);
      }
    }
  };

  return (
    <View className="index">
      <View>
        <Switch
          checked={streaming}
          onChange={evt => setStreaming(evt.detail.value)}
        />
        <Text>{streaming ? 'streaming' : 'polling'}</Text>
      </View>
      {streaming ? (
        <>
          <Button onClick={handleStreamingChat}>streaming chat</Button>
          <Text>{streamingMessage}</Text>
        </>
      ) : (
        <>
          <Button onClick={handlePollingChat}>polling chat</Button>
          <Text>{pollingMessage}</Text>
        </>
      )}
    </View>
  );
}
