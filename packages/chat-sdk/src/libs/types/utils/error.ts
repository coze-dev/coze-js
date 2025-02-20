import { II18n } from './i18n';

export interface IMiniChatError {
  readonly code: number;
  readonly msg: string;
  getErrorMessageByI18n: (i18n: II18n) => string;
}
