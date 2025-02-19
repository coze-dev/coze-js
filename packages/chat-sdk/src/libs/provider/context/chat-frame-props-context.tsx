import { createContext, FC } from "react";

import { type ChatFrameworkProps, type NullableType } from "@/libs/types";
import { useValidContext } from "@/libs/hooks";
export type NullChatFrameworkProps = NullableType<ChatFrameworkProps>;
const ChatFramePropsContext = createContext<NullChatFrameworkProps>({
  chat: null,
  auth: null,
  user: null,
  children: null,
  setting: null,
});
export const ChatFamePropsProvider: FC<NullChatFrameworkProps> = ({
  children,
  ...props
}) => <ChatFramePropsContext.Provider value={props} children={children} />;
export const useChatPropsContext = () =>
  useValidContext<ChatFrameworkProps>(ChatFramePropsContext);
