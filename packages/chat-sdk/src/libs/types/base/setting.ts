import type { II18n, Language } from "../utils/i18n";
import {
  type IChatService,
  type ChatServiceProps,
} from "../services/chat-service";
export type LogLevel = "debug" | "release";
export interface SettingInfo {
  // 请求用户数据的baseUrl，如果未传递，将使用region来获取默认的apiBaseUrl.
  apiBaseUrl: string;

  /*
    va: https://sf16-va.tiktokcdn.com/obj/eden-va2/rkzild_lgvj/ljhwZthlaukjlkulzlp/
    sg: https://sf16-sg.tiktokcdn.com/obj/eden-sg/rkzild_lgvj/ljhwZthlaukjlkulzlp/
    cn: https://lf3-static.bytednsdoc.com/obj/eden-cn/rkzild_lgvj/ljhwZthlaukjlkulzlp/
  */
  cdnBaseUrlPath: string;

  onGetCustomChatService?: (props: ChatServiceProps) => IChatService;
  i18n?: II18n;
  language?: Language;
  requestHeader?: Record<string, string>;
  logLevel?: LogLevel;
}
