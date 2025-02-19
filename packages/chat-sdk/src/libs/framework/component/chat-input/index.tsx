import { Fragment, useMemo } from "react";

import { ChatInput as ChatInputUi, Spacing } from "@/libs/ui-kit";
import { useSendMessage } from "@/libs/services";
import {
  useChatPropsStore,
  useChatStatusStore,
  useDefaultInputMode,
  useI18n,
  useIsMobile,
  useIsNeedAudioInput,
} from "@/libs/provider";
import { useInputAdjust } from "./hooks/use-input-adjust";
import styles from "./index.module.less";
import { useCommandSlot } from "./hooks/use-command-slot";
import { View } from "@tarojs/components";
import {
  useChatInputStore,
  useUiEventStore,
} from "@/libs/provider/context/chat-store-context";
import { usePersistCallback } from "@/libs/hooks";
import { logger } from "@/libs/utils";
import cls from "classnames";
let chatInputNo = 1;

export const ChatInput = () => {
  const i18n = useI18n();

  const { sendTextMessage, sendFileMessage, sendAudioMessage } =
    useSendMessage();
  const { input: inputDisableState } = useChatStatusStore(
    (store) => store.disableState
  );
  const uiConfig = useChatPropsStore((store) => store.ui);
  const setIsAudioRecording = useChatStatusStore(
    (state) => state.setIsAudioRecording
  );
  const isAudioRecording = useChatStatusStore(
    (store) => store.isAudioRecording
  );
  const taskList = useChatInputStore((store) => store.taskList);
  const isNeedAudio = useIsNeedAudioInput();
  const inputType = useDefaultInputMode();
  const inputUiConfig = uiConfig?.chatSlot?.input;
  const uploadConfig = uiConfig?.chatSlot?.uploadBtn;
  const renderChatInputTopSlot = inputUiConfig?.renderChatInputTopSlot;
  const inputId = useMemo(() => `chatInput${chatInputNo++}`, []);
  const { changeInputLocation, bottomOffset, inputAdjustDefault } =
    useInputAdjust(inputId);
  const targetFrameEvent = useUiEventStore((store) => store.event);
  const commandSlots = useCommandSlot("inputLeft");
  const isMobile = useIsMobile();
  const onAudioRecording = usePersistCallback((isAudioRecording: boolean) => {
    setIsAudioRecording(isAudioRecording);
  });

  logger.info("ChatInput input info", {
    isNeedAudio,
    inputType,
  });
  logger.debug("ChatInput configInfo:", inputUiConfig, taskList);

  if (inputUiConfig?.isNeed === false) {
    return null;
  }

  return (
    <View
      className={cls(styles.container, {
        [styles["recording-audio"]]: isAudioRecording,
      })}
      id={inputId}
      style={{
        bottom: `${bottomOffset}px`,
      }}
      onTouchStart={(event) => {
        event.stopPropagation();
      }}
    >
      <View className={styles["slot-container"]}>
        {renderChatInputTopSlot?.()}
      </View>
      <Spacing
        gap={0}
        verticalCenter
        width100
        style={{ overflow: "visible", paddingTop: 10 }}
      >
        {commandSlots.length ? (
          <Spacing
            gap={12}
            verticalCenter
            style={{
              overflow: "visible",
              width: isAudioRecording ? 0 : commandSlots.length * 46,
            }}
            className={styles["command-container"]}
          >
            {commandSlots.map((item, index) => (
              <Fragment key={index}>{item}</Fragment>
            ))}
          </Spacing>
        ) : null}

        <View
          className={styles["input-container"]}
          style={{
            maxWidth: isAudioRecording
              ? "100%"
              : `calc(100% - ${commandSlots.length * 46}px)`,
          }}
        >
          <ChatInputUi
            isNeedUpload={uploadConfig?.isNeed !== false}
            isNeedTaskMessage={inputUiConfig?.isNeedTaskMessage}
            disabled={inputDisableState}
            defaultValue={inputUiConfig?.defaultText}
            defaultInputType={inputType}
            taskList={taskList}
            isNeedAudio={isNeedAudio || false}
            placeholder={
              inputUiConfig?.placeholder || i18n.t("chatInputPlaceholder")
            }
            onSendTextMessage={sendTextMessage}
            onSendFileMessage={sendFileMessage}
            onSendAudioMessage={sendAudioMessage}
            onKeyBoardHeightChange={changeInputLocation}
            inputAdjustDefault={inputAdjustDefault}
            frameEventTarget={targetFrameEvent}
            isPcMode={!isMobile}
            onAudioRecording={onAudioRecording}
          />
        </View>
      </Spacing>
    </View>
  );
};
