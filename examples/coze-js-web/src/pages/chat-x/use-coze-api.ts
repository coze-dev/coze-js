import { useCallback, useRef, useState } from 'react';

import {
  type BotInfo,
  ChatEventType,
  COZE_CN_BASE_WS_URL,
  CozeAPI,
  type CreateChatData,
  type EnterMessage,
  type FileObject,
  RoleType,
} from '@coze/api';

import { config } from './config';

const useCozeAPI = () => {
  const clientRef = useRef<CozeAPI | null>(null);
  const [botInfo, setBotInfo] = useState<BotInfo | undefined>();

  const fileInfoRef = useRef<FileObject | undefined>();
  const [uploading, setUploading] = useState(false);

  const initClient = () => {
    const baseUrl = config.getBaseUrl();
    const pat = config.getPat();
    clientRef.current = new CozeAPI({
      token: pat,
      baseURL: baseUrl,
      allowPersonalAccessTokenInBrowser: true,
      baseWsURL: COZE_CN_BASE_WS_URL,
      debug: false,
    });
  };

  const createMessage = (
    query: string,
    fileInfo?: FileObject,
  ): EnterMessage[] => {
    const baseMessage: EnterMessage = {
      role: RoleType.User,
      type: 'question',
    };

    if (fileInfo) {
      return [
        {
          ...baseMessage,
          content: [
            { type: 'text', text: query },
            { type: 'file', file_id: fileInfo.id },
          ],
          content_type: 'object_string',
        },
      ];
    }

    return [
      {
        ...baseMessage,
        content: [{ type: 'text', text: query }],
        content_type: 'text',
      },
    ];
  };

  const streamingChat = async ({
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
    if (!clientRef.current) {
      return;
    }

    const botId = config.getBotId();
    const messages = createMessage(query, fileInfoRef.current);

    const v = await clientRef.current.chat.stream({
      bot_id: botId,
      auto_save_history: true,
      additional_messages: messages,
      conversation_id: conversationId,
    });

    let msg = '';

    for await (const part of v) {
      if (part.event === ChatEventType.CONVERSATION_CHAT_CREATED) {
        console.log('[START]');
        onCreated(part.data);
      } else if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
        msg += part.data.content;

        onUpdate(msg);
      } else if (part.event === ChatEventType.CONVERSATION_MESSAGE_COMPLETED) {
        const { role, type, content: msgContent } = part.data;
        if (role === 'assistant' && type === 'answer') {
          msg += '\n';
          onSuccess(msg);
        } else {
          console.log('[%s]:[%s]:%s', role, type, msgContent);
        }
      } else if (part.event === ChatEventType.CONVERSATION_CHAT_COMPLETED) {
        console.log(part.data.usage);
      } else if (part.event === ChatEventType.DONE) {
        console.log(part.data);
      }
    }
    console.log('=== End of Streaming Chat ===');
  };

  const uploadFile = useCallback(async (file?: File) => {
    if (!clientRef.current) {
      throw new Error('Client not initialized');
    }
    if (!file) {
      fileInfoRef.current = undefined;
      return;
    }
    setUploading(true);
    const res = await clientRef.current.files
      .upload({
        file,
      })
      .finally(() => {
        setUploading(false);
      });
    fileInfoRef.current = res;
  }, []);

  const getBotInfo = async () => {
    if (!clientRef.current) {
      return;
    }
    const res = await clientRef.current.bots.retrieve({
      bot_id: config.getBotId(),
    });
    setBotInfo(res);
  };

  return {
    clientRef,
    initClient,
    streamingChat,
    uploadFile,
    getBotInfo,
    botInfo,
    uploading,
  };
};

export default useCozeAPI;
