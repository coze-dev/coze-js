import { View } from "@tarojs/components";
import type { ListItem as ListItemMdType } from "mdast";
import { Block } from "../";
import { FC } from "react";

export const ListItem: FC<{
  node: ListItemMdType;
}> = ({ node }) => {
  return (
    <View>
      {node.children.map((item, index) => (
        <Block node={item} key={index} isParagraphNeedMargin={false} />
      ))}
    </View>
  );
};
