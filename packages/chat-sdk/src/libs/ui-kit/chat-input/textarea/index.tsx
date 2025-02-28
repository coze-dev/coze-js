import { FC, useState, useEffect, useRef } from 'react';

import cls from 'classnames';
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
> = ({ onSendTextMessage, onInputChange, placeholder, ...rest }) => {
  const [lineNum, setLineNum] = useState(0);
  const { value, id = '' } = rest;

  const getHeight = usePersistCallback(
    (lineNumTemp: number) => `${Math.max(1, lineNumTemp) * 20}px`,
  );
  const handleInputChange = usePersistCallback((val: string) => {
    onInputChange(val);

    if (isWeb) {
      const el = getInputElInWeb();
      if (el) {
        el.style.height = '0px';
        const scrollHeight = Number(el?.scrollHeight) || 0;
        const lineNumTemp = Math.floor(scrollHeight / 20);
        el.style.height = 'inherit';
        setLineNum(lineNumTemp);
      }
    }
  });
  const { onInputInit, getInputElInWeb } = useInputKeyDownOnWeb({
    inputId: id,
    onSendTextMessage,
    handleInputChange,
  });
  useUpdateEffect(() => {
    if (!value) {
      setLineNum(0);
    }
  }, [value]);

  return (
    <View className={styles['input-padding-container']}>
      <View className={styles['input-container']}>
        {/** Weixin Textarea 未居中，需要自己hack */}
        <View
          className={cls(styles.placeholder, {
            [styles['placeholder-hidden']]: !!value || !isMini,
          })}
        >
          {placeholder}
        </View>
        <TaroTextarea
          className={styles.input}
          maxlength={-1}
          ref={onInputInit}
          showConfirmBar={true}
          controlled
          cursorSpacing={20}
          placeholder={!isMini ? placeholder : undefined}
          placeholderClass={styles.placeholder}
          style={{
            height: getHeight(lineNum),
          }}
          onConfirm={() => {
            if (isMini) {
              onSendTextMessage();
            }
          }}
          onInput={event => {
            console.log('onInputKeyDown: onInput ', event.detail.value);
            handleInputChange(event.detail.value);
          }}
          onLineChange={event => {
            logger.debug('ChatInput onLineChange:', event);
            !isWeb && setLineNum(event.detail.lineCount);
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
  handleInputChange,
}: {
  inputId: string;
  onSendTextMessage: () => void;
  handleInputChange: (val: string) => void;
}) => {
  const refIsComposing = useRef(false);
  const getInputElInWeb = usePersistCallback(
    (): HTMLTextAreaElement | undefined | null =>
      isWeb
        ? document.getElementById(inputId)?.querySelector('textarea')
        : undefined,
  );
  const onInputKeyDown = usePersistCallback((e: KeyboardEvent) => {
    if (refIsComposing.current) {
      return;
    }
    if (e.code === 'Enter') {
      if (e.ctrlKey || e.metaKey || e.altKey) {
        const el = e.target as HTMLTextAreaElement;
        const start = el?.selectionStart;
        const end = el?.selectionEnd;
        const val = el?.value;
        if (start !== undefined && end !== undefined && val !== undefined) {
          e.preventDefault();
          e.stopPropagation();
          const before = val.substring(0, start);
          const after = val.substring(end);
          console.log('onInputKeyDown: start ', el.value);
          el.value = `${before}\n${after}`;
          el.selectionStart = start + 1;
          el.selectionEnd = start + 1;
          console.log('onInputKeyDown: end ', el.value);

          handleInputChange(el.value);
        }
      } else if (!e.shiftKey) {
        e.stopPropagation();
        e.preventDefault();
        onSendTextMessage();
      }
    }
  });
  const onCompositionstart = usePersistCallback(() => {
    //alert('compositionstart');
    refIsComposing.current = true;
  });
  const onCompositionend = usePersistCallback(() => {
    //alert('compositionend');
    refIsComposing.current = false;
  });
  const onInputInit = usePersistCallback(() => {
    if (isWeb) {
      const el = getInputElInWeb();
      el?.removeEventListener('compositionstart', onCompositionstart);
      el?.removeEventListener('compositionend', onCompositionend);
      el?.removeEventListener('keydown', onInputKeyDown);
      el?.addEventListener('keydown', onInputKeyDown);
      el?.addEventListener('compositionstart', onCompositionstart);
      el?.addEventListener('compositionend', onCompositionend);
    }
  });
  useEffect(() => {
    if (isWeb) {
      const el = getInputElInWeb();
      return () => {
        el?.removeEventListener('compositionstart', onCompositionstart);
        el?.removeEventListener('compositionend', onCompositionend);
        el?.removeEventListener('keydown', onInputKeyDown);
      };
    }
  }, []);
  return { onInputInit, getInputElInWeb };
};
