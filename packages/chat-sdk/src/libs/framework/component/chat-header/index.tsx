import { Fragment } from 'react';

import { Text } from '@tarojs/components';

import { getCdnUrl } from '@/libs/utils';
import { CImage, Spacing } from '@/libs/ui-kit';
import { useChatPropsStore, useI18n } from '@/libs/provider';

import { useCommandSlot } from '../chat-input/hooks/use-command-slot';

import styles from './index.module.less';

export const ChatHeader = () => {
  const header = useChatPropsStore(store => store.ui?.header);
  const i18n = useI18n();
  const cdnBaseUrlPath = useChatPropsStore(
    store => store.setting?.cdnBaseUrlPath,
  );
  const commandSlots = useCommandSlot('headerRight');
  if (header?.isNeed === false) {
    return null;
  }
  return (
    <Spacing verticalCenter className={styles.container} gap={8}>
      <CImage
        src={
          header?.icon || getCdnUrl(cdnBaseUrlPath, 'assets/imgs/coze-logo.png')
        }
        className={styles['app-avatar']}
        mode="aspectFill"
      />
      <Text className={styles.title} overflow="ellipsis" numberOfLines={1}>
        {header?.title || i18n.t('defaultHeaderTitle')}
      </Text>
      {commandSlots.map((item, index) => (
        <Fragment key={index}>{item}</Fragment>
      ))}
      {header?.renderRightSlot?.()}
    </Spacing>
  );
};
