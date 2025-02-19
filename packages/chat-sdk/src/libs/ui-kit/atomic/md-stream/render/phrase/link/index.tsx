import { View } from "@tarojs/components";
import type { Link as LinkMdType } from "mdast";
import { FC } from "react";
import { Phrase } from "../";
import { setClipboardData, showToast } from "@tarojs/taro";
import cls from "classnames";

import styles from "./index.module.less";
import { useMdStreamI18n } from "../../../context";
import { isWeb } from "@/libs/utils";

export const Link: FC<{
  node: LinkMdType;
}> = ({ node }) => {
  const i18n = useMdStreamI18n();
  const isValidUrl = node.url && node.url !== "#";
  return (
    <View
      onClick={() => {
        if (isValidUrl) {
          if (isWeb) {
            window.open(node.url);
          } else {
            setClipboardData({
              data: node.url,
              fail() {
                showToast({
                  title: i18n?.t("copyFailed") || "",
                  icon: "error",
                });
              },
            });
          }
        }
      }}
      className={cls(styles.link, {
        [styles.invalid]: !isValidUrl,
      })}
    >
      {node.children.map((item, index) => (
        <Phrase key={index} node={item} />
      ))}
    </View>
  );
};
