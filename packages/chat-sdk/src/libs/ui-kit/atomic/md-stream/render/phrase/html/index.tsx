import type { Html as HtmlMdType } from "mdast";
import { FC, memo } from "react";
import { Text } from "../text";
import type { Text as TextMdType } from "mdast";
import { useMdStreamEnableHtmlTags } from "../../../context";
import { RichText } from "@tarojs/components";

export const Html: FC<{
  node: HtmlMdType;
}> = memo(({ node }) => {
  const enableHtmlTags = useMdStreamEnableHtmlTags();
  return (
    <>
      {enableHtmlTags ? (
        <RichText nodes={`${node.value}`} />
      ) : (
        <Text node={node as unknown as TextMdType} />
      )}
    </>
  );
});
