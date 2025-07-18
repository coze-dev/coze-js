import { FC, useEffect, useRef } from 'react';

import {
  Textarea as TaroTextarea,
  type TextareaProps,
  View,
} from '@tarojs/components';

import { isMini, isWeb, logger } from '@/libs/utils';
import { usePersistCallback } from '@/libs/hooks';

import styles from './index.module.less';
export const Textarea: FC<
  {
    onSendTextMessage: () => void;
    onInputChange: (val: string) => void;
  } & TextareaProps
> = ({ onSendTextMessage, onInputChange, placeholder, ...rest }) => {
  const { id = '' } = rest;

  const handleInputChange = usePersistCallback((val: string) => {
    onInputChange(val);
    if (isWeb) {
      const el = getInputElInWeb();
      if (el) {
        el.style.height = '0px';
        el.style.height = 'inherit';
      }
    }
  });
  const { onInputInit, getInputElInWeb } = useInputKeyDownOnWeb({
    inputId: id,
    onSendTextMessage,
    handleInputChange,
  });

  return (
    <View className={styles['input-padding-container']}>
      <View className={styles['input-container']}>
        <TaroTextarea
          className={styles.input}
          maxlength={-1}
          ref={onInputInit}
          showConfirmBar={true}
          controlled
          cursorSpacing={20}
          autoHeight
          placeholder={placeholder}
          placeholderClass={styles.placeholder}
          disableDefaultPadding={true}
          onConfirm={() => {
            if (isMini) {
              onSendTextMessage();
            }
          }}
          onInput={event => {
            logger.debug('onInputKeyDown: onInput ', event.detail.value);
            handleInputChange(event.detail.value);
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
  const refInputEl = useRef<HTMLTextAreaElement>();
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
          el.value = `${before}\n${after}`;
          el.selectionStart = start + 1;
          el.selectionEnd = start + 1;

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
      refInputEl.current = el;
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
      return () => {
        refInputEl.current?.removeEventListener(
          'compositionstart',
          onCompositionstart,
        );
        refInputEl.current?.removeEventListener(
          'compositionend',
          onCompositionend,
        );
        refInputEl.current?.removeEventListener('keydown', onInputKeyDown);
        refInputEl.current = undefined;
      };
    }
  }, []);
  return { onInputInit, getInputElInWeb };
};
