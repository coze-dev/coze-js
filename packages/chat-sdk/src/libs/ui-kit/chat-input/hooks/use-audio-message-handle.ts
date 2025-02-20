import { useEffect, useState } from 'react';

import { logger, isWeb } from '@/libs/utils';
import { UIEventType } from '@/libs/types';
import { usePersistCallback } from '@/libs/hooks';

import { type IChatInputProps, InputType } from '../type';

interface IMultiModalMessageOptions {
  inputType: InputType;
}

export const useAudioMessageHandle = (
  chatInputProps: IChatInputProps,
  options: IMultiModalMessageOptions,
) => {
  const { onAudioRecording, frameEventTarget } = chatInputProps;
  const { inputType } = options;
  const [isAudioInputFocusing, setIsAudioInputFocusing] = useState(false);
  const isRealAudioInputFocusing =
    inputType === InputType.Voice && isAudioInputFocusing;

  const [isRecording, setIsRecording] = useState(false);
  const onRecording = usePersistCallback((isRecordingNew: boolean) => {
    setIsRecording(isRecordingNew);
    onAudioRecording?.(isRecordingNew);
  });

  useEffect(() => {
    logger.debug('useAudioMessageHandle listen focus and blur', {
      isWeb,
      frameEventTarget,
    });
    if (isWeb && frameEventTarget) {
      const onFocus = () => {
        logger.debug('useAudioMessageHandle focus in');
        setIsAudioInputFocusing(true);
      };
      const onBlur = () => {
        logger.debug('useAudioMessageHandle blur in');
        setIsAudioInputFocusing(false);
      };

      frameEventTarget.on(UIEventType.FrameFocus, onFocus);
      frameEventTarget.on(UIEventType.FrameBlur, onBlur);
      frameEventTarget.trigger(UIEventType.TriggerFocus);

      return () => {
        frameEventTarget.off(UIEventType.FrameFocus, onFocus);
        frameEventTarget.off(UIEventType.FrameBlur, onBlur);
      };
    }
  }, []);
  return {
    isRecording,
    isRealAudioInputFocusing,
    onRecording,
  };
};
