import { ContentType } from '@coze/api';

import { MessageUiConfigMap, type ChatMessage } from '@/libs/types';

import { extractChatflowMessage } from './extract-chatlow-message';

export const isSupportAnswerMessage = (
  item: ChatMessage,
  messageUiMap?: MessageUiConfigMap,
) => {
  const chatflowNode = extractChatflowMessage(item);
  const contentType: ContentType | 'chatflow_node' = chatflowNode
    ? 'chatflow_node'
    : item.content_type;
  if (item.type !== 'answer') {
    return false;
  }

  if (messageUiMap?.[contentType]?.isSupportMessage) {
    return messageUiMap?.[contentType]?.isSupportMessage?.(item);
  }
  if (!item.content && !item.reasoning_content) {
    return false;
  }
  if (!['object_string', 'text', 'chatflow_node'].includes(contentType)) {
    return false;
  }

  return true;
};
