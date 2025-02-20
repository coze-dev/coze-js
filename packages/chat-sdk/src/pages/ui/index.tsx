import { useState } from 'react';

import { View } from '@tarojs/components';

import { Radio, Spacing } from '@/libs/ui-kit';

import styles from './index.module.less';

export default function Index() {
  const [radioChecked, setRadioChecked] = useState<boolean>(false);
  return (
    <View className={styles.container}>
      <Spacing vertical gap={10} verticalCenter>
        <Radio
          checked={radioChecked}
          onChange={isChecked => {
            setRadioChecked(isChecked);
          }}
        />
      </Spacing>
    </View>
  );
}
