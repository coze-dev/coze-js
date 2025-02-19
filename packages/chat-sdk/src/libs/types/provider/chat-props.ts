import type { ChatFrameworkProps } from "../framework";
interface ChatPropsAction {
  setChatProps: (props: ChatFrameworkProps) => void;
}

export type ChatPropsStore = ChatPropsAction & ChatFrameworkProps;
