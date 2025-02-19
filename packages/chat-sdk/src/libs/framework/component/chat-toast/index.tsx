import { Toast } from "@/libs/ui-kit";
import styles from "./index.module.less";
import { useEffect, useState } from "react";
import { type UIChatToastEvent, UIEventType } from "@/libs/types";
import { useUiEventStore } from "@/libs/provider/context/chat-store-context";
import { View } from "@tarojs/components";
export const ChatToast = () => {
  const [event, setEvent] = useState<UIChatToastEvent>();
  const uiEvent = useUiEventStore((store) => store.event);
  useEffect(() => {
    uiEvent.on(UIEventType.ChatToastShow, (e: UIChatToastEvent) => {
      setEvent(e);
    });
  }, [uiEvent]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setEvent(undefined);
    }, Math.max(Math.min(10000, event?.duration || 6000), 3000));
    return () => {
      clearTimeout(timeout);
    };
  }, [event]);
  if (!event || !event.content) {
    return null;
  }
  return (
    <View className={styles["chat-toast"]}>
      <Toast className={styles.container} icon={event.icon} isNeedClose={false}>
        {event.content}
      </Toast>
    </View>
  );
};
