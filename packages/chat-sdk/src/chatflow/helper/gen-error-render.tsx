import { Spacing } from '@/libs/ui-kit';
import { ChatErrorDefault, IMiniChatError } from '@/libs';

import { IChatFlowProps } from '../type';
export const genErrorRender = (props: IChatFlowProps) => {
  if (!props?.areaUi?.input?.renderChatInputTopSlot) {
    return undefined;
  }
  return (_error?: IMiniChatError, retryChatInit?: () => void) => (
    <Spacing width100 height100 vertical>
      <Spacing width100 height100 flex1>
        <ChatErrorDefault retryChatInit={retryChatInit} />
      </Spacing>
      {props?.areaUi?.input?.renderChatInputTopSlot?.()}
    </Spacing>
  );
};
