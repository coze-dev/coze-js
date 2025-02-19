import { useCallback, useEffect, useMemo, useState } from "react";
import { type UIModalEvent, UIEventType } from "@/libs/types";
import { useUiEventStore } from "@/libs/provider/context/chat-store-context";
import { Modal } from "@/libs/ui-kit/atomic/modal";

let modalId = 1000;
export const ChatModal = () => {
  const [event, setEvent] = useState<UIModalEvent>();
  const key = useMemo(() => `modal_${modalId++}`, [event]);
  const uiEvent = useUiEventStore((store) => store.event);
  useEffect(() => {
    uiEvent.on(UIEventType.ChatModalShow, (e: UIModalEvent) => {
      setEvent(e);
    });
  }, [uiEvent]);
  const hideModal = useCallback(() => {
    setEvent(undefined);
  }, []);
  if (!event || !event.renderModal) {
    return null;
  }
  // event修改的时候，会重新渲染，所以需要key
  return (
    <Modal onHide={hideModal} key={key}>
      {event.renderModal(hideModal)}
    </Modal>
  );
};
