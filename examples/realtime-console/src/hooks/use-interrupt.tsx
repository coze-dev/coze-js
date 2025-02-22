import { type MutableRefObject, useCallback, useEffect, useRef } from 'react';

import { EventNames, RealtimeClient } from '@coze/realtime-api';
import { APIError } from '@coze/api';

import { getBaseUrl, getOrRefreshToken } from '../utils/utils';
import { LocalManager, LocalStorageKey } from '../utils/local-manager';

const useInterrupt = ({
  clientRef,
}: {
  clientRef: MutableRefObject<RealtimeClient | null>;
}) => {
  const interruptClientRef = useRef<RealtimeClient | null>(null);

  const startInterrupt = useCallback(async () => {
    console.log('[interrupt] startInterrupt');

    try {
      if (interruptClientRef.current) {
        await interruptClientRef.current.setAudioEnable(true);
        return;
      }

      const localManager = new LocalManager();
      const accessToken = await getOrRefreshToken(localManager);
      const botId =
        localManager.get(LocalStorageKey.INTERRUPT_BOT_ID) ||
        localManager.get(LocalStorageKey.BOT_ID);

      const client = new RealtimeClient({
        baseURL: getBaseUrl(),
        accessToken,
        botId, // Better results with customized bot agent
        connectorId: '1024',
        suppressStationaryNoise: true,
        suppressNonStationaryNoise: true,
        isAutoSubscribeAudio: false,
      });
      interruptClientRef.current = client;

      await client.connect();

      const interruptText = localManager.get(LocalStorageKey.INTERRUPT_TEXT);

      client.on(EventNames.ALL, (eventName: string, data: unknown) => {
        if (
          eventName === 'server.conversation.message.completed' ||
          eventName === 'server.conversation.audio_transcript.delta'
        ) {
          const { content } = (data as { data: { content: string } }).data;
          console.log('[interrupt] content', content);
          const interruptTexts = interruptText.split(';');
          const isInterrupt = interruptTexts.some(text =>
            content.includes(text),
          );
          if (isInterrupt) {
            clientRef.current?.interrupt();
          }
        }
      });
    } catch (error) {
      if (error instanceof APIError) {
        console.error('[interrupt] startInterrupt error', error.rawError);
      } else {
        console.error('[interrupt] startInterrupt error', error);
      }
    }
  }, [clientRef]);

  const stopInterrupt = useCallback(async () => {
    console.log('[interrupt] stopInterrupt', interruptClientRef.current);
    try {
      await interruptClientRef.current?.interrupt();
      await interruptClientRef.current?.setAudioEnable(false);
    } catch (e) {
      console.error('[interrupt] stopInterrupt error', e);
    }
  }, []);

  const handleMessage = async (eventName: string) => {
    const localManager = new LocalManager();
    const interruptText = localManager.get(LocalStorageKey.INTERRUPT_TEXT);
    if (!interruptText) {
      return;
    }

    try {
      if (eventName === 'server.audio.agent.speech_started') {
        await startInterrupt();
        clientRef.current?.setAudioEnable(false);
      } else if (eventName === 'server.audio.agent.speech_stopped') {
        await stopInterrupt();
        clientRef.current?.setAudioEnable(true);
      }
    } catch (e) {
      console.error('[interrupt] handleMessage error', e);
    }
  };

  useEffect(() => {
    if (!clientRef.current) {
      stopInterrupt();
    }
  }, [clientRef.current]);

  return {
    handleMessage,
  };
};

export default useInterrupt;
