interface OpDisabledState {
  clearMessage: boolean;
  input: boolean;
  clearContext: boolean;
}
interface ChatStatusAction {
  setIsReadonly: (isReadonly: boolean) => void;
  setIsDeleting: (isDeleting: boolean) => void;
  setIsSendingMsg: (isSendingMsg: boolean) => void;
  setIsClearingContext: (isClearingContext: boolean) => void;
  setIsAudioRecording: (isRecording: boolean) => void;

  disableState: OpDisabledState;
  getOpDisabledState: () => OpDisabledState;
  setOpDisabledState: () => void;
}

interface ChatStatusState {
  isReadonly: boolean;
  isDeleting: boolean;
  isSendingMsg: boolean;
  isClearingContext: boolean;
  isAudioRecording: boolean;
}

export type ChatStatusStore = ChatStatusAction & ChatStatusState;
