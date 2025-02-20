import { CozeAPI } from '@coze/api';

import { AuthConf, SettingInfo, ChatInfo } from '@/libs/types/base';

import { IChatService } from '../services/chat-service';
interface ApiClientState {
  connectorId: string;
  apiClient: CozeAPI;
  chatService: IChatService;
}

export interface ApiCreateStoreProps {
  auth: AuthConf;
  setting?: SettingInfo;
  chat: ChatInfo;
}
export type ApiClientStore = ApiClientState & {
  getSetting: () => SettingInfo | undefined;
};
