import { FC } from 'react';

import { DisableContainer } from '@/libs/ui-kit/atomic/disable-container';
import { SvgBroom, IconButton } from '@/libs/ui-kit';
import { useClearMessage } from '@/libs/services';
import { useChatStatusStore, useConversationStore } from '@/libs/provider';

export const DeleteMessage: FC<{
  type?: 'circle-btn' | 'square-hover-btn';
  svgTheme?: 'dark' | 'light';
}> = ({ type = 'circle-btn', svgTheme }) => {
  const { clearMessage } = useClearMessage();
  const { clearMessage: clearMessageDisableState } = useChatStatusStore(
    store => store.disableState,
  );

  const { chatMessageGroups } = useConversationStore(store => ({
    sectionId: store.sectionId,
    chatMessageGroups: store.chatMessageGroups,
  }));
  const isCanUse = chatMessageGroups.length > 0;
  return (
    <DisableContainer disabled={clearMessageDisableState || !isCanUse}>
      <IconButton
        onClick={clearMessage}
        type={type}
        hoverTheme={svgTheme === 'light' ? 'none' : 'hover'}
        bgColor="bold"
      >
        <SvgBroom theme={svgTheme} />
      </IconButton>
    </DisableContainer>
  );
};
