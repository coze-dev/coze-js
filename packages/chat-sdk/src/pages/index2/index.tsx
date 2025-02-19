import { View, WebView } from "@tarojs/components";

import styles from "./index.module.less";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    setTimeout(() => {
      //document.getElementById("frame")?.focus();
      console.log("keydown focus");
      document.addEventListener("keydown", (e) => {
        console.log("keydown on", e);
      });
      console.log("keydown 2344");
    }, 3000);
  }, []);
  return (
    <View className={styles.container}>
      <View className={styles["chat-container"]}></View>
      <iframe
        id="frame"
        src="https://www.coze.cn/#/pages/chatflow/index"
        width={"100%"}
        height={"100%"}
      />
    </View>
  );
}
