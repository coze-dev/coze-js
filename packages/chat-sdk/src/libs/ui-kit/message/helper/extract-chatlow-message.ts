import { safeJSONParse } from '@/libs/utils';
import { type ChatMessage } from '@/libs/types';

import { ChatflowNodeData } from '../components/chatflow-node';
export const extractChatflowMessage = (
  item: ChatMessage,
): ChatflowNodeData | undefined => {
  if (item.content_type === 'card') {
    const contentStruct = safeJSONParse<{
      x_properties: {
        workflow_card_info: string;
      };
    }>(item.content);
    const workflowDataStr = contentStruct?.x_properties?.workflow_card_info;
    if (workflowDataStr) {
      const cardData = safeJSONParse<ChatflowNodeData>(workflowDataStr);
      if (cardData?.card_type === 'QUESTION' && cardData?.question_card_data) {
        return cardData;
      }
      if (cardData?.card_type === 'INPUT' && cardData?.input_card_data) {
        return cardData;
      }
    }
  }
  return undefined;
};
