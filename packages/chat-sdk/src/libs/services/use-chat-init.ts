import { useEffect, useState } from "react";
import { convertToMinChatError, logger, MiniChatErrorCode } from "@/libs/utils";
import {
  useApiClientStore,
  useChatPropsContext,
  useChatInfoStore,
} from "@/libs/provider";
import { IChatService, type ChatFrameworkProps } from "@/libs/types";
import { MiniChatError } from "@/libs/utils";
import { useConversationStore } from "../provider/context/chat-store-context";
export const useChatInit = () => {
  const chatProps = useChatPropsContext();
  const {
    setChatError,
    setChatInfo,
    setChatIsLoading,
    error: chatError,
  } = useChatInfoStore((store) => ({
    setChatError: store.setError,
    setChatInfo: store.setChatInfo,
    setChatIsLoading: store.setIsLoading,
    setCustomChatInfo: store.setCustomChatInfo,
    isLoadingChatInfo: store.isLoading,
    error: store.error,
  }));
  const setConversationDetail = useConversationStore(
    (store) => store.setConversationDetail
  );
  const chatService = useApiClientStore((store) => store.chatService);
  const [retryTime, setRetryTime] = useState(0);
  useEffect(() => {
    if (!checkParams(chatProps)) {
      setChatError(new MiniChatError(-1, "params error"));
      return;
    }
    let isAbort = false;
    setChatError(null);
    setChatIsLoading(true);
    (async () => {
      try {
        const [chatInfo, conversationDetail] = await Promise.all([
          chatService.getAppInfo(),
          getInitConversationDetail(chatService),
        ]);
        if (!isAbort) {
          setConversationDetail(
            conversationDetail,
            conversationDetail.messages
          );
          setChatInfo(chatInfo);
        }
      } catch (err) {
        logger.error("get chat info error", err);
        const miniChatError = convertToMinChatError(err);
        setChatError(miniChatError);
      }
    })();
    return () => {
      isAbort = true;
    };
  }, [retryTime, chatService]);
  return {
    retryChatInit: () => {
      if (chatError) {
        setRetryTime(retryTime + 1);
      }
    },
  };
};

/*
 * @param chatProps - The chat props.
 * @returns A boolean value.
 */
function checkParams(chatProps: ChatFrameworkProps) {
  if (!chatProps?.setting?.apiBaseUrl) {
    logger.error("Setting's apiBaseUrl must be provided");
    return false;
  }
  if (!chatProps?.setting?.cdnBaseUrlPath) {
    logger.warn(
      "Setting's cdnBaseUrlPath is not provided; The chat will show a crash image"
    );
  }
  if (!chatProps?.chat?.appId) {
    logger.error("Chat's appId must be provided");
    return false;
  }
  if (!chatProps?.auth?.token) {
    logger.error("Token  must be provided");
    return false;
  }

  if (!chatProps?.auth?.onRefreshToken) {
    logger.warn(
      "onRefreshToken is not provided; The chat will not be able to refresh the token"
    );
  }
  if (
    !chatProps?.user?.id ||
    !chatProps?.user?.name ||
    !chatProps?.user?.avatar
  ) {
    logger.warn(
      "User's property (id, name, avatar) is empty; The chat will show a default user"
    );
    return true;
  }

  return true;
}

/*
 * Get the initial conversation detail
 * @param chatService - The chat service to use.
 * @returns The conversation detail(conversationId, sectionId, messages)
 */
async function getInitConversationDetail(chatService: IChatService) {
  let conversationId = "";
  let sectionId = "";
  try {
    const res = await chatService.getOrCreateConversationId();
    conversationId = res.conversationId;
    sectionId = res.sectionId;
  } catch (error) {
    logger.error("Get Message Error", error);
    const apiError = convertToMinChatError(error);
    throw new MiniChatError(
      apiError.code || MiniChatErrorCode.Custom_Conversation_Create_Error,
      apiError.msg || "Conversation Create Error"
    );
  }
  try {
    const messageListRes = await chatService.getMessageList({
      conversationId,
    });
    return {
      id: conversationId,
      sectionId,
      ...messageListRes,
    };
  } catch (err) {
    throw new MiniChatError(
      MiniChatErrorCode.Custom_GetMessageList_Error,
      "Get MessageList Error"
    );
  }
}
