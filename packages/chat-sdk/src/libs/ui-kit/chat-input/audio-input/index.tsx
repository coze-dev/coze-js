import { FC, useCallback, useEffect, useRef, useState } from "react";

import {
  AudioInput as AtomicAudioInput,
  InputTriggerType,
} from "../../atomic/audio-input";
import styles from "./index.module.less";
import { View, Text } from "@tarojs/components";
import cls from "classnames";
import { AudioWave } from "../../atomic/audio-wave";
import { type AudioRaw } from "@/libs/types";
import {
  getRecorderManager,
  BaseRecorderManager,
  RecorderEvent,
  logger,
  showToast,
  PlayAudio,
  MiniChatError,
  MiniChatErrorCode,
  showModal,
} from "@/libs/utils";
import Taro, { TaroStatic } from "@tarojs/taro";
import { useUpdateEffect } from "@/libs/hooks";
import { PermissionDeny } from "./permission-deny";
import { useI18n } from "@/libs/provider";
import { Spacing } from "../../atomic/spacing";
import { SvgCancel } from "../../atomic/svg";

const maxTime = 50;

const AudioTips: FC<{
  isTouching?: boolean;
  isOutside?: boolean;
  leftDuration?: number;
  triggerType?: InputTriggerType;
}> = ({ isTouching, isOutside, leftDuration, triggerType }) => {
  const i18n = useI18n();
  let text = "";
  let tipType: "touching-tips" | "outside-tips" | "time-limit-tips" =
    "touching-tips";
  if (isTouching) {
    tipType = "touching-tips";
    if (triggerType === "keyboard") {
      text = i18n.t("audioInputTooltipSend");
    } else {
      text = i18n.t("audioInputTooltipTouching");
    }
  }
  if (leftDuration && leftDuration <= 10) {
    tipType = "time-limit-tips";
    text = i18n.t("audioInputTooltipTick", {
      duration: (
        <Text className={styles["left-duration"]}>{leftDuration} ˝</Text>
      ),
    }); //`${leftDuration}˝ 后自动结束录制并发送`;
  }
  if (isTouching && isOutside) {
    tipType = "outside-tips";
    text = i18n.t("audioInputTooltipCancel");
  }
  if (!text) {
    return null;
  }
  return (
    <Spacing
      verticalCenter
      horizontalCenter
      gap={4}
      className={cls(styles["tips-container"], { [styles[tipType]]: true })}
    >
      {tipType === "outside-tips" ? <SvgCancel /> : null}
      <Text
        className={styles["tips-text"]}
        overflow="ellipsis"
        numberOfLines={1}
        maxLines={1}
      >
        {text}
      </Text>
    </Spacing>
  );
};

export const AudioInput: FC<{
  onSendAudioMessage?: (AudioRaw) => void;
  type?: "default" | "primary";
  frameEventTarget?: InstanceType<TaroStatic["Events"]>;
  isPcMode?: boolean;
  disabled?: boolean;
  focused?: boolean;
  onAudioRecording?: (isRecording: boolean) => void;
}> = ({
  onSendAudioMessage,
  type = "primary",
  frameEventTarget,
  isPcMode,
  disabled,
  focused,
  onAudioRecording,
}) => {
  const [isTouching, setIsTouching] = useState(false);
  const [isOutside, setIsOutSide] = useState(false);
  const refIsOutSide = useRef(false);
  const refRecorderManager = useRef<BaseRecorderManager>();
  const [triggerType, setTriggerType] = useState<InputTriggerType>();
  const [volume, setVolume] = useState(0);
  const [leftDuration, setLeftDuration] = useState(50);
  const refStop = useRef<() => void>();
  const i18n = useI18n();
  refIsOutSide.current = isOutside;
  logger.debug("AudioInput start", refIsOutSide.current);
  useUpdateEffect(() => {
    onAudioRecording?.(isTouching);
  }, [isTouching]);
  const onTouching = useCallback((triggerType?: InputTriggerType) => {
    setTriggerType(triggerType);
    setIsTouching(true);
    if (refRecorderManager.current) {
      refRecorderManager.current.destroy();
    }
    //暂停当前播放的内容
    PlayAudio.stopNow();

    let isInterrupted = false;
    refRecorderManager.current = getRecorderManager();

    logger.debug("onMouseDown onTouching");
    refStop.current = () => {
      clearTimeout(timeout);
      if (refIsOutSide.current) {
        isInterrupted = true;
      }
      setIsTouching(false);
      setIsOutSide(false);
    };
    refRecorderManager.current.on(RecorderEvent.STOP, (res) => {
      logger.debug("AudioInput stop triggered", res, refIsOutSide.current);
      if (!isInterrupted && !refIsOutSide.current && res.duration) {
        if (res.duration < 1000) {
          showToast(
            {
              content: i18n.t("audioInputErrorUnDetectContent"),
              icon: "error",
            },
            frameEventTarget
          );
        } else {
          onSendAudioMessage?.(res);
        }
      }
      refStop.current?.();
      refRecorderManager.current?.destroy();
    });
    /**
     * 暂停、打断都是异常操作，直接停止。
     */
    refRecorderManager.current.on(RecorderEvent.PAUSE, () => {
      isInterrupted = true;
      refRecorderManager.current?.stop();
      setVolume(0);
    });
    refRecorderManager.current.on(RecorderEvent.INTERRUPT, () => {
      isInterrupted = true;
      refRecorderManager.current?.stop();
    });
    refRecorderManager.current.on(RecorderEvent.ERROR, (res: MiniChatError) => {
      isInterrupted = true;
      logger.error("AudioInput onError", res, res.code);

      if (res.code === MiniChatErrorCode.Audio_Permission_Denied) {
        showModal(
          {
            isNeedMask: true,
            renderModal: (hideModal) => {
              return <PermissionDeny hideModal={hideModal} />;
            },
          },
          frameEventTarget
        );
      } else {
        showToast(
          {
            content: i18n.t("audioInputErrorRecord"),
            icon: "error",
          },
          frameEventTarget
        );
      }
      refStop.current?.();
      refRecorderManager.current?.destroy();
    });
    refRecorderManager.current.on(RecorderEvent.VOLUME, (res) => {
      logger.debug("AudioInput_volume", res);
      setVolume(res.volume);
    });

    logger.debug("AudioInput register Event End");

    refRecorderManager.current.start({
      numberOfChannels: 1,
    });
    const startTime = Date.now();
    let hasVibrate = false;
    let timeout: number = 0;
    function tickDuration() {
      timeout = setTimeout(() => {
        const duration = Math.ceil((Date.now() - startTime) / 1000);
        logger.debug("AudioInput duration", duration);
        if (duration > maxTime - 10) {
          setLeftDuration(maxTime - duration);
          if (duration >= maxTime) {
            refRecorderManager.current?.stop();
            refStop.current?.();
            return;
          }
          if (!hasVibrate) {
            try {
              Taro.vibrateLong();
            } catch (e) {
              logger.error("AudioInput vibrateLong error", e);
            }
            hasVibrate = true;
          }
        }
        tickDuration();
      }, 500) as unknown as number;
    }
    tickDuration();

    setLeftDuration(maxTime);
    setIsTouching(true);
  }, []);

  useEffect(() => {
    return () => {
      refRecorderManager.current?.destroy();
    };
  }, []);

  const audioWaveType =
    type === "default" ? "default" : isOutside ? "warning" : "primary";
  const realFocused = focused || !isPcMode;
  const buttonText = disabled
    ? i18n.t("audioInputDisabledText")
    : realFocused
    ? isPcMode
      ? i18n.t("audioInputPcText")
      : i18n.t("audioInputMobileText")
    : isPcMode
    ? i18n.t("unFocusInputText")
    : i18n.t("audioInputMobileText");
  return (
    <View
      className={cls(styles.container, {
        [styles.touching]: isTouching && !disabled,
        [styles.outside]: isOutside && !disabled,
        [styles[type]]: true,
        [styles.focused]: realFocused && !disabled,
      })}
    >
      <AudioTips
        isTouching={isTouching}
        isOutside={isOutside}
        leftDuration={leftDuration}
        triggerType={triggerType}
      />
      <AtomicAudioInput
        onTouching={onTouching}
        onOutside={(isOutside) => {
          logger.debug("AudioInput OutSide touch", isOutside);
          setIsOutSide(isOutside);
        }}
        onEnd={() => {
          logger.debug("AudioInput recording onEnd");
          refRecorderManager.current?.stop();
          refStop.current?.();
        }}
        frameEventTarget={frameEventTarget}
        isPcMode={isPcMode}
        className={styles.audio}
        disabled={disabled}
      >
        <Text
          overflow="ellipsis"
          numberOfLines={1}
          maxLines={1}
          userSelect={false}
          className={styles.text}
        >
          {buttonText}
        </Text>
        {isTouching ? (
          <AudioWave
            type={audioWaveType}
            size="medium"
            volumeNumber={volume * 5}
            className={styles.wave}
          />
        ) : null}
      </AtomicAudioInput>
    </View>
  );
};
