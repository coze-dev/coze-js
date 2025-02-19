import { useCallback } from "react";

import { useApiClientStore } from "@/libs/provider";
import { showToast } from "@/libs/utils";
import {
  useConversationStore,
  useChatStatusStore,
  useChatInfoStore,
  useI18n,
  useUiEventStore,
} from "../provider/context/chat-store-context";
export const useClearMessage = () => {
  const { setNewConversationId, setSectionId } = useConversationStore(
    (store) => ({
      setNewConversationId: store.setNewConversationId,
      setSectionId: store.setSectionId,
    })
  );
  const i18n = useI18n();
  const appId = useChatInfoStore((store) => store.id);
  const { getOpDisabledState, setIsDeleting } = useChatStatusStore((store) => ({
    setIsDeleting: store.setIsDeleting,
    getOpDisabledState: store.getOpDisabledState,
  }));
  const targetEventCenter = useUiEventStore((store) => store.event);

  const chatService = useApiClientStore((store) => store.chatService);

  const clearMessage = useCallback(async () => {
    const { clearMessage: disableState } = getOpDisabledState();
    if (disableState) {
      return;
    }
    setIsDeleting(true);
    try {
      const { conversationId, sectionId } =
        await chatService.createNewConversation();
      setNewConversationId(conversationId);
      setSectionId(sectionId);
    } catch (err) {
      showToast(
        {
          content: i18n.t("clearMessageFailed"),
          icon: "error",
        },
        targetEventCenter
      );
    }
    setIsDeleting(false);
  }, [appId, targetEventCenter]);

  return {
    clearMessage,
  };
};
