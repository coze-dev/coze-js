import { SvgConversation, IconButton } from "@/libs/ui-kit";

import { FC, useMemo } from "react";
import { DisableContainer } from "@/libs/ui-kit/atomic/disable-container";
import { useClearContext } from "@/libs/services";
import { useChatStatusStore, useConversationStore } from "@/libs/provider";

export const ClearContext: FC<{
  type?: "circle-btn" | "square-hover-btn";
  svgTheme?: "dark" | "light";
}> = ({ type = "circle-btn", svgTheme }) => {
  const { clearContext } = useClearContext();
  const { clearContext: clearContextDisableState } = useChatStatusStore(
    (store) => store.disableState
  );

  const { sectionId, chatMessageGroups } = useConversationStore((store) => ({
    sectionId: store.sectionId,
    chatMessageGroups: store.chatMessageGroups,
  }));
  const isCanUser = useMemo(() => {
    if (chatMessageGroups.length === 0) {
      return false;
    }
    if (
      sectionId &&
      chatMessageGroups[chatMessageGroups.length - 1]?.sectionId
    ) {
      if (
        sectionId !== chatMessageGroups[chatMessageGroups.length - 1]?.sectionId
      ) {
        return false;
      }
    }
    return true;
  }, [sectionId, chatMessageGroups]);
  return (
    <DisableContainer disabled={clearContextDisableState || !isCanUser}>
      <IconButton
        onClick={clearContext}
        type={type}
        hoverTheme={svgTheme === "light" ? "none" : "hover"}
        bgColor="bold"
      >
        <SvgConversation theme={svgTheme} />
      </IconButton>
    </DisableContainer>
  );
};
