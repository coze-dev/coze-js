import { Text as TaroText } from "@tarojs/components";
import { Break } from "../break";
import type { Text as TextMdType } from "mdast";
import { FC, Fragment, useMemo } from "react";
import cls from "classnames";
import styles from "./index.module.less";
import { useMdStreamSelectable } from "../../../context";
export const Text: FC<{
  node: TextMdType;
  className?: string;
}> = ({ node, className }) => {
  const textList = useMemo(() => node.value.split("\n"), [node.value]);
  const selectable = useMdStreamSelectable();
  return (
    <>
      {textList.map((item, index) => {
        return (
          <Fragment key={index}>
            {item ? (
              <TaroText
                selectable={selectable}
                className={cls(styles.text, styles.important, className)}
              >
                {item}
              </TaroText>
            ) : null}
            {index !== textList.length - 1 ? <Break /> : null}
          </Fragment>
        );
      })}
    </>
  );
};
