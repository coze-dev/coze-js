import { useCallback, useRef, useState } from 'react';

import {
  ChatEventType,
  type ChatV3Message,
  CozeAPI,
  type EnterMessage,
  RoleType,
} from '@coze/api';

import { WavStreamPlayer } from '../../lib/wavtools';
import { config } from './config';

const wavStreamPlayer = new WavStreamPlayer({ sampleRate: 24000 });

const useCozeAPI = () => {
  const [content, setContent] = useState('');
  const [client, setClient] = useState<CozeAPI | null>(null);
  const isConnected = useRef(false);
  const trackId = useRef('my-track');

  const initClient = () => {
    const baseUrl = config.getBaseUrl();
    const pat = config.getPat();
    setClient(
      new CozeAPI({
        token: pat,
        baseURL: baseUrl,
        allowPersonalAccessTokenInBrowser: true,
      }),
    );
  };

  const streamingChat = async (query: string) => {
    if (!client) {
      return;
    }

    const voiceFileId = config.getVoiceFileId();
    const botId = config.getBotId();
    trackId.current = `my-track-${new Date().getTime()}`;

    const messages: EnterMessage[] = [
      {
        role: RoleType.User,
        type: 'question',
        content: [
          {
            type: 'audio',
            file_id: voiceFileId,
          },
          {
            type: 'text',
            text: query,
          },
        ],
        content_type: 'object_string',
      },
    ];

    const v = await client.chat.stream({
      bot_id: botId,
      auto_save_history: true,

      additional_messages: messages,
    });

    let msg = '';

    for await (const part of v) {
      if (part.event === ChatEventType.CONVERSATION_CHAT_CREATED) {
        console.log('[START]');
      } else if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
        msg += part.data.content;

        setContent(msg);
      } else if (part.event === ChatEventType.CONVERSATION_MESSAGE_COMPLETED) {
        const { role, type, content: msgContent } = part.data;
        if (role === 'assistant' && type === 'answer') {
          msg += '\n';
          setContent(msg);
        } else {
          console.log('[%s]:[%s]:%s', role, type, msgContent);
        }
      } else if (part.event === ChatEventType.CONVERSATION_CHAT_COMPLETED) {
        console.log(part.data.usage);
      } else if (part.event === ChatEventType.CONVERSATION_AUDIO_DELTA) {
        // handle audio message
        handleAudioMessage(part.data);
      } else if (part.event === ChatEventType.DONE) {
        console.log(part.data);
      }
    }
    console.log('=== End of Streaming Chat ===');
  };

  const handleAudioMessage = useCallback(async (data: ChatV3Message) => {
    // Connect to audio output
    if (!isConnected.current) {
      isConnected.current = true;
      await wavStreamPlayer.connect();
    }

    const decodedContent = atob(data.content);
    const arrayBuffer = new ArrayBuffer(decodedContent.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < decodedContent.length; i++) {
      view[i] = decodedContent.charCodeAt(i);
    }

    wavStreamPlayer.add16BitPCM(arrayBuffer, trackId.current);
  }, []);

  const interruptAudio = useCallback(() => {
    wavStreamPlayer.interrupt();
  }, []);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!client) {
        throw new Error('Client not initialized');
      }
      const res = await client?.files.upload({
        file,
      });
      return res;
    },
    [client],
  );

  return {
    content,
    setContent,
    client,
    initClient,
    streamingChat,
    interruptAudio,
    uploadFile,
  };
};

export default useCozeAPI;
