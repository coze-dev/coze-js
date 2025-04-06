import { AudioDumpEvent, WebsocketsEventType } from '@coze/api';
import {
  WsChatClient,
  WsChatEventNames,
  WsChatEventData,
} from '@coze/api/ws-tools';
import { Col, List, Row, Space } from 'antd';
import { MutableRefObject, useEffect, useState } from 'react';

const ReceiveMessage = ({
  clientRef,
}: {
  clientRef: MutableRefObject<WsChatClient | undefined>;
}) => {
  // 实时语音回复消息列表
  const [messageList, setMessageList] = useState<string[]>([]);
  const [audioList, setAudioList] = useState<{ label: string; url: string }[]>(
    [],
  );

  useEffect(() => {
    if (!clientRef.current) {
      return;
    }
    let lastEventName: string;
    const handleMessageEvent = (eventName: string, event: WsChatEventData) => {
      if (!event) {
        return;
      }

      switch (event.event_type) {
        case 'audio.input.dump':
          // 处理音频输入 dump 事件
          setAudioList(prev => [
            ...prev,
            {
              label: event.event_type,
              url: URL.createObjectURL(event.data.wav),
            },
          ]);
          break;
        case WebsocketsEventType.DUMP_AUDIO:
          // 处理音频 dump 事件（仅限于开发环境返回）
          setAudioList(prev => {
            const newAudioList = [
              ...prev,
              {
                label: 'server',
                url: (event as AudioDumpEvent).data.url,
              },
            ];
            return newAudioList;
          });
          break;
        case WebsocketsEventType.CONVERSATION_MESSAGE_DELTA:
        case WebsocketsEventType.CONVERSATION_MESSAGE_COMPLETED:
          if (event.data.type === 'question') {
            break;
          }
          // 处理语音文本消息
          const content = event.data.content;
          console.log('content', content);
          setMessageList(prev => {
            // 如果上一个事件是增量更新，则附加到最后一条消息
            if (
              lastEventName ===
                WebsocketsEventType.CONVERSATION_MESSAGE_DELTA &&
              event.event_type ===
                WebsocketsEventType.CONVERSATION_MESSAGE_DELTA
            ) {
              return [...prev.slice(0, -1), prev[prev.length - 1] + content];
            }
            lastEventName = event.event_type;
            // 否则添加新消息
            if (
              event.event_type ===
              WebsocketsEventType.CONVERSATION_MESSAGE_DELTA
            ) {
              console.log('content2', prev, content);
              return [...prev, content];
            }
            return prev;
          });

          break;
        default:
          break;
      }
    };

    clientRef.current?.on(WsChatEventNames.ALL, handleMessageEvent);

    return () => {
      clientRef.current?.off(WsChatEventNames.ALL, handleMessageEvent);
    };
  }, [clientRef.current]);

  return (
    <Row
      style={{
        margin: '16px',
        border: '1px solid #ccc',
      }}
    >
      <Col
        span={24}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '10px',
        }}
      >
        <h3>实时语音回复</h3>
        <List
          dataSource={messageList}
          renderItem={(message, index) => (
            <List.Item key={index} style={{ textAlign: 'left' }}>
              {message}
            </List.Item>
          )}
        />
        <List
          dataSource={audioList}
          locale={{ emptyText: <div></div> }}
          renderItem={(audio, index) => (
            <List.Item key={index} style={{ textAlign: 'left' }}>
              <Space>
                <span>
                  {audio.label === 'source'
                    ? '源音频：'
                    : audio.label === 'server'
                      ? '服务端：'
                      : '降噪后：'}
                </span>
                <audio
                  style={{ width: '250px', height: '32px' }}
                  src={audio.url}
                  controls
                />
              </Space>
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
};

export default ReceiveMessage;
