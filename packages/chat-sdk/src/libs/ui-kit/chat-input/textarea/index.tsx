import { FC, useState, useEffect } from 'react';

import {
  Textarea as TaroTextarea,
  type TextareaProps,
  View,
} from '@tarojs/components';

import { isMini, isWeb, logger } from '@/libs/utils';
import { usePersistCallback, useUpdateEffect } from '@/libs/hooks';

import styles from './index.module.less';
export const Textarea: FC<
  {
    onSendTextMessage: () => void;
    onInputChange: (val: string) => void;
  } & TextareaProps
> = ({ onSendTextMessage, onInputChange, ...rest }) => {
  const [lineNum, setLineNum] = useState(0);
  const { value, id = '' } = rest;

  const { onInputInit } = useInputKeyDownOnWeb({
    inputId: id,
    onSendTextMessage,
  });
  useUpdateEffect(() => {
    if (!value) {
      setLineNum(0);
    }
  }, [value]);
  return (
    <View className={styles['input-padding-container']}>
      <View className={styles['input-container']}>
        <TaroTextarea
          className={styles.input}
          maxlength={-1}
          ref={onInputInit}
          showConfirmBar={true}
          placeholderClass={styles.placeholder}
          style={{
            height: Math.max(1, lineNum) * 20,
          }}
          onConfirm={() => {
            if (isMini) {
              onSendTextMessage();
            }
          }}
          onInput={event => {
            onInputChange(event.detail.value);
          }}
          onLineChange={event => {
            logger.debug('ChatInput onLineChange:', event);
            setLineNum(event.detail.lineCount);
          }}
          {...rest}
        />
      </View>
    </View>
  );
};

const useInputKeyDownOnWeb = ({
  inputId,
  onSendTextMessage,
}: {
  inputId: string;
  onSendTextMessage: () => void;
}) => {
  const getInputElInWeb = usePersistCallback(() =>
    isWeb
      ? document.getElementById(inputId)?.querySelector('textarea')
      : undefined,
  );
  const onInputKeyDown = usePersistCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        onSendTextMessage();
      }
    }
  });
  const onInputInit = usePersistCallback(() => {
    if (isWeb) {
      const el = getInputElInWeb();
      el?.removeEventListener('keydown', onInputKeyDown);
      el?.addEventListener('keydown', onInputKeyDown);
    }
  });
  useEffect(() => {
    if (isWeb) {
      const el = getInputElInWeb();
      return () => {
        el?.removeEventListener('keydown', onInputKeyDown);
      };
    }
  }, []);
  return { onInputInit };
};
