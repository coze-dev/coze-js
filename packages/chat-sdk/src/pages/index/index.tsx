import { View, Navigator } from '@tarojs/components';

import styles from './index.module.less';
export default function Index() {
  return (
    <View className={styles.container}>
      <Navigator url="/pages/markdown/index" className={styles.nav}>
        markdown
      </Navigator>
      <Navigator url="/pages/chat/index" className={styles.nav}>
        chat
      </Navigator>
      <Navigator url="/pages/chatflow/index" className={styles.nav}>
        chatflow
      </Navigator>
      <Navigator url="/pages/ui/index" className={styles.nav}>
        ui
      </Navigator>
    </View>
  );
}
