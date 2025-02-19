import { useAudioSpeech } from "@/libs/services";
import { AudioPlay, IconButton, Spacing, Spinning } from "@/libs/ui-kit";
import { AudioPlayEvent, logger, PlayAudio, showToast } from "@/libs/utils";
import { Text } from "@tarojs/components";
import { FC, useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { useChatStatusStore, useI18n } from "@/libs/provider";
import { DisableContainer } from "@/libs/ui-kit/atomic/disable-container";
import cls from "classnames";
import { useUiEventStore } from "@/libs/provider/context/chat-store-context";
import { usePersistCallback } from "@/libs/hooks";
const AudioComp: FC<{
  isPlaying: boolean;
  isLoading: boolean;
  svgTheme?: "light" | "dark" | "gray-bold";
}> = ({ isPlaying, isLoading, svgTheme }) => {
  if (isLoading) {
    return <Spinning size="small" />;
  }
  return <AudioPlay isPlaying={isPlaying} theme={svgTheme} />;
};

export const CommandAudio: FC<{
  text: string;
  isShowText?: boolean;
  className?: string;
  isNeedHover?: boolean;
  svgTheme?: "light" | "dark" | "gray-bold";
}> = ({ text, isShowText, svgTheme, isNeedHover, className }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const refPlayAudio = useRef<PlayAudio | null>(null);
  const { audioSpeech } = useAudioSpeech();
  const refPlaying = useRef(false);
  const i18n = useI18n();
  const targetFrameEvent = useUiEventStore((store) => store.event);

  const isAudioRecording = useChatStatusStore(
    (store) => store.isAudioRecording
  );
  refPlaying.current = isPlaying;

  const handleError = usePersistCallback(() => {
    showToast(
      {
        content: i18n.t("playVoiceFail"),
        icon: "error",
      },
      targetFrameEvent
    );
  });
  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    (async () => {
      try {
        setIsLoading(true);
        if (!refPlayAudio.current) {
          refPlayAudio.current = new PlayAudio();
        }
        await refPlayAudio.current.playText(text, audioSpeech);
        refPlayAudio.current.on(AudioPlayEvent.STOP, (res) => {
          logger.debug("CommandAudio Stop Audio Play", res);
          if (res.isError) {
            handleError();
          }
          setIsPlaying(false);
        });
      } catch (error) {
        //如果失败
        handleError();
        setIsPlaying(false);
      }
      setIsLoading(false);
    })();
    return () => {
      //暂停播放
      refPlayAudio.current?.stop();
      setIsLoading(false);
      setIsPlaying(false);
    };
  }, [isPlaying]);
  if (!text) return null;

  return (
    <DisableContainer
      disabled={isAudioRecording}
      className={cls(styles.container, className)}
    >
      <Spacing
        className={styles.container}
        width100
        onClick={() => {
          setIsPlaying(!isPlaying);
        }}
        gap={8}
      >
        <IconButton
          size="small"
          type="square-hover-btn"
          hoverTheme={isNeedHover ? "hover" : "none"}
        >
          <AudioComp
            isLoading={isLoading}
            isPlaying={isPlaying}
            svgTheme={svgTheme}
          />
        </IconButton>
        {isShowText ? (
          <Text
            className={styles["text"]}
            numberOfLines={1}
            maxLines={1}
            overflow="ellipsis"
          >
            {i18n.t("playVoice")}
          </Text>
        ) : null}
      </Spacing>
    </DisableContainer>
  );
};
