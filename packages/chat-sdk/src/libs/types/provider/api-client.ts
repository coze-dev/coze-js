import { CozeAPI } from "@coze/api";
import { IChatService } from "../services/chat-service";
import { AuthConf, SettingInfo, ChatInfo } from "@/libs/types/base";
interface ApiClientState {
  connectorId: string;
  apiClient: CozeAPI;
  chatService: IChatService;
}

interface ApiClientAction {}

export interface ApiCreateStoreProps {
  auth: AuthConf;
  setting?: SettingInfo;
  chat: ChatInfo;
}
export type ApiClientStore = ApiClientState & ApiClientAction;
