import { FC, useMemo, useState } from 'react';

import cls from 'classnames';
import { Input, Text, View } from '@tarojs/components';

import { useI18n } from '@/libs/provider';
import { ChatMessage } from '@/exports';

import { extractChatflowMessage } from '../../helper/extract-chatlow-message';
import { Spacing } from '../../../atomic/spacing';
import { Button } from '../../../atomic/button';

import styles from './index.module.less';

export interface ChatflowNodeData {
  card_type: 'QUESTION' | 'INPUT';
  input_card_data?: {
    type: string;
    name: string;
  }[];
  question_card_data?: {
    Title: string;
    Options: { name: string }[];
  };
}

const InputNode: FC<{
  data?: ChatflowNodeData;
  disabled?: boolean;
  sendTextMessage?: (content: string) => void;
}> = ({ data, sendTextMessage, disabled }) => {
  const [inputData, setInputData] = useState<Record<string, string>>({});
  const [hasSend, setHasSend] = useState(false);
  const realDisabled = disabled || hasSend;
  const i18n = useI18n();
  return (
    <Spacing
      className={cls(styles['input-node'], {
        [styles.disabled]: realDisabled,
      })}
      gap={12}
      vertical
    >
      {data?.input_card_data?.map((item, index) => (
        <Spacing gap={6} vertical key={index}>
          <Text
            className={styles['input-node-text']}
            overflow="ellipsis"
            numberOfLines={1}
          >
            {item?.name}
          </Text>
          <Input
            className={styles['input-node-input']}
            maxlength={-1}
            disabled={disabled || hasSend}
            placeholder={i18n.t('chatflowNodeInputPlaceholder')}
            onInput={event => {
              setInputData({
                ...inputData,
                [item.name]: event.detail.value || '',
              });
            }}
          />
        </Spacing>
      ))}

      <Button
        className={styles.btn}
        onClick={() => {
          if (realDisabled) {
            return;
          }
          setHasSend(true);
          sendTextMessage?.(
            data?.input_card_data
              ?.map(item => `${item.name}:${inputData[item.name] || ''}`)
              .join('\n') || '',
          );
        }}
      >
        {i18n.t('submit')}
      </Button>
    </Spacing>
  );
};
const SwitchNode: FC<{
  data?: ChatflowNodeData;
  disabled?: boolean;
  sendTextMessage?: (content: string) => void;
}> = ({ data, disabled, sendTextMessage }) => {
  const [hasSend, setHasSend] = useState(false);
  const realDisabled = disabled || hasSend;
  return (
    <View
      className={cls(styles['switch-node'], {
        [styles.disabled]: realDisabled,
      })}
    >
      <Text className={styles['switch-node-text']}>
        {data?.question_card_data?.Title}
      </Text>
      <Spacing vertical gap={6}>
        {data?.question_card_data?.Options?.map((item, index) => (
          <View
            className={styles['switch-node-switch-item']}
            key={index}
            onClick={() => {
              if (disabled) {
                return;
              }
              setHasSend(true);
              sendTextMessage?.(item.name);
            }}
          >
            <Text className={styles['switch-node-switch-item-text']}>
              {item.name}
            </Text>
          </View>
        ))}
      </Spacing>
    </View>
  );
};

export const ChatflowNode: FC<{
  message: ChatMessage;
  disabled?: boolean;
  sendTextMessage?: (content: string) => void;
}> = ({ message, sendTextMessage, disabled }) => {
  const chatflowNodeData: ChatflowNodeData | undefined = useMemo(
    () => extractChatflowMessage(message),
    [message],
  );
  if (!chatflowNodeData) {
    return null;
  }
  return (
    <>
      {chatflowNodeData.card_type === 'INPUT' ? (
        <InputNode
          data={chatflowNodeData}
          sendTextMessage={sendTextMessage}
          disabled={disabled}
        />
      ) : null}
      {chatflowNodeData.card_type === 'QUESTION' ? (
        <SwitchNode
          data={chatflowNodeData}
          sendTextMessage={sendTextMessage}
          disabled={disabled}
        />
      ) : null}
    </>
  );
};
