import { FC } from "react";
import { SvgFeishu } from "@/libs/ui-kit/atomic/svg";
import { DisableContainer } from "@/libs/ui-kit/atomic/disable-container";

import styles from "./index.module.less";
import { IconButton } from "../../atomic/icon-button";

export const SendBtn: FC<{
  disabled?: boolean;
  focused?: boolean;
  onClick?: () => void;
}> = ({ disabled, onClick }) => {
  return (
    <DisableContainer disabled={disabled}>
      <IconButton
        hoverTheme={"hover"}
        onClick={onClick}
        type="circle-btn"
        border="none"
      >
        <SvgFeishu className={styles["send-btn"]} theme={"dark"} />
      </IconButton>
    </DisableContainer>
  );
};
