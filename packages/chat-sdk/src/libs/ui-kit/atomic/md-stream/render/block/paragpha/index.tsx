import { View } from "@tarojs/components";
import type { Paragraph as ParagraphMdType } from "mdast";
import { Phrase } from "../../phrase";
import { FC } from "react";

export const Paragraph: FC<{
  node: ParagraphMdType;
  isNeedMargin?: boolean;
}> = ({ node }) => {
  return (
    <View>
      {node.children.map((item, index) => (
        <Phrase key={index} node={item} />
      ))}
    </View>
  );
};
