import { useCallback } from 'react';

import { useApiClientStore, useVoiceId } from '../provider';

export const useAudioSpeech = () => {
  const { chatService } = useApiClientStore(store => ({
    chatService: store.chatService,
  }));
  const voiceId = useVoiceId();

  const audioSpeech = useCallback(
    (input: string) =>
      chatService.audioSpeech({
        input,
        voice_id: voiceId,
        response_format: 'wav',
        sampling_rate: 8000,
      }),
    [chatService, voiceId],
  );
  return {
    audioSpeech,
  };
};
