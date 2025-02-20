import { View } from '@tarojs/components';

import { Spacing, Spinning } from '@/libs/ui-kit';
import { useChatMaxWidth, useChatPropsStore } from '@/libs/provider';

import styles from './index.module.less';

export const ChatLoading = () => {
  const renderLoading = useChatPropsStore(
    store => store.ui?.loading?.renderLoading,
  );
  const maxWidth = useChatMaxWidth();
  if (renderLoading) {
    return <View className={styles.loading}>{renderLoading()}</View>;
  }
  return (
    <View
      className={styles.loading}
      style={{
        maxWidth,
      }}
    >
      <Spacing horizontalCenter flex1 verticalCenter>
        <Spinning />
      </Spacing>
    </View>
  );
};
