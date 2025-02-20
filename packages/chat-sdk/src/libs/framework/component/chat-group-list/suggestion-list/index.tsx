import { FC } from 'react';

import type { ChatV3Message } from '@coze/api';

import { SuggestionList as SuggestionListUi } from '@/libs/ui-kit';
import { useSendMessage } from '@/libs/services';

export const SuggestionList: FC<{
  messages: ChatV3Message[];
}> = ({ messages }) => {
  const { sendTextMessage } = useSendMessage();
  return (
    <SuggestionListUi
      suggestions={messages.map(item => item.content)}
      onClickSuggestion={sendTextMessage}
    />
  );
};
