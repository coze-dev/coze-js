import type { PhrasingContent } from "mdast";
import { FC } from "react";
import { Break } from "./break";
import { Text } from "./text";
import { Delete } from "./delete";
import { Emphasis } from "./emphasis";
import { Html } from "./html";
import { Image } from "./image";
import { InlineCode } from "./inline-code";
import { Link } from "./link";
import { Strong } from "./strong";
import { Indicator } from "./indicator";
import { type IndicatorLocal } from "../../ast";
export const PhraseTypes = [
  "break",
  "delete",
  "emphasis",
  "footnoteReference",
  "html",
  "image",
  "imageReference",
  "inlineCode",
  "link",
  "linkReference",
  "strong",
  "text",
  "indicator",
];
export const Phrase: FC<{
  node: PhrasingContent | IndicatorLocal;
}> = ({ node }) => {
  return (
    <>
      {node.type === "break" && <Break />}
      {node.type === "delete" && <Delete node={node} />}
      {node.type === "emphasis" && <Emphasis node={node} />}
      {node.type === "footnoteReference" && null /* 不做处理，做一个标记*/}
      {node.type === "html" && <Html node={node} />}
      {node.type === "image" && <Image node={node} />}
      {node.type === "imageReference" && null /* 不做处理，做一个标记*/}
      {node.type === "inlineCode" && <InlineCode node={node} />}
      {node.type === "link" && <Link node={node} />}
      {node.type === "linkReference" && null /* 不做处理，做一个标记*/}
      {node.type === "strong" && <Strong node={node} />}
      {node.type === "text" && <Text node={node} />}
      {node.type === "indicator" && <Indicator node={node} />}
    </>
  );
};
