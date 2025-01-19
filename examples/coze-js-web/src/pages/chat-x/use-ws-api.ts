import { type MutableRefObject, useCallback, useEffect, useRef } from 'react';

import {
  type ConversationAudioDeltaEvent,
  type CozeAPI,
  type CreateChatData,
  type CreateChatWsReq,
  type CreateChatWsRes,
  type CreateTranscriptionsWsReq,
  type CreateTranscriptionsWsRes,
  type WebSocketAPI,
  WebsocketsEventType,
} from '@coze/api';

import { WavRecorder } from '../../lib/wavtools';
import { config } from './config';

const wavRecorder = new WavRecorder({ sampleRate: 24000 });
const wavStreamPlayer = new WavStreamPlayer({ sampleRate: 24000 });

const useWsAPI = (
  clientRef: MutableRefObject<CozeAPI | null>,
  onTranscription: (data: CreateTranscriptionsWsRes) => void,
) => {
  const wsRef = useRef<WebSocketAPI<CreateChatWsReq, CreateChatWsRes> | null>(
    null,
  );
  const transcriptionsRef = useRef<WebSocketAPI<
    CreateTranscriptionsWsReq,
    CreateTranscriptionsWsRes
  > | null>(null);
  const isConnected = useRef(false);
  const trackId = useRef('my-track');
  const deviceListRef = useRef<MediaDeviceInfo[]>([]);
  const eventSetRef = useRef<Set<string>>();

  useEffect(() => {
    // Listen for device change; e.g. if somebody disconnects a microphone
    // deviceList is array of MediaDeviceInfo[] + `default` property
    wavRecorder.listenForDeviceChange((deviceList: MediaDeviceInfo[]) => {
      console.log('deviceList', deviceList);
      deviceListRef.current = deviceList;
    });
  }, []);

  const initTranscriptionsWs = useCallback(async () => {
    closeTranscriptionsWs();
    if (!clientRef.current) {
      return;
    }
    const ws = await clientRef.current.websockets.audio.transcriptions.create();

    return new Promise<
      WebSocketAPI<CreateTranscriptionsWsReq, CreateTranscriptionsWsRes>
    >((resolve, reject) => {
      ws.onopen = () => {
        console.log('[transcriptions] ws open');

        ws.send({
          id: '1',
          event_type: WebsocketsEventType.TRANSCRIPTIONS_UPDATE,
          data: {
            input_audio: {
              format: 'pcm',
              codec: 'pcm',
              sample_rate: 24000,
              channel: 1,
              bit_depth: 16,
            },
          },
        });

        resolve(ws);
      };

      ws.onmessage = (data, event) => {
        console.log('[transcriptions] ws message', data);
        if (
          data.event_type ===
          WebsocketsEventType.TRANSCRIPTIONS_MESSAGE_COMPLETED
        ) {
          console.log('[transcriptions] ws transcriptions completed', data);
          closeTranscriptionsWs();
        }
        onTranscription(data);
      };

      ws.onerror = (error, event) => {
        if (error.data.code === 401) {
          console.error('[transcriptions] Unauthorized Error', error, event);
        } else if (error.data.code === 403) {
          console.error('[transcriptions] Forbidden Error', error, event);
        } else {
          console.error('[transcriptions] WebSocket error', error, event);
        }

        ws.close();

        reject(error);
      };

      ws.onclose = () => {
        console.log('[transcriptions] ws close');
      };

      transcriptionsRef.current = ws;
    });
  }, []);

  const closeTranscriptionsWs = () => {
    if (transcriptionsRef.current) {
      transcriptionsRef.current.close(1000, 'close');
      transcriptionsRef.current = null;
    }
  };

  const initWs = useCallback(
    async ({
      conversationId,
      onMessage,
    }: {
      conversationId?: string;
      onMessage?: (data: CreateChatWsRes) => void;
    }) => {
      closeWs();

      if (!isConnected.current) {
        await wavStreamPlayer.connect();
        console.log('wavStreamPlayer.connect');
        isConnected.current = true;
      }
      if (!clientRef.current) {
        return;
      }
      const ws = await clientRef.current.websockets.chat.create(
        config.getBotId(),
      );
      return new Promise<WebSocketAPI<CreateChatWsReq, CreateChatWsRes>>(
        (resolve, reject) => {
          ws.onopen = () => {
            console.log('[chat] ws open');

            ws.send({
              id: '1',
              event_type: WebsocketsEventType.CHAT_UPDATE,
              data: {
                chat_config: {
                  conversation_id: conversationId,
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

            resolve(ws);
          };

          ws.onmessage = (data, event) => {
            onMessage?.(data);
            console.log('[chat] ws message', data);
            eventSetRef.current?.add(data.event_type);

            if (
              data.event_type === WebsocketsEventType.CONVERSATION_CHAT_FAILED
            ) {
              console.error('[chat] ws error', data);
              // ws.close();
              return;
            }
            if (
              data.event_type === WebsocketsEventType.CONVERSATION_AUDIO_DELTA
            ) {
              handleAudioMessage(data);
            } else if (
              [
                WebsocketsEventType.CONVERSATION_CHAT_COMPLETED,
                WebsocketsEventType.TRANSCRIPTIONS_MESSAGE_COMPLETED,
                WebsocketsEventType.SPEECH_AUDIO_COMPLETED,
              ].includes(data.event_type)
            ) {
              closeWs();
              console.log('allEvent', eventSetRef.current);
            }
          };

          ws.onerror = (error, event) => {
            console.error('[chat] ws error', error, event);
            if (error.data.code === 401) {
              console.error('[chat] Unauthorized Error', error);
            } else if (error.data.code === 403) {
              console.error('[chat] Forbidden Error', error);
            } else {
              console.error('[chat] WebSocket error', error);
            }

            ws.close();

            reject(error);
          };

          ws.onclose = () => {
            console.log('[chat] ws close');
          };

          wsRef.current = ws;
        },
      );
    },
    [],
  );

  const closeWs = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const handleAudioMessage = useCallback(
    (data: ConversationAudioDeltaEvent) => {
      const decodedContent = atob(data.data.content);
      const arrayBuffer = new ArrayBuffer(decodedContent.length);
      const view = new Uint8Array(arrayBuffer);
      for (let i = 0; i < decodedContent.length; i++) {
        view[i] = decodedContent.charCodeAt(i);
      }

      wavStreamPlayer.add16BitPCM(arrayBuffer, trackId.current);
    },
    [],
  );

  const startChat = useCallback(async () => {
    await initWs({});
    await wavRecorder.begin(deviceListRef.current[0].deviceId);
    interruptAudio();
    trackId.current = `my-track-${new Date().getTime()}`;

    // await wavRecorder.clear();
    await wavRecorder.record(data => {
      const { raw } = data;

      // Convert ArrayBuffer to base64 string
      const base64String = btoa(
        Array.from(new Uint8Array(raw))
          .map(byte => String.fromCharCode(byte))
          .join(''),
      );

      // send audio to ws
      wsRef.current?.send({
        id: '1',
        event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_APPEND,
        data: {
          delta: base64String,
        },
      });
      console.log('[chat] send input_audio_buffer_append');
    });
  }, []);

  const stopChat = useCallback(async () => {
    await wavRecorder.pause();
    const finalAudio = await wavRecorder.end();
    console.log('[chat] finalAudio:', finalAudio);

    wsRef.current?.send({
      id: '1',
      event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_COMPLETE,
    });
    console.log('[chat] send input_audio_buffer_complete');
  }, []);

  const startSpeech = useCallback(async () => {
    await initTranscriptionsWs();
    await wavRecorder.begin(deviceListRef.current[0].deviceId);

    // await wavRecorder.clear();
    await wavRecorder.record(data => {
      const { raw } = data;

      // Convert ArrayBuffer to base64 string
      const base64String = btoa(
        Array.from(new Uint8Array(raw))
          .map(byte => String.fromCharCode(byte))
          .join(''),
      );

      // send audio to ws
      if (transcriptionsRef.current?.readyState === WebSocket.OPEN) {
        transcriptionsRef.current?.send({
          id: '1',
          event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_APPEND,
          data: {
            delta: base64String,
          },
        });
        console.log('[transcriptions] send input_audio_buffer_append');
      }
    });
  }, []);

  const stopSpeech = useCallback(async () => {
    if (!transcriptionsRef.current) {
      return;
    }

    transcriptionsRef.current.send({
      id: '1',
      event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_COMPLETE,
    });
    console.log('[transcriptions] send input_audio_buffer_complete');

    await wavRecorder.pause();
    const finalAudio = await wavRecorder.end();
    console.log('[transcriptions] finalAudio:', finalAudio);

    // closeTranscriptionsWs();
  }, []);

  const interruptAudio = useCallback(() => {
    // wavRecorder.clear();
    wavStreamPlayer.interrupt();
  }, []);

  const sendWsMessage = useCallback(
    async ({
      query,
      conversationId,
      onUpdate,
      onSuccess,
      onCreated,
    }: {
      query: string;
      conversationId?: string;
      onUpdate: (delta: string) => void;
      onSuccess: (delta: string) => void;
      onCreated: (data: CreateChatData) => void;
    }) => {
      let message = '';
      await initWs({
        onMessage: data => {
          if (
            data.event_type === WebsocketsEventType.CONVERSATION_CHAT_CREATED
          ) {
            onCreated?.(data.data as CreateChatData);
          } else if (
            data.event_type === WebsocketsEventType.CONVERSATION_MESSAGE_DELTA
          ) {
            message += data.data.content;
            onUpdate?.(message);
          } else if (
            data.event_type ===
            WebsocketsEventType.CONVERSATION_MESSAGE_COMPLETED
          ) {
            message += data.data.content;
            onSuccess?.(message);
          }
        },
        conversationId,
      });

      wsRef.current?.send({
        id: 'event_id',
        event_type: WebsocketsEventType.CONVERSATION_MESSAGE_CREATE,
        data: {
          role: 'user', // user/assistant
          content_type: 'object_string', // text/object_string
          content: `[{"type":"text","text":"${query}"}]`,
        },
      });
    },
    [],
  );

  return {
    initWs,
    startChat,
    stopChat,
    interruptAudio,
    startSpeech,
    stopSpeech,
    sendWsMessage,
  };
};

export default useWsAPI;
