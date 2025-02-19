import { FC } from "react";
import { SvgKeyboard, SvgMicrophone } from "@/libs/ui-kit/atomic/svg";

import { InputType } from "../type";
import { SendBtn } from "../send-btn";
import styles from "./index.module.less";
import { logger } from "@/libs/utils";
import { IconButton } from "../../atomic/icon-button";
export const SendSwitchBtn: FC<{
  inputType?: InputType;
  inputValue?: string;
  hasTextToSend?: boolean;
  inputDisabled?: boolean;
  isNeedAudio?: boolean;
  focused?: boolean;
  onSendBtnClick?: () => void;
  onKeyboardClick?: () => void;
  onMicrophoneClick?: () => void;
}> = ({
  inputDisabled,
  onSendBtnClick,
  hasTextToSend,
  inputType,
  isNeedAudio,
  onKeyboardClick,
  onMicrophoneClick,
  focused,
}) => {
  logger.debug("SendSwitchBtn", isNeedAudio);
  const showKeyboard = isNeedAudio && inputType === InputType.Voice;
  const showSendBtn =
    !isNeedAudio || (inputType === InputType.Text && !!hasTextToSend);
  const showMicrophone =
    isNeedAudio && inputType === InputType.Text && !hasTextToSend;
  return (
    <>
      {showKeyboard ? (
        <IconButton
          onClick={onKeyboardClick}
          hoverTheme={"hover"}
          type="circle-btn"
          border="none"
        >
          <SvgKeyboard className={styles["keyboard-icon"]} />
        </IconButton>
      ) : null}
      {showMicrophone ? (
        <IconButton
          onClick={onMicrophoneClick}
          hoverTheme={"hover"}
          type="circle-btn"
          border="none"
        >
          <SvgMicrophone className={styles["microphone-icon"]} />
        </IconButton>
      ) : null}
      {showSendBtn ? (
        <SendBtn
          disabled={inputDisabled || !hasTextToSend}
          onClick={onSendBtnClick}
          focused={focused}
        />
      ) : null}
    </>
  );
};
