import { FC } from "react";

import cls from "classnames";

import { BubbleText, Waiting } from "@/libs/ui-kit";

import styles from "./index.module.less";
import { Bubble } from "../../../atomic/bubble";

export const TextMessage: FC<{
  content: string;
  isLoadingText?: boolean;
}> = ({ content, isLoadingText }) => (
  <>
    {isLoadingText ? (
      <Bubble
        className={cls(styles["question-text"], styles.text)}
        isNeedBorder={false}
      >
        <Waiting />
      </Bubble>
    ) : (
      <BubbleText
        text={content}
        enter={true}
        space={true}
        className={cls(styles["question-text"], styles.text)}
        isNeedBorder={false}
      />
    )}
  </>
);
