import { View } from "@tarojs/components";
import type { Blockquote as BlockquoteMdType } from "mdast";
import { Block } from "../";
import { FC } from "react";
import styles from "./index.module.less";
export const Blockquote: FC<{
  node: BlockquoteMdType;
}> = ({ node }) => {
  return (
    <View className={styles.blockquote}>
      {node.children.map((item) => (
        <Block node={item} />
      ))}
    </View>
  );
};
