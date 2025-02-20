import { FC } from 'react';

import { Text, View } from '@tarojs/components';

import { Spacing, Button } from '@/libs/ui-kit';
import { useChatInfoStore, useChatPropsStore, useI18n } from '@/libs/provider';

import styles from './index.module.less';

export const ChatErrorDefault: FC<{ retryChatInit?: () => void }> = ({
  retryChatInit,
}) => {
  const i18n = useI18n();
  const miniChatError = useChatInfoStore(store => store.error);
  return (
    <View className={styles.container}>
      <Spacing horizontalCenter flex1 verticalCenter className={styles.content}>
        <Spacing vertical verticalCenter horizontalCenter gap={16}>
          <Spacing
            className={styles['error-img']}
            gap={4}
            vertical
            horizontalCenter
            verticalCenter
          >
            <View className={styles['error-img-warn-1']} />
            <View className={styles['error-img-warn-dot']} />
          </Spacing>
          <Text className={styles['error-txt']}>
            {miniChatError?.getErrorMessageByI18n(
              i18n,
              undefined,
              i18n.t('chatInitRetry'),
            )}
          </Text>
          <Button onClick={retryChatInit}>{i18n.t('retryBtn')}</Button>
        </Spacing>
      </Spacing>
    </View>
  );
};

export const ChatError: FC<{ retryChatInit?: () => void }> = ({
  retryChatInit,
}) => {
  const renderError = useChatPropsStore(store => store.ui?.error?.renderError);
  const onInitRetry = useChatPropsStore(
    store => store.eventCallbacks?.onInitRetry,
  );
  const retryInit = onInitRetry || retryChatInit;
  if (renderError) {
    return <>{renderError(undefined, retryInit)}</>;
  }
  return <ChatErrorDefault retryChatInit={retryInit} />;
};
