import { logger } from '@/libs/utils';
import { InputType } from '@/libs/ui-kit/chat-input/type';
import { Language } from '@/libs/types';

import { useChatInfoStore, useChatPropsStore, useI18n } from '../context';

export const useVoiceInfo = () => {
  const voiceInfo = useChatInfoStore(store => store.info?.voiceInfo);

  return voiceInfo;
};
export const useIsNeedAudioInput = () => {
  const isNeedAudio = useChatPropsStore(
    store => store.ui?.chatSlot?.input?.isNeedAudio,
  );
  /*const isWeixinWeb = useMemo(() => {
    if (isWeb) {
      if (navigator.userAgent.includes("wechat")) {
        return true;
      }
    }
    return false;
  }, []);*/
  // Tha audio input is not suppotted in weixin webview
  return isNeedAudio || false;
};

export const useDefaultInputMode = () => {
  const defaultMode = useChatInfoStore(store => store.info?.inputMode?.default);
  const isNeedAudio = useIsNeedAudioInput();
  return defaultMode === 2 && isNeedAudio ? InputType.Voice : InputType.Text;
};

export const useVoiceId = () => {
  const voiceInfo = useChatInfoStore(store => store.info?.voiceInfo);
  const i18n = useI18n();
  const langList =
    i18n.language === Language.ZH_CN ? ['zh', 'en'] : ['en', 'zh'];
  let voiceId;
  for (let i = 0; i < langList.length; i++) {
    if (voiceInfo?.voiceConfigMap?.[langList[i]]?.voice_id) {
      voiceId = voiceInfo?.voiceConfigMap?.[langList[i]]?.voice_id;
    }
  }
  logger.debug('useVoiceId voiceInfo:', voiceInfo, voiceId);
  return voiceId;
};

export const useIsNeedTextToAudio = () => {
  const voiceInfo = useVoiceInfo();
  const voiceId = useVoiceId();
  logger.debug('useIsNeedAudioInput info:', {
    voiceId,
    isNeedTextToAudio: (voiceId && !!voiceInfo?.isTextToVoiceEnable) || false,
  });
  return (voiceId && !!voiceInfo?.isTextToVoiceEnable) || false;
};
