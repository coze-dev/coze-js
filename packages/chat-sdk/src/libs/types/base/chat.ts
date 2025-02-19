import { BotInfo } from "@coze/api";
import type { BgImageInfoMap } from "./ui";
export enum ChatType {
  Bot = "bot",
  App = "App",
}
export interface VoiceInfo {
  isTextToVoiceEnable?: boolean;
  voiceConfigMap?: Record<
    string,
    {
      voice_id: string;
      name: string;
    }
  >;
}
export interface SuggestPromoteInfo {
  customizedSuggestPrompt?: string;
  suggestReplyMode?: number;
}
export interface ChatInfo
  extends Partial<
    Omit<
      BotInfo,
      | "bot_id"
      | "model_info"
      | "plugin_info_list"
      | "bot_mode"
      | "prompt_info"
      | "onboarding_info"
    >
  > {
  appId: string;
  type: ChatType;
  bgInfo?: BgImageInfoMap;
  onboarding_info?: {
    prologue?: string;
    display_all_suggestions?: boolean;
    suggested_questions?: string[];
  };
  suggestPromoteInfo?: SuggestPromoteInfo;
  voiceInfo?: VoiceInfo;
  inputMode?: {
    default?: number;
  };
}
