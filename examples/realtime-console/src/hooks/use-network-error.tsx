import { type MutableRefObject, useEffect, useRef, useState } from 'react';

import { NetworkQuality, StreamIndex } from '@volcengine/rtc';
import { EventNames, type RealtimeClient } from '@coze/realtime-api';

type ConnectStatus =
  | 'connected' // Connection successful
  | 'disconnected' // Connection disconnected
  | 'connecting' // Connecting
  | 'reconnecting'; // Network error, attempting to reconnect

const useNetworkError = ({
  clientRef,
}: {
  clientRef: MutableRefObject<RealtimeClient | null>;
}) => {
  const [connectStatus, setConnectStatus] =
    useState<ConnectStatus>('disconnected');
  const downStartTimeRef = useRef<number | null>(null);
  const isDisconnectedRef = useRef(false);

  useEffect(() => {
    // Check network status
    function checkNetworkStatus() {
      if (!navigator.onLine) {
        console.log('network offline');
        // When network anomaly is detected, immediately set connection status to reconnecting
        setConnectStatus('reconnecting');
      }
    }
    // Listen for online/offline events
    window.addEventListener('online', checkNetworkStatus);
    window.addEventListener('offline', checkNetworkStatus);

    const handleVisibilityChange = () => {
      console.log('visibilitychange', document.hidden);
      if (!document.hidden) {
        if (navigator.onLine && isDisconnectedRef.current) {
          setTimeout(async () => {
            try {
              isDisconnectedRef.current = false;
              await clientRef.current?.connect();
              console.log('reconnect success');
            } catch (e) {
              console.error('reconnect failed', e);
            }
          }, 1000);
        }
      }
    };

    // Listen for page visibility
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('online', checkNetworkStatus);
      window.removeEventListener('offline', checkNetworkStatus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!clientRef.current) {
      return;
    }

    const handleDisconnect = async (prefix: string) => {
      try {
        await clientRef.current?.disconnect();
        downStartTimeRef.current = null;
        isDisconnectedRef.current = true;
        console.log(`${prefix} disconnect success`);
      } catch (e) {
        console.error(`${prefix} disconnect failed`, e);
      }
    };

    // If DOWN state lasts more than 20 seconds, disconnect immediately
    const handleNetworkQuality = (uplinkNetworkQuality: NetworkQuality) => {
      // Track continuous DOWN state
      if (uplinkNetworkQuality === NetworkQuality.DOWN) {
        if (!downStartTimeRef.current) {
          downStartTimeRef.current = Date.now();
        }
        const duration = Date.now() - downStartTimeRef.current;
        console.log('Network down duration', duration / 1000);

        if (duration > 20 * 1000) {
          handleDisconnect('network down');
        }
      } else {
        downStartTimeRef.current = null;
      }
    };

    const handleIceState = (uplinkNetworkQuality: NetworkQuality) => {
      try {
        const iceState = clientRef.current?.getRtcEngine()?.iceState;

        if (uplinkNetworkQuality === NetworkQuality.DOWN) {
          setConnectStatus('reconnecting');
        } else {
          if (iceState === 'connected') {
            setConnectStatus('connected');
          } else {
            setConnectStatus('reconnecting');
          }
        }
      } catch (e) {
        console.error('get iceState failed', e);
        setConnectStatus('reconnecting');
      }
    };

    const handleConnectStatus = (eventName: string, data: unknown) => {
      switch (eventName) {
        case EventNames.CONNECTED:
          setConnectStatus('connected');
          break;
        case EventNames.DISCONNECTED:
          setConnectStatus('disconnected');
          break;
        case EventNames.CONNECTING:
          setConnectStatus('connecting');
          break;
        case EventNames.NETWORK_QUALITY: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const uplinkNetworkQuality = (data as any)
            .uplinkNetworkQuality as NetworkQuality;

          handleNetworkQuality(uplinkNetworkQuality);
          handleIceState(uplinkNetworkQuality);
          break;
        }
        case EventNames.BOT_LEAVE:
          handleDisconnect('bot leave');
          break;
        default:
          break;
      }
    };

    async function handleMicAccess() {
      if (clientRef.current?.isConnected === false || document.hidden) {
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach(track => track.stop()); // Release stream

        const localStream = clientRef.current
          ?.getRtcEngine()
          ?.getLocalStreamTrack(StreamIndex.STREAM_INDEX_MAIN, 'audio');
        if (!localStream) {
          handleDisconnect('local stream null');
        }
      } catch (error) {
        console.error('Microphone access failed:', error);
        handleDisconnect('microphone access failed');
      }
    }

    // Check every few seconds
    const timer = setInterval(handleMicAccess, 5000);

    clientRef.current?.on(EventNames.ALL, handleConnectStatus);

    return () => {
      clientRef.current?.off(EventNames.ALL, handleConnectStatus);
      clearInterval(timer);
    };
  }, [clientRef.current]);

  return { connectStatus };
};

export default useNetworkError;
