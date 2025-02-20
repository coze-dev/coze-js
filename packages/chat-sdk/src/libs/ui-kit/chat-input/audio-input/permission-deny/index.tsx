import { FC } from 'react';

import { Image, Text, View } from '@tarojs/components';

import { getCdnUrl } from '@/libs/utils';
import { SvgInfo } from '@/libs/ui-kit/atomic/svg';
import { Spacing } from '@/libs/ui-kit/atomic/spacing';
import { useChatPropsStore, useI18n } from '@/libs/provider';

import { Button } from '../../../atomic/button';

import styles from './index.module.less';
export const PermissionDeny: FC<{
  hideModal: () => void;
}> = ({ hideModal }) => {
  const i18n = useI18n();
  const cdnBaseUrlPath = useChatPropsStore(
    store => store.setting?.cdnBaseUrlPath,
  );
  return (
    <View className={styles.container}>
      <Spacing gap={4} verticalCenter>
        <Text className={styles.title}>{i18n.t('permissionMkfTitle')}</Text>
        <SvgInfo />
      </Spacing>
      <Text className={styles.desc}>{i18n.t('permissionMkfDesc')}</Text>
      <Image
        preview="false"
        mode="widthFix"
        className={styles.img}
        src={getCdnUrl(cdnBaseUrlPath, 'assets/imgs/mkf-deny.png')}
      />
      <View className={styles['btn-container']}>
        <Button onClick={hideModal} className={styles.btn}>
          {i18n.t('permissionMkfBtnIKnown')}
        </Button>
      </View>
    </View>
  );
};
