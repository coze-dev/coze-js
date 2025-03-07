import { useState } from 'react';

import { View, Textarea } from '@tarojs/components';

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
      <View className={styles['text-container']}>
        <Textarea
          placeholder="有什么问题"
          className={styles.textarea}
          placeholderClass={styles.placeholder}
        />
      </View>
    </View>
  );
}
