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
import { type RoomMode, type APIError } from '@coze/api';

import {
  getBaseUrl,
  isShowVideo,
  isTeamWorkspace,
  redirectToLogin,
} from '../../utils/utils';
import { LocalManager, LocalStorageKey } from '../../utils/local-manager';
import logo from '../../logo.svg';
import useIsMobile from '../../hooks/use-is-mobile';
import useInterrupt from '../../hooks/use-interrupt';
import { useAccessToken } from '../../hooks/use-access-token';
import Settings from './settings';
import Player from './player';
import Header from './header';
import { ConsoleLog } from './console-log';

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
  const localManager = new LocalManager();
  const { getAccessToken, removeAccessToken, initLocalManager } =
    useAccessToken();
  const { handleMessage } = useInterrupt({ clientRef });
  const isMobile = useIsMobile();

  const handleSaveSettings = async () => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
    }
    await initLocalManager();
    setTimeout(() => {
      handleInitClient();
    });
  };

  const handleInitClient = () => {
    if (clientRef.current) {
      return;
    }

    const botId = localManager.get(LocalStorageKey.BOT_ID);
    const voiceId = localManager.get(LocalStorageKey.VOICE_ID);
    const baseURL = getBaseUrl();
    const noiseSuppression = JSON.parse(
      localManager.get(LocalStorageKey.NOISE_SUPPRESSION) || '[]',
    );

    if (!botId) {
      message.error('Please select a bot');
      return;
    }

    const client = new RealtimeClient({
      accessToken: getAccessToken,
      botId: botId.trim(),
      voiceId: voiceId.trim(),
      // conversationId: '1234567890', // Optional
      debug: true,
      baseURL: baseURL.trim(),
      allowPersonalAccessTokenInBrowser: true,
      audioMutedDefault: !isMicrophoneOn,
      suppressStationaryNoise: noiseSuppression.includes('stationary'),
      suppressNonStationaryNoise: noiseSuppression.includes('non-stationary'),
      connectorId: '1024',
      userId: localManager.get(LocalStorageKey.USER_ID),
      conversationId: localManager.get(LocalStorageKey.CONVERSATION_ID),
      workflowId: localManager.get(LocalStorageKey.WORKFLOW_ID),
      prologueContent: localManager.get(LocalStorageKey.PROLOGUE_CONTENT),
      roomMode: localManager.get(
        LocalStorageKey.ROOM_MODE,
        'default',
      ) as RoomMode,
      videoConfig: isShowVideo()
        ? {
            renderDom: 'local-player',
            videoInputDeviceId: localManager.get(
              LocalStorageKey.VIDEO_INPUT_DEVICE_ID,
              undefined,
            ),
            videoOnDefault:
              localManager.get(LocalStorageKey.VIDEO_STATE) === 'true',
          }
        : undefined,
    });

    // Subscribe to all client and server events
    client.on(EventNames.ALL, handleAllMessage);

    clientRef.current = client;
  };

  const handleConnect = async (reconnect = true) => {
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

        // Refresh token when auth failed
        if ((e.error as APIError)?.code === 4100 && reconnect) {
          const isOK = await redirectToLogin(
            isTeamWorkspace(),
            localStorage.getItem(LocalStorageKey.WORKSPACE_ID) ?? undefined,
          );
          if (!isOK) {
            removeAccessToken();
          }
        }
      } else if (e instanceof Error) {
        message.error(`An error occurred: ${e.message}`);
      } else {
        message.error('An unknown error occurred');
      }
      console.log('Connect error', e);
    }
  };

  const handleAllMessage = useCallback((eventName: string, data: any) => {
    // console.log('event', eventName, data);

    if (
      eventName === EventNames.PLAYER_EVENT ||
      eventName === EventNames.NETWORK_QUALITY
    ) {
      return;
    }

    // handle interrupt message
    handleMessage(eventName);

    const now = new Date();
    const time = `${now.toTimeString().split(' ')[0]}.${String(
      now.getMilliseconds(),
    ).padStart(3, '0')}`;
    const type = eventName.split('.')[0]; // server or client
    const event = eventName.substring(eventName.indexOf('.') + 1); // event name

    setEvents(prevEvents => [...prevEvents.slice(-200), { time, type, event }]);

    if (
      type === 'server' &&
      (data?.data?.role === 'user' ||
        data?.data?.role === 'assistant' ||
        data?.event_type === 'conversation.created' ||
        data?.event_type === 'conversation.chat.failed' ||
        data?.event_type === 'conversation.audio_transcript.delta' ||
        data?.event_type === 'error')
    ) {
      setServerEvents(prevEvents => {
        const mergedEvent = mergeEvent(prevEvents, { time, event, data });
        if (mergedEvent) {
          return [...prevEvents.slice(0, -1), mergedEvent];
        }
        if (
          data?.event_type === 'error' ||
          data?.event_type === 'conversation.created' ||
          data?.event_type === 'conversation.chat.failed'
        ) {
          data.data.content = JSON.stringify(data.data);
          data.data.role = 'assistant';
        }
        return [...prevEvents.slice(-200), { time, event, data }];
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

    if (
      lastEvent.event === 'conversation.audio_transcript.delta' &&
      event.event === 'conversation.audio_transcript.delta'
    ) {
      return event;
    }
    return null;
  };

  const handleDisconnect = async () => {
    if (!clientRef.current || !clientRef.current.isConnected) {
      return;
    }

    try {
      await clientRef.current.disconnect();
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

  // useEffect(() => {
  //   if (!accessToken) {
  //     return;
  //   }
  //   handleInitClient();
  //   return () => {
  //     handleDisconnect();
  //   };
  // }, [accessToken]);

  const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // set favicon
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.setAttribute('href', logo);
    } else {
      const favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.href = logo;
      document.head.appendChild(favicon);
    }
  }, []);

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
      <Settings onSaveSettings={handleSaveSettings} clientRef={clientRef} />
      <Footer style={{ textAlign: 'center' }}>
        <Header
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          isConnected={clientRef.current?.isConnected}
          clientRef={clientRef}
          onToggleMicrophone={setIsMicrophoneOn}
          isMicrophoneOn={isMicrophoneOn}
        />
      </Footer>
      {isShowVideo() && <Player clientRef={clientRef} />}
      {isMobile && <ConsoleLog />}
      {!isMobile && (
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
                  style={{ maxHeight: '320px', overflow: 'auto' }}
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
                  style={{ maxHeight: '320px', overflow: 'auto' }}
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
                          {item.time}&nbsp;&nbsp;
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
      )}
    </Layout>
  );
};

export default RealtimeConsole;
