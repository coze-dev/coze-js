import { type MutableRefObject, useEffect, useRef, useState } from 'react';

import { Col, List, Row, Space } from 'antd';
import {
  type WsChatClient,
  WsChatEventNames,
  type WsChatEventData,
} from '@coze/api/ws-tools';
import {
  type AudioDumpEvent,
  type ConversationAudioTranscriptCompletedEvent,
  WebsocketsEventType,
} from '@coze/api';

// 实时语音回复消息列表
interface ChatMessage {
  content: string;
  type: 'user' | 'ai';
  timestamp: number;
}

const ReceiveMessage = ({
  clientRef,
}: {
  clientRef: MutableRefObject<WsChatClient | undefined>;
}) => {
  const [messageList, setMessageList] = useState<ChatMessage[]>([]);
  const [audioList, setAudioList] = useState<{ label: string; url: string }[]>(
    [],
  );
  const isFirstDeltaRef = useRef(true);

  useEffect(() => {
    if (!clientRef.current) {
      return;
    }
    const handleMessageEvent = (_: string, event: WsChatEventData) => {
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
        case WebsocketsEventType.CONVERSATION_AUDIO_TRANSCRIPT_COMPLETED: {
          const { content } = (
            event as ConversationAudioTranscriptCompletedEvent
          ).data;
          setMessageList(prev => [
            ...prev,
            { content, type: 'user', timestamp: Date.now() },
          ]);
          break;
        }
        case WebsocketsEventType.CONVERSATION_MESSAGE_DELTA:
          if (event.data.content) {
            if (isFirstDeltaRef.current) {
              // 第一次增量，创建新消息
              setMessageList(prev => [
                ...prev,
                {
                  content: event.data.content,
                  type: 'ai',
                  timestamp: Date.now(),
                },
              ]);
              isFirstDeltaRef.current = false;
            } else {
              setMessageList(prev => {
                // 后续增量，追加到最后一条消息
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && lastMessage.type === 'ai') {
                  lastMessage.content += event.data.content;
                }
                const newMessageList = [
                  ...prev.slice(0, -1),
                  { ...lastMessage },
                ];
                return newMessageList;
              });
            }
          }
          break;
        case WebsocketsEventType.CONVERSATION_MESSAGE_COMPLETED: {
          // 收到完成事件，重置标记，下一次将创建新消息
          isFirstDeltaRef.current = true;
          break;
        }
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
        margin: '16px 0',
        border: '1px solid #ccc',
      }}
    >
      <Col
        span={24}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxHeight: '600px',
          overflowY: 'auto',
          padding: '10px',
        }}
      >
        <h3>实时语音对话</h3>
        <List
          dataSource={messageList}
          renderItem={(message, index) => (
            <List.Item
              key={index}
              style={{
                textAlign: 'left',
                padding: '8px 16px',
              }}
            >
              <div
                style={{
                  // maxWidth: '70%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor:
                    message.type === 'user' ? '#95EC69' : '#FFFFFF',
                  border: message.type === 'ai' ? '1px solid #E5E5E5' : 'none',
                  display: 'inline-block',
                }}
              >
                {message.content}
              </div>
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
