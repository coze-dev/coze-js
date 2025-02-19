export enum UIEventType {
  FrameClick = "frame-click",
  ChatToastShow = "chat-toast-show",
  KeyDown = "key-down-event",
  KeyUp = "key-up-event",
  TriggerFocus = "trigger-focus",
  FrameFocus = "frame-focus",
  FrameBlur = "frame-blur",
  ChatModalShow = "chat-modal-show",
  ChatSlotToBottom = "chat-slot-to-bottom",
  ChatSlotScrollToAnchorBottom = "chat-slot-scroll-to-anchor-bottom",
  ChatSlotRemoveAnchorBottom = "chat-slot-remove-anchor-bottom",
}

export interface UIChatToastEvent {
  content: string | React.ReactNode;
  icon: "success" | "error" | "none";
  duration?: number;
}

export interface UIModalEvent {
  renderModal: (hideModal: () => void) => React.ReactNode;
  isNeedMask?: boolean; //默认是true
}
