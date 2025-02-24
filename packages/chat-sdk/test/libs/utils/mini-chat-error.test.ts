import { describe, expect, test } from 'vitest';

import {
  MiniChatError,
  MiniChatErrorCode,
  convertToMinChatError,
} from '../../../src/libs/utils/mini-chat-error';
import { I18n } from '../../../src/libs/i18n';

describe('utils/mini-chat-error', () => {
  test('MiniChatError', () => {
    const error = new MiniChatError(MiniChatErrorCode.Unknown, 'test');
    expect(error.code).toBe(MiniChatErrorCode.Unknown);
  });

  test('MiniChatError_Convert_Publish', () => {
    const publishError = convertToMinChatError({
      code: MiniChatErrorCode.SDK_API_APP_UnPublished,
      msg: 'publish',
    });
    const i18n = new I18n('zh-CN');
    const i18nEn = new I18n('en');
    expect(publishError.code).toBe(MiniChatErrorCode.SDK_API_APP_UnPublished);
    expect(publishError.msg).toBe('publish');

    const errorStr = publishError.getErrorMessageByI18n(i18n);
    expect(errorStr).toBe('此 Bot 未发布');

    const errorEnStr = publishError.getErrorMessageByI18n(i18nEn);
    expect(errorEnStr).toBe('The Bot is not published');
  });

  test('MiniChatError_Convert_UNknwon', () => {
    const unKnownError = convertToMinChatError({
      code: 123123123132,
      msg: '',
    });
    const i18n = new I18n('zh-CN');
    const i18nEn = new I18n('en');
    expect(unKnownError.code).toBe(123123123132);
    expect(unKnownError.msg).toBe('unknown error');

    const errorStr = unKnownError.getErrorMessageByI18n(
      i18n,
      {},
      'Test unKnown',
    );
    console.log('errorStr', errorStr);
    expect(errorStr).toBe('Test unKnown');

    const errorEnStr = unKnownError.getErrorMessageByI18n(i18nEn);
    expect(errorEnStr).toBe('unknown error');
  });
});
