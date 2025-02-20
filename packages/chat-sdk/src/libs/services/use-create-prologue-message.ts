import { useCallback, useMemo } from 'react';

import { RoleType } from '@coze/api';

import { ChatMessage, ChatMessageGroup } from '@/libs/types';
import {
  useConversationStore,
  useChatInfoStore,
  useUserInfoStore,
} from '@/libs/provider';

import { nanoid } from '../utils';
export const useCreatePrologueMessage = (
  nextSectionId?: string,
): ChatMessageGroup | null => {
  const { chatInfo } = useChatInfoStore(store => ({
    chatInfo: store.info,
  }));
  const { conversationId } = useConversationStore(store => ({
    conversationId: store.id,
  }));

  const { userInfo } = useUserInfoStore(store => ({
    userInfo: store.info,
  }));
  const createAnswerMessage = useCallback(
    (type: 'answer' | 'follow_up', content: string): ChatMessage => ({
      id: '',
      conversation_id: conversationId || '',
      section_id: nextSectionId || '',
      bot_id: chatInfo?.appId || '',
      chat_id: '',
      role: RoleType.Assistant,

      type,
      localId: nanoid(),
      meta_data: {},
      content_type: 'text',
      created_at: 0,
      updated_at: 0,
      content,
    }),
    [conversationId, nextSectionId, chatInfo],
  );
  const localId = useMemo(() => nanoid(), []);
  const chatMessage: ChatMessage[] = useMemo(
    () => [
      createAnswerMessage(
        'answer',
        (chatInfo?.onboarding_info?.prologue || '').replaceAll(
          '{{user_name}}',
          userInfo?.name || '',
        ),
      ),
      ...(chatInfo?.onboarding_info?.suggested_questions || []).map(item =>
        createAnswerMessage('follow_up', item),
      ),
    ],
    [chatInfo, conversationId, createAnswerMessage, userInfo],
  );
  const chatGroup = useMemo(
    () => ({
      id: localId,
      chatId: '',
      respMessages: chatMessage,
      sectionId: nextSectionId,
      isPrologue: true,
    }),
    [chatMessage, localId, nextSectionId],
  );
  return chatInfo?.onboarding_info?.prologue &&
    chatInfo?.onboarding_info?.prologue !== '\n' // chatflow里边 默认会有一个\n
    ? chatGroup
    : null;
};
