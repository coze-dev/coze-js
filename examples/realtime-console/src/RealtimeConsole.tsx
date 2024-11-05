import React, { useState, useEffect, useRef, useCallback } from 'react';

import {
  Layout,
  List,
  Card,
  Typography,
  message,
  Row,
  Col,
  Checkbox,
} from 'antd';
import {
  RealtimeClient,
  RealtimeAPIError,
  EventNames,
} from '@coze/realtime-api';

import Settings from './Settings';
import ConsoleFooter from './ConsoleFooter';

const { Content, Footer } = Layout;
const { Text } = Typography;

interface EventData {
  time: string;
  type?: string;
  event: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  data?: any;
}

const RealtimeConsole: React.FC = () => {
  const clientRef = useRef<RealtimeClient | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [serverEvents, setServerEvents] = useState<EventData[]>([]);
  const [autoScrollEvents, setAutoScrollEvents] = useState(true);
  const [autoScrollServerEvents, setAutoScrollServerEvents] = useState(true);
  const eventsEndRef = useRef<HTMLDivElement>(null);
  const serverEventsEndRef = useRef<HTMLDivElement>(null);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);

  const handleSaveSettings = () => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
    }
    handleInitClient();
  };

  const handleInitClient = () => {
    if (clientRef.current) {
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    const botId = localStorage.getItem('botId');
    const voiceId = localStorage.getItem('voiceId') || '';
    const baseURL = localStorage.getItem('baseURL') || '';

    if (baseURL && !baseURL.trim().match(/^https?:\/\/.+/)) {
      message.error('Invalid base URL format');
      return;
    }

    if (!accessToken || !botId) {
      message.warning('Please click Settings to set configuration');
      return;
    }

    const client = new RealtimeClient({
      accessToken: accessToken.trim(),
      botId: botId.trim(),
      voiceId: voiceId.trim(),
      // conversationId: '1234567890', // Optional
      debug: true,
      baseURL: baseURL.trim(),
      allowPersonalAccessTokenInBrowser: true,
      audioMutedDefault: !isMicrophoneOn,
    });

    // Subscribe to all client and server events
    client.on(EventNames.ALL, handleAllMessage);

    clientRef.current = client;
  };

  const handleConnect = async () => {
    handleInitClient();

    if (!clientRef.current) {
      return;
    }
    try {
      setEvents([]);
      setServerEvents([]);
      await clientRef.current.connect();
      message.success('Connected. Please start the conversation.');
    } catch (e: unknown) {
      if (e instanceof RealtimeAPIError) {
        message.error(`Failed to connect: ${e.message}`);
      } else if (e instanceof Error) {
        message.error(`An error occurred: ${e.message}`);
      } else {
        message.error('An unknown error occurred');
      }
      console.log('Connect error', e);
    }
  };

  const handleAllMessage = useCallback((eventName: string, data: any) => {
    console.log('event', eventName, data);

    const time = new Date().toLocaleTimeString();
    const type = eventName.split('.')[0]; // server or client
    const event = eventName.substring(eventName.indexOf('.') + 1); // event name
    setEvents(prevEvents => [...prevEvents, { time, type, event }]);

    if (
      type === 'server' &&
      (data?.data?.role === 'user' ||
        data?.data?.role === 'assistant' ||
        data?.event_type === 'conversation.created' ||
        data?.event_type === 'error')
    ) {
      setServerEvents(prevEvents => {
        const mergedEvent = mergeEvent(prevEvents, { time, event, data });
        if (mergedEvent) {
          return [...prevEvents.slice(0, -1), mergedEvent];
        }
        if (
          data?.event_type === 'error' ||
          data?.event_type === 'conversation.created'
        ) {
          data.data.content = JSON.stringify(data.data);
          data.data.role = 'assistant';
        }
        return [...prevEvents, { time, event, data }];
      });
    }
  }, []);

  const mergeEvent = (prevEvents: any[], event: any) => {
    if (prevEvents.length === 0) {
      return null;
    }
    const lastEvent = prevEvents[prevEvents.length - 1];
    if (
      lastEvent.event === 'conversation.message.delta' &&
      event.event === 'conversation.message.delta'
    ) {
      return {
        time: lastEvent.time,
        event: lastEvent.event,
        data: {
          ...lastEvent.data,
          data: {
            ...lastEvent.data.data,
            content: lastEvent.data.data.content + event.data.data.content,
          },
        },
      };
    }
    return null;
  };

  const handleDisconnect = async () => {
    if (!clientRef.current || !clientRef.current.isConnected) {
      return;
    }

    try {
      await clientRef.current.disconnect();
      clientRef.current.off(EventNames.ALL, handleAllMessage);
      clientRef.current = null;
      message.success('Disconnected');
    } catch (e) {
      if (e instanceof RealtimeAPIError) {
        message.error(`Failed to disconnect: ${e.message}`);
      } else {
        message.error('Failed to disconnect');
      }
      console.error(e);
      return;
    }
  };

  useEffect(() => {
    handleInitClient();
    return () => {
      handleDisconnect();
    };
  }, []);

  const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (autoScrollEvents) {
      scrollToBottom(eventsEndRef);
    }
  }, [events, autoScrollEvents]);

  useEffect(() => {
    if (autoScrollServerEvents) {
      scrollToBottom(serverEventsEndRef);
    }
  }, [serverEvents, autoScrollServerEvents]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Settings onSaveSettings={handleSaveSettings} />
      <Footer style={{ textAlign: 'center' }}>
        <ConsoleFooter
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          isConnected={clientRef.current?.isConnected}
          clientRef={clientRef}
          onToggleMicrophone={setIsMicrophoneOn}
          isMicrophoneOn={isMicrophoneOn}
        />
      </Footer>
      <Content style={{ padding: '20px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Card
              title="Events"
              style={{ marginBottom: '20px' }}
              extra={
                <Checkbox
                  checked={autoScrollEvents}
                  onChange={e => setAutoScrollEvents(e.target.checked)}
                >
                  Auto Scroll
                </Checkbox>
              }
            >
              <List
                dataSource={[...events, { event: 'end', time: '', type: '' }]}
                style={{ maxHeight: '420px', overflow: 'auto' }}
                renderItem={item =>
                  item.event === 'end' ? (
                    <div ref={eventsEndRef} />
                  ) : (
                    <List.Item>
                      <Text>{item.time}</Text>&nbsp;&nbsp;&nbsp;
                      <Text>[{item.type}]</Text>&nbsp;&nbsp;&nbsp;
                      <Text>{item.event}</Text>
                    </List.Item>
                  )
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Card
              title="User & Assistant"
              extra={
                <Checkbox
                  checked={autoScrollServerEvents}
                  onChange={e => setAutoScrollServerEvents(e.target.checked)}
                >
                  Auto Scroll
                </Checkbox>
              }
            >
              <List
                dataSource={[
                  ...serverEvents,
                  { event: 'end', time: '', type: '' },
                ]}
                style={{ maxHeight: '420px', overflow: 'auto' }}
                renderItem={item =>
                  item.event === 'end' ? (
                    <div ref={serverEventsEndRef} />
                  ) : (
                    <List.Item>
                      <Typography.Paragraph
                        ellipsis={{
                          rows: 1,
                          expandable: true,
                          symbol: 'Show more',
                        }}
                        style={{ margin: 0, width: '100%' }}
                      >
                        {item.event}&nbsp;[{item.data?.data?.role}]&nbsp;
                        {item.data?.data?.content}
                      </Typography.Paragraph>
                    </List.Item>
                  )
                }
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default RealtimeConsole;
