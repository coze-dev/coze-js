/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue';
import { WsSpeechClient } from '@coze/uniapp-api/ws-tools';
import { WebsocketsEventType } from '@coze/api';

import { cozeClient } from '../api/client';

export function useSpeech() {
  // Create a ref to hold our speech client instance
  const speechClient = ref<WsSpeechClient>();
  const errorMessage = ref('');
  const isPlaying = ref(false);

  // Initialize WebSocket connection and speech client
  const initClient = () => {
    try {
      // Create WsSpeechClient instance
      if (!speechClient.value) {
        speechClient.value = new WsSpeechClient({
          // Pass any configurations if needed
          ...cozeClient.options,
        });

        // Setup event listeners
        speechClient.value.on('completed', () => {
          console.log('Speech playback completed');
          isPlaying.value = false;
        });

        speechClient.value.on(WebsocketsEventType.ERROR, error => {
          const errorData = error as any;
          console.error('Speech error:', errorData);
          errorMessage.value =
            errorData?.data?.msg || 'Error during processing';
          isPlaying.value = false;
        });
      }
    } catch (error: any) {
      console.error('Failed to initialize speech client:', error);
      errorMessage.value = `Connection failed: ${error.message || 'Unknown error'}`;
    }
  };

  // Send text-to-speech request
  const convertTextToSpeech = async (text: string) => {
    if (!text) {
      errorMessage.value = 'Please enter text to convert';
      return;
    }

    if (!speechClient.value) {
      initClient();
    }

    try {
      // Connect to the speech service
      await speechClient.value?.connect();
      errorMessage.value = '';
      // Using the simplified SDK method to send the text and start processing
      speechClient.value?.appendAndComplete(text);
      isPlaying.value = true;
    } catch (error: any) {
      console.error('Failed to send text-to-speech request:', error);
      errorMessage.value = `Request failed: ${error.message || 'Unknown error'}`;
      isPlaying.value = false;
    }
  };

  // Abort current request
  const abortRequest = async () => {
    if (isPlaying.value && speechClient.value) {
      try {
        // Interrupt the current speech
        await speechClient.value.interrupt();
        isPlaying.value = false;
      } catch (error) {
        console.error('Error aborting request:', error);
      }
    }
  };

  // Toggle play/pause
  const togglePlayback = async () => {
    if (speechClient.value) {
      try {
        await speechClient.value.togglePlay();
        isPlaying.value = speechClient.value.isPlaying();
      } catch (error) {
        console.error('Error toggling playback:', error);
      }
    }
  };

  return {
    isPlaying,
    errorMessage,
    initClient,
    convertTextToSpeech,
    abortRequest,
    togglePlayback,
  };
}
