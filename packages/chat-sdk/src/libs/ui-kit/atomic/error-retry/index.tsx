import { Text } from "@tarojs/components";

import { SvgWarn } from "../svg";
import { Spacing } from "../spacing";

import styles from "./index.module.less";

interface ErrorRetryProps {
  errorText: string | React.ReactNode;
}
export const ErrorRetry = ({ errorText }: ErrorRetryProps) => (
  <Spacing gap={4} horizontalCenter>
    <SvgWarn />
    <Text className={styles.text}>{errorText}</Text>
  </Spacing>
);

export const ErrorRetryBtn = ({
  onClick,
  retryText,
}: {
  retryText: string;
  onClick: () => void;
}) => (
  <Text onClick={onClick} className={styles.retry}>
    {retryText}
  </Text>
);
