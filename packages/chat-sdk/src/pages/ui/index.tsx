import { View } from "@tarojs/components";

import styles from "./index.module.less";
import { Radio, Spacing } from "@/libs/ui-kit";
import { useState } from "react";

export default function Index() {
  const [radioChecked, setRadioChecked] = useState<boolean>(false);
  return (
    <View className={styles.container}>
      <Spacing vertical gap={10} verticalCenter>
        <Radio
          checked={radioChecked}
          onChange={(isChecked) => {
            setRadioChecked(isChecked);
          }}
        />
      </Spacing>
    </View>
  );
}
