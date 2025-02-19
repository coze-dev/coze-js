import { Text, View } from "@tarojs/components";

import styles from "./index.module.less";
import { FC } from "react";
import { Dot } from "../../atomic/dot";
import { Spacing } from "../../atomic/spacing";
import { ITaskMessage } from "../type";
import { useI18n } from "@/libs/provider";

export const TaskMessage: FC<{
  taskMessage?: ITaskMessage;
}> = ({ taskMessage }) => {
  const { isShow, options: taskOptions = [] } = taskMessage || {};
  const i18n = useI18n();
  if (!isShow) {
    return null;
  }
  return (
    <View className={styles["task-message-container"]}>
      <View className={styles["content"]}>
        <View>{i18n.t("taskMessageMyChoice")}</View>
        <View>
          {taskOptions.map((item, index) => (
            <Spacing key={index}>
              <Dot boxHeight={20} boxWidth={20} />
              <Text>{item}</Text>
            </Spacing>
          ))}
        </View>
      </View>
    </View>
  );
};
