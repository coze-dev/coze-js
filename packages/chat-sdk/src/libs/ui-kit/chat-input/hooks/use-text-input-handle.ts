import { useMemo, useState } from 'react';

import { isWeb, logger } from '@/libs/utils';
import { useI18n } from '@/libs/provider';
import { usePersistCallback, useUpdateEffect } from '@/libs/hooks';

import { IChatInputProps, ITaskMessage } from '../type';

export const useTextInputHandle = (
  chatInputProps: IChatInputProps,
  options: {
    inputId: string;
    taskMessage?: ITaskMessage;
  },
) => {
  const i18n = useI18n();
  const {
    defaultValue,
    onSendTextMessage: onSendTextMessageOnly,
    disabled,
  } = chatInputProps;
  const { inputId, taskMessage } = options;
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState(defaultValue);
  const toSendInputValue = useMemo(() => {
    if (taskMessage?.isShow && taskMessage?.options?.length > 0) {
      const taskMessageText = taskMessage?.options
        .map(item => item.trim())
        .join('; ');
      return `${i18n.t('taskMessageMyChoice')}${taskMessageText}\n${
        inputValue || ''
      }`;
    }
    return inputValue;
  }, [taskMessage, inputValue]);

  const blurInput = usePersistCallback(() => {
    setFocused(false);
    if (isWeb) {
      // Mobile browser cannot blur the input element, need to manually blur the input element
      document.getElementById(inputId)?.querySelector('textarea')?.blur();
    }
  });
  const clearInput = usePersistCallback((isBlur: boolean) => {
    setInputValue('');
    isBlur && blurInput();
    // Fix taro onInput event.When the text is copied by clipboard， it must be clear twice.
    setTimeout(() => {
      setInputValue('');

      // When input value is set, the input will be focused on miniProgram
      isBlur && blurInput();
    }, 50);
  });
  useUpdateEffect(() => {
    if (defaultValue !== undefined) {
      setInputValue(defaultValue);
    }
  }, [defaultValue]);

  const onSendTextMessage = usePersistCallback(async () => {
    logger.debug('useTextInputHandle onSendTextMessage:', {
      inputValue,
      toSendInputValue,
      disabled,
    });

    if (toSendInputValue && !disabled) {
      if ((await onSendTextMessageOnly?.(toSendInputValue)) === false) {
        return;
      }

      clearInput(!isWeb);
    }
  });

  return {
    focused,
    clearInput,
    setFocused,
    inputValue,
    setInputValue,
    toSendInputValue,
    onSendTextMessage,
  };
};
