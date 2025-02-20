import type { II18n, IMiniChatError } from '@/libs/types';
export class MiniChatError extends Error implements IMiniChatError {
  readonly code: number;
  readonly msg: string;
  constructor(code: number, msg: string) {
    super(msg);
    this.code = code;
    this.msg = msg;
  }
  getErrorMessageByI18n(
    i18n: II18n,
    options?: Record<string, unknown>,
    fallbackText?: string,
  ) {
    return i18n.t(
      `miniChatError_${this.code}`,
      options,
      fallbackText || this.msg,
    );
  }
}

export const convertToMinChatError = (error: unknown) => {
  const miniChatError = error as MiniChatError;
  return new MiniChatError(
    miniChatError?.code || -1,
    miniChatError?.msg ||
      miniChatError?.message ||
      miniChatError?.stack ||
      'unknown error',
  );
};

export enum MiniChatErrorCode {
  Unknown = -1,

  Audio_Permission_Denied = 1000,
  Audio_Translation_NoContent = 1001,
  Custom_Conversation_Create_Error = 1002,
  Custom_GetMessageList_Error = 10003,
  SDK_API_OVERDUE_PAYMENT = 4011,
  SDK_API_APP_UnPublished = 4015,
}
