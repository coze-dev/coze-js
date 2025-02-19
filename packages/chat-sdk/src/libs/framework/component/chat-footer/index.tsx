import { Text } from "@tarojs/components";
import { CenterAlignedBox, Link } from "@/libs/ui-kit";
import styles from "./index.module.less";
import { useI18n, useChatPropsStore } from "@/libs/provider";
import { useMemo } from "react";
import cls from "classnames";

export const ChatFooter = () => {
  const i18n = useI18n();
  const footer = useChatPropsStore((store) => store.ui?.footer);
  const footerContent = useMemo(() => {
    return footer?.expressionText
      ? getTextByExpress(footer?.expressionText, footer?.linkvars)
      : i18n.t("chatFooterTip");
  }, [footer?.expressionText, footer?.linkvars]);
  if (footer?.isNeed === false) {
    return null;
  }

  return (
    <CenterAlignedBox
      className={cls(styles.container, footer?.containerClassName)}
    >
      <Text
        className={cls(styles.footer, footer?.textClassName)}
        numberOfLines={1}
        overflow="ellipsis"
      >
        {footerContent}
      </Text>
    </CenterAlignedBox>
  );
};

function getTextByExpress(
  expressionText: string,
  linkvars?: Record<
    string,
    {
      text: string;
      link: string;
    }
  >
) {
  const arrLinks: React.ReactNode[] = [];
  const splitLinkTag = "{{{link}}}";
  const textWithLinkTags = expressionText.replace(
    /\{\{\s*(\w+)\s*\}\}/g,
    (_, key) => {
      const { link, text: linkText } = linkvars?.[key] || {};
      if (link && linkText) {
        arrLinks.push(<Link src={link}>{linkText}</Link>);
        return splitLinkTag;
      } else {
        arrLinks.push(linkText || "");
      }
      return splitLinkTag;
    }
  );
  return textWithLinkTags.split(splitLinkTag).map((item, index) => (
    <Text key={`text_link_${index}`}>
      {item}
      {arrLinks[index]}
    </Text>
  ));
}
