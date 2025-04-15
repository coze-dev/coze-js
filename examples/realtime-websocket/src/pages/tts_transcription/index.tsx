import React, { useState, useRef } from 'react';
import {
  type CreateChatWsReq,
  type CreateChatWsRes,
  type WebSocketAPI,
  type ConversationMessageDeltaEvent,
  CozeAPI,
  COZE_CN_BASE_URL,
  COZE_CN_BASE_WS_URL,
  WebsocketsEventType,
} from '@coze/api';
import { PcmPlayer } from '@coze/api/ws-tools';
import { Layout, Row, Col, Card, Input, List, Button } from 'antd';
import getConfig from '../../utils/config';
import Transcription, { type TranscriptionDemoRef } from './transcription';

const { TextArea } = Input;
const localStorageKey = 'realtime-transcription-demo';
const config = getConfig(localStorageKey);

const TTSWithTranscriptionDemo: React.FC = () => {
  const pcmPlayerRef = useRef<PcmPlayer>();
  const [messageList, setMessageList] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const transcriptionRef = useRef<TranscriptionDemoRef>(null);
  const clientRef = useRef<CozeAPI | null>();
  const wsChatClientRef = useRef<WebSocketAPI<
    CreateChatWsReq,
    CreateChatWsRes
  > | null>();
  async function initClient() {
    const client = new CozeAPI({
      token: config.getPat(),
      baseURL: COZE_CN_BASE_URL,
      baseWsURL: COZE_CN_BASE_WS_URL,
      allowPersonalAccessTokenInBrowser: true,
    });
    clientRef.current = client;
  }
  async function handleSendMessage(message?: string) {
    if (transcriptionRef.current?.isRecording) {
      transcriptionRef.current?.handlePauseAndResume();
    }
    const text = inputText || message;
    if (!text) {
      return false;
    }
    if (!pcmPlayerRef.current) {
      pcmPlayerRef.current = new PcmPlayer({
        onCompleted: () => void 0,
      });
    }
    pcmPlayerRef.current.interrupt();
    pcmPlayerRef.current.init();
    closeWsChatClient();
    if (!clientRef.current) {
      await initClient();
    }
    const ws = await clientRef.current!.websockets.chat.create({
      bot_id: config.getBotId(),
      workflow_id: config.getWorkflowId(),
    });
    wsChatClientRef.current = ws;
    ws.onopen = () => {
      ws.send({
        id: '1',
        event_type: WebsocketsEventType.CHAT_UPDATE,
        data: {
          chat_config: {
            auto_save_history: true,
          },
          output_audio: {
            voice_id: config.getVoiceId(),
          },
          input_audio: {
            format: 'pcm',
            codec: 'pcm',
            sample_rate: 24000,
            channel: 1,
            bit_depth: 16,
          },
        },
      });
    };
    let lastEventName: string = '';
    ws.onmessage = (data: CreateChatWsRes, event) => {
      if (data.event_type === WebsocketsEventType.ERROR) {
        if (data.data.code === 4100) {
          console.error('[chat] Unauthorized Error', data);
        } else if (data.data.code === 4101) {
          console.error('[chat] Forbidden Error', data);
        } else {
          console.error('[chat] WebSocket error', data);
        }
        ws.close();
        return;
      }
      if (
        [
          WebsocketsEventType.CONVERSATION_MESSAGE_DELTA,
          WebsocketsEventType.CONVERSATION_MESSAGE_COMPLETED,
        ].includes(data.event_type)
      ) {
        const { content } = (data as ConversationMessageDeltaEvent).data;
        setMessageList(prev => {
          // 如果上一个事件是增量更新，则附加到最后一条消息
          if (
            lastEventName === WebsocketsEventType.CONVERSATION_MESSAGE_DELTA &&
            data.event_type === WebsocketsEventType.CONVERSATION_MESSAGE_DELTA
          ) {
            return prev
              .slice(0, -1)
              .concat([(prev[prev.length - 1] || '') + content]);
          }
          lastEventName = data.event_type;
          // 否则添加新消息
          if (
            data.event_type === WebsocketsEventType.CONVERSATION_MESSAGE_DELTA
          ) {
            return prev.concat([content]);
          }
          return prev;
        });
      }
      if (data.event_type === WebsocketsEventType.CONVERSATION_CHAT_FAILED) {
        return;
      }
      if (data.event_type === WebsocketsEventType.CONVERSATION_AUDIO_DELTA) {
        pcmPlayerRef.current!.append(data.data.content);
      } else if (
        [
          WebsocketsEventType.CONVERSATION_CHAT_COMPLETED,
          WebsocketsEventType.TRANSCRIPTIONS_MESSAGE_COMPLETED,
          WebsocketsEventType.SPEECH_AUDIO_COMPLETED,
        ].includes(data.event_type)
      ) {
        closeWsChatClient();
      }
    };
    ws.onerror = (error, event) => {
      ws.close();
    };
    ws.onclose = () => {};
    ws.send({
      id: 'event_id',
      event_type: WebsocketsEventType.CONVERSATION_MESSAGE_CREATE,
      data: {
        role: 'user', // user/assistant
        content_type: 'object_string', // text/object_string
        content: `[{"type":"text","text":"${text}"}]`,
      },
    });
    setInputText('');
  }
  function closeWsChatClient() {
    if (
      wsChatClientRef.current &&
      wsChatClientRef.current.readyState === WebSocket.OPEN
    ) {
      wsChatClientRef.current.close();
      wsChatClientRef.current = null;
    }
  }

  return (
    <Layout style={{ height: '100%' }}>
      <Layout.Content>
        <Row align="stretch" justify="start" gutter={[16, 16]}>
          <Col
            xs={24}
            md={12}
            style={{ background: '#fff', padding: '20px 20px' }}
          >
            <Card
              title="实时语音回复"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '10px',
              }}
            >
              <List
                dataSource={messageList}
                renderItem={(message, index) => (
                  <List.Item key={index} style={{ textAlign: 'left' }}>
                    {message}
                  </List.Item>
                )}
              />
            </Card>
            <Card
              title="文本输入"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '10px',
                marginTop: '20px',
              }}
            >
              <TextArea
                rows={4}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="请输入要发送的文本"
                style={{ marginBottom: '16px' }}
                onPressEnter={() => handleSendMessage()}
              />
              <Button
                size="large"
                disabled={!inputText}
                onClick={() => handleSendMessage()}
              >
                发送
              </Button>
            </Card>
            <Card
              title="控制"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '10px',
                marginTop: '20px',
              }}
            >
              <Button
                size="large"
                onClick={() => {
                  pcmPlayerRef.current?.interrupt();
                }}
              >
                打断
              </Button>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Transcription
              ref={transcriptionRef}
              useByTTS={true}
              onSendMessage={handleSendMessage}
              onRecording={isRecording => {
                if (isRecording) {
                  pcmPlayerRef.current?.interrupt();
                }
              }}
            />
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
};
export default TTSWithTranscriptionDemo;
