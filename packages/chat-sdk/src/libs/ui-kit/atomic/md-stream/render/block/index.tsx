import { View } from "@tarojs/components";

import type {
  BlockContent,
  DefinitionContent,
  ListItem as ListItemMdType,
} from "mdast";
import { FC } from "react";
import { Html } from "../phrase/html";
import { Code } from "./code";
import { Heading } from "./heading";
import { Paragraph } from "./paragpha";
import { Blockquote } from "./blockquote";
import { List } from "./list";
import { ListItem } from "./list-item";
import { Table } from "./table";
import { ThematicBreak } from "./thematic-break";
export const BlockTypes = [
  "code",
  "heading",
  "paragraph",
  "blockquote",
  "list",
  "listItem",
  "table",
  "thematicBreak",
];
export const Block: FC<{
  node: BlockContent | DefinitionContent | ListItemMdType;
  isParagraphNeedMargin?: boolean;
}> = ({ node, isParagraphNeedMargin = true }) => {
  return (
    <View>
      {node.type === "html" && <Html node={node} />}
      {node.type === "code" && <Code node={node} />}
      {node.type === "heading" && <Heading node={node} />}
      {node.type === "paragraph" && (
        <Paragraph node={node} isNeedMargin={isParagraphNeedMargin} />
      )}
      {node.type === "blockquote" && <Blockquote node={node} />}
      {node.type === "list" && <List node={node} />}
      {node.type === "listItem" && <ListItem node={node} />}
      {node.type === "table" && <Table node={node} />}
      {
        node.type === "thematicBreak" && (
          <ThematicBreak />
        ) /* 不做处理，做一个标记*/
      }
    </View>
  );
};
