import { useState, useRef } from 'react';

import { useLoad } from '@tarojs/taro';
import { View, Text, Button, Switch } from '@tarojs/components';
import { CozeAPI, AbortController } from '@coze/taro-api';
import { RoleType, ChatEventType, WorkflowEventType } from '@coze/api';
import './index.css';

export default function Index() {
  const [streaming, setStreaming] = useState(true);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [pollingMessage, setPollingMessage] = useState('');
  const clientRef = useRef<CozeAPI | null>(null);
  const [isResponsing, setIsResponsing] = useState(false);
  const [isWorkflow, setIsWorkflow] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controllerRef = useRef<any>();

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
        controllerRef.current = new AbortController();
        // setTimeout(() => {
        //   controller.abort();
        // }, 10);
        setIsResponsing(true);
        const res = clientRef.current.chat.stream(
          {
            bot_id: process.env.TARO_APP_COZE_BOT_ID ?? '',
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
            signal: controllerRef.current?.signal,
          },
        );
        for await (const chunk of res) {
          if (chunk.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
            setStreamingMessage(msg => msg + chunk.data.content);
          }
          console.log(chunk);
        }
        setIsResponsing(false);
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

  const handleWorkflow = async () => {
    if (clientRef.current) {
      setStreamingMessage('');
      try {
        controllerRef.current = new AbortController();

        setIsResponsing(true);
        const res = await clientRef.current.workflows.runs.stream(
          {
            workflow_id: process.env.TARO_APP_COZE_WORKFLOW_ID ?? '',
            // 工作流参数，需要根据实际工作流所定义的参数填写，否则会报错
            parameters: {
              norco: 'JavaScript',
            },
            // 智能体ID，没有就不需要填
            bot_id: process.env.TARO_APP_COZE_BOT_ID ?? '',
          },
          {
            signal: controllerRef.current?.signal,
          },
        );

        for await (const event of res) {
          if (event.event === WorkflowEventType.MESSAGE) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setStreamingMessage(msg => msg + (event as any).data?.content);
          }
        }

        setIsResponsing(false);
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
      <View>
        <Switch
          checked={isWorkflow}
          onChange={evt => setIsWorkflow(evt.detail.value)}
        />
        <Text>{isWorkflow ? 'workflow' : 'chat'}</Text>
      </View>
      {streaming ? (
        <>
          <Button onClick={isWorkflow ? handleWorkflow : handleStreamingChat}>
            {isWorkflow ? 'workflow' : 'streaming chat'}
          </Button>
          <Button
            disabled={!isResponsing}
            style={{ color: 'black', marginTop: 10 }}
            onClick={() => {
              controllerRef.current?.abort();
              setIsResponsing(false);
            }}
          >
            abort
          </Button>
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
