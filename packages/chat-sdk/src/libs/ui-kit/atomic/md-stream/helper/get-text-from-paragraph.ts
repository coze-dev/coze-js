import type { Paragraph, PhrasingContent } from "mdast";

export const getTextFromParagraph = (paragraphData: Paragraph) => {
  if (paragraphData.type === "paragraph") {
    return getTextFromPhrase(paragraphData.children);
  }
  return "";
};

const getTextFromPhrase = (children: PhrasingContent[]) => {
  return children
    .map((item) => {
      if (
        item.type === "delete" ||
        item.type === "emphasis" ||
        item.type === "link" ||
        item.type === "strong"
      ) {
        return getTextFromPhrase(item.children);
      } else if (
        item.type === "text" ||
        item.type === "inlineCode" ||
        item.type === "html"
      ) {
        return item.value;
      }
      return "";
    })
    .filter((item) => !!item)
    .join(",");
};
