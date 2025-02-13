import { type MutableRefObject, useCallback, useEffect, useRef } from 'react';

import {
  type CozeAPI,
  type CreateChatData,
  type CreateChatWsReq,
  type CreateChatWsRes,
  type CreateSpeechWsReq,
  type CreateSpeechWsRes,
  type CreateTranscriptionsWsReq,
  type CreateTranscriptionsWsRes,
  type WebSocketAPI,
  WebsocketsEventType,
} from '@coze/api';

import { WavRecorder, WavStreamPlayer } from '../../lib/wavtools';
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
  const speechRef = useRef<WebSocketAPI<
    CreateSpeechWsReq,
    CreateSpeechWsRes
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
        if (data.event_type === WebsocketsEventType.ERROR) {
          if (data.data.code === 4100) {
            console.error('Unauthorized Error', data);
          } else if (data.data.code === 4101) {
            console.error('Forbidden Error', data);
          } else {
            console.error('WebSocket error', data);
          }
          ws.close();
          return;
        }
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
        console.error('[transcriptions] WebSocket error', error, event);

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
    if (
      transcriptionsRef.current &&
      transcriptionsRef.current.readyState === WebSocket.OPEN
    ) {
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
              handleAudioMessage(data.data.content);
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
            console.error('[chat] WebSocket error', error);
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
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const initSpeechWs = useCallback(
    async (onMessage?: (data: CreateSpeechWsRes) => void) => {
      closeSpeechWs();
      if (!clientRef.current) {
        return;
      }
      const ws = await clientRef.current.websockets.audio.speech.create();

      return new Promise<WebSocketAPI<CreateSpeechWsReq, CreateSpeechWsRes>>(
        (resolve, reject) => {
          ws.onopen = () => {
            console.log('[speech] ws open');

            resolve(ws);
          };

          ws.onmessage = (data, event) => {
            if (data.event_type === WebsocketsEventType.ERROR) {
              if (data.data.code === 4100) {
                console.error('Unauthorized Error', data);
              } else if (data.data.code === 4101) {
                console.error('Forbidden Error', data);
              } else {
                console.error('WebSocket error', data);
              }
              ws.close();
              return;
            }
            console.log('[transcriptions] ws message', data);

            onMessage?.(data);
          };

          ws.onerror = (error, event) => {
            console.error('[speech] WebSocket error', error, event);

            ws.close();

            reject(error);
          };

          ws.onclose = () => {
            console.log('[speech] ws close');
          };

          speechRef.current = ws;
        },
      );
    },
    [],
  );

  const closeSpeechWs = () => {
    if (speechRef.current && speechRef.current.readyState === WebSocket.OPEN) {
      speechRef.current.close();
    }
    speechRef.current = null;
  };

  const handleAudioMessage = useCallback(async (message: string) => {
    const decodedContent = atob(message);
    const arrayBuffer = new ArrayBuffer(decodedContent.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < decodedContent.length; i++) {
      view[i] = decodedContent.charCodeAt(i);
    }

    await wavStreamPlayer.add16BitPCM(arrayBuffer, trackId.current);
  }, []);

  const startChat = useCallback(async () => {
    interruptAudio();

    await initWs({});
    await wavRecorder.begin(deviceListRef.current[0].deviceId);

    // init stream player
    await wavStreamPlayer.add16BitPCM(new ArrayBuffer(0), trackId.current);

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

  const startTranscriptions = useCallback(async () => {
    interruptAudio();
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

  const stopTranscriptions = useCallback(async () => {
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
    wavStreamPlayer.interrupt();
    trackId.current = `my-track-${new Date().getTime()}`;
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
      interruptAudio();

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
              WebsocketsEventType.CONVERSATION_MESSAGE_COMPLETED &&
            data.data.type === 'answer'
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

  const startSpeech = useCallback(async (message: string) => {
    // interrupt audio if it's playing
    interruptAudio();

    await initSpeechWs(data => {
      if (data.event_type === WebsocketsEventType.SPEECH_AUDIO_COMPLETED) {
        console.log('[speech] ws transcriptions completed', data);
        closeSpeechWs();
      }
      if (data.event_type === WebsocketsEventType.SPEECH_AUDIO_UPDATE) {
        handleAudioMessage(data.data.delta);
      }
    });

    // See https://bytedance.larkoffice.com/docx/Uv6Wd8GTjoEex3xyq4YcxDnRnkc#HrVcdpW4Oo3A25xCQIDcGBlknOc
    speechRef.current?.send({
      id: '1',
      event_type: WebsocketsEventType.SPEECH_UPDATE,
      data: {
        output_audio: {
          codec: 'pcm',
          // voice_id: 'xxx',
        },
      },
    });

    speechRef.current?.send({
      id: '1',
      event_type: WebsocketsEventType.INPUT_TEXT_BUFFER_APPEND,
      data: {
        delta: message,
      },
    });
    speechRef.current?.send({
      id: '1',
      event_type: WebsocketsEventType.INPUT_TEXT_BUFFER_COMPLETE,
    });
  }, []);

  const stopSpeech = useCallback(() => {
    interruptAudio();
    closeSpeechWs();
  }, []);

  const getIsSpeech = useCallback(() => wavStreamPlayer.stream !== null, []);

  return {
    initWs,
    startChat,
    stopChat,
    interruptAudio,
    startTranscriptions,
    stopTranscriptions,
    sendWsMessage,
    startSpeech,
    stopSpeech,
    getIsSpeech,
  };
};

export default useWsAPI;
