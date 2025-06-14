import {
  type MutableRefObject,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { Col, List, Row } from 'antd';
import {
  type WsChatClient,
  WsChatEventNames,
  type WsChatEventData,
  ClientEventType,
  type AudioSentencePlaybackStartEvent,
} from '@coze/api/ws-tools';
import {
  type ConversationAudioTranscriptCompletedEvent,
  WebsocketsEventType,
} from '@coze/api';

// 实时语音回复消息列表（音字同步模式）
interface ChatMessage {
  type: 'user' | 'ai';
  timestamp: number;
  // 当前激活的句子索引
  activeSentenceIndex: number;
  // 句子列表
  sentences: string[];
}

export interface SentenceMessageRef {
  addMessage: (text: string) => void;
}

const SentenceMessage = forwardRef(
  (
    {
      clientRef,
    }: {
      clientRef: MutableRefObject<WsChatClient | undefined>;
    },
    ref,
  ) => {
    const [messageList, setMessageList] = useState<ChatMessage[]>([]);
    const isFirstSentenceRef = useRef(true);

    const handleLastSentenceEnd = () => {
      isFirstSentenceRef.current = true;
      setMessageList(prev => {
        const lastMessage = prev[prev.length - 1];
        if (
          lastMessage &&
          lastMessage.type === 'ai' &&
          lastMessage.sentences &&
          lastMessage.sentences.length > 0
        ) {
          return [
            ...prev.slice(0, -1),
            {
              ...lastMessage,
              activeSentenceIndex: -1, // -1表示消息已完成，不再高亮显示任何句子
            },
          ];
        }
        return prev;
      });
    };

    useImperativeHandle(
      ref,
      () => ({
        addMessage: (text: string) => {
          // 先确保显示最终的完整消息
          handleLastSentenceEnd();
          setMessageList(prev => [
            ...prev,
            {
              type: 'user',
              timestamp: Date.now(),
              activeSentenceIndex: -1,
              sentences: [text],
            },
          ]);
        },
      }),
      [],
    );

    useEffect(() => {
      if (!clientRef.current) {
        return;
      }
      const handleMessageEvent = (
        eventName: string,
        event: WsChatEventData,
      ) => {
        if (eventName === WsChatEventNames.CONNECTED) {
          setMessageList([]);
        }
        if (!event) {
          return;
        }
        switch (event.event_type) {
          case WebsocketsEventType.CONVERSATION_AUDIO_TRANSCRIPT_COMPLETED: {
            // 处理用户语音转写完成事件
            const { content } = (
              event as ConversationAudioTranscriptCompletedEvent
            ).data;
            // 先确保显示最终的完整消息
            handleLastSentenceEnd();
            setMessageList(prev => [
              ...prev,
              {
                sentences: [content],
                type: 'user',
                activeSentenceIndex: -1,
                timestamp: Date.now(),
              },
            ]);
            break;
          }
          case ClientEventType.AUDIO_SENTENCE_PLAYBACK_START: {
            // 处理句子开始事件
            const { content } = (event as AudioSentencePlaybackStartEvent).data;
            if (isFirstSentenceRef.current) {
              // 首个句子，创建新消息
              setMessageList(prev => [
                ...prev,
                {
                  type: 'ai',
                  timestamp: Date.now(),
                  activeSentenceIndex: 0,
                  sentences: [content],
                },
              ]);
              isFirstSentenceRef.current = false;
            } else {
              setMessageList(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && lastMessage.type === 'ai') {
                  // 将新句子添加到sentences数组
                  const sentences = [...(lastMessage.sentences || []), content];
                  // 更新消息，同时将activeSentenceIndex指向最新的句子
                  return [
                    ...prev.slice(0, -1),
                    {
                      ...lastMessage,
                      sentences,
                      activeSentenceIndex: sentences.length - 1,
                    },
                  ];
                }
                return prev;
              });
            }

            break;
          }
          case ClientEventType.AUDIO_SENTENCE_PLAYBACK_ENDED: {
            // 确保显示最终的完整消息
            handleLastSentenceEnd();
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
          <h3>实时语音对话（字幕同步模式）</h3>
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
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor:
                      message.type === 'user' ? '#95EC69' : '#FFFFFF',
                    border:
                      message.type === 'ai' ? '1px solid #E5E5E5' : 'none',
                    display: 'inline-block',
                  }}
                >
                  {message.type === 'ai' &&
                  message.sentences &&
                  message.activeSentenceIndex !== undefined &&
                  message.activeSentenceIndex >= 0 ? (
                    // 音字同步模式，高亮显示当前激活的句子
                    <span>
                      {message.sentences.map((sentence, idx) => (
                        <span
                          key={idx}
                          style={{
                            backgroundColor:
                              idx === message.activeSentenceIndex
                                ? '#FFFBE6'
                                : 'transparent',
                            padding:
                              idx === message.activeSentenceIndex
                                ? '2px 0'
                                : '0',
                            transition: 'background-color 0.3s',
                          }}
                        >
                          {sentence}
                        </span>
                      ))}
                    </span>
                  ) : (
                    // 用户消息或AI消息已完成，正常显示内容
                    message.sentences.join('')
                  )}
                </div>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    );
  },
);

export default SentenceMessage;
