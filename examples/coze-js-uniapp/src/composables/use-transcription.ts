/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue';
import { WsTranscriptionClient } from '@coze/uniapp-api/ws-tools';
import {
  WebsocketsEventType,
  type CommonErrorEvent,
  type TranscriptionsMessageCompletedEvent,
  type TranscriptionsMessageUpdateEvent,
} from '@coze/api';

import { cozeClient } from '../api/client';

/**
 * Composable for handling speech-to-text transcription
 */
export function useTranscription() {
  // Client instance
  const transcriptionClient = ref<WsTranscriptionClient>();

  // UI state
  const isRecording = ref(false);
  const isPaused = ref(false);
  const errorMessage = ref('');
  const transcriptionText = ref('');

  // Initialize the transcription client
  const initClient = () => {
    try {
      if (!transcriptionClient.value) {
        transcriptionClient.value = new WsTranscriptionClient({
          ...cozeClient.options,
          debug: true,
        });

        // Set up event listeners
        transcriptionClient.value.on(
          WebsocketsEventType.TRANSCRIPTIONS_MESSAGE_UPDATE,
          data => {
            const event = data as TranscriptionsMessageUpdateEvent;
            // Handle partial transcription results
            if (event.data.content) {
              transcriptionText.value = event.data.content;
            }
          },
        );

        transcriptionClient.value.on(
          WebsocketsEventType.TRANSCRIPTIONS_MESSAGE_COMPLETED,
          data => {
            // Handle final transcription results
            const event = data as TranscriptionsMessageCompletedEvent;
            if (event.data.content) {
              transcriptionText.value = event.data.content;
            }
            isRecording.value = false;
            isPaused.value = false;
          },
        );

        transcriptionClient.value.on(WebsocketsEventType.ERROR, error => {
          console.error('Transcription error:', error);
          const errorData = error as CommonErrorEvent;
          errorMessage.value =
            errorData?.data?.msg || 'Error during transcription';
          isRecording.value = false;
          isPaused.value = false;
        });
      }
    } catch (error: any) {
      console.error('Failed to initialize transcription client:', error);
      errorMessage.value = `Initialization failed: ${error.message || 'Unknown error'}`;
    }
  };

  // Start recording and transcribing
  const startRecording = async () => {
    errorMessage.value = '';

    try {
      if (!transcriptionClient.value) {
        initClient();
      }

      await transcriptionClient.value?.start();
      isRecording.value = true;
      isPaused.value = false;
    } catch (error: any) {
      console.error('Failed to start recording:', error);
      errorMessage.value = `Start failed: ${error.message || 'Unknown error'}`;
    }
  };

  // Stop recording and finalize transcription
  const stopRecording = () => {
    if (isRecording.value && transcriptionClient.value) {
      try {
        transcriptionClient.value.stop();
        isRecording.value = false;
        isPaused.value = false;
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
  };

  // Pause recording temporarily
  const pauseRecording = () => {
    if (isRecording.value && !isPaused.value && transcriptionClient.value) {
      try {
        transcriptionClient.value.pause();
        isPaused.value = true;
      } catch (error) {
        console.error('Error pausing recording:', error);
      }
    }
  };

  // Resume recording after pause
  const resumeRecording = () => {
    if (isRecording.value && isPaused.value && transcriptionClient.value) {
      try {
        transcriptionClient.value.resume();
        isPaused.value = false;
      } catch (error) {
        console.error('Error resuming recording:', error);
      }
    }
  };

  // Clean up resources
  const destroy = () => {
    if (transcriptionClient.value) {
      transcriptionClient.value.destroy();
      transcriptionClient.value = undefined;
    }
    isRecording.value = false;
    isPaused.value = false;
  };

  return {
    isRecording,
    isPaused,
    transcriptionText,
    errorMessage,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    destroy,
  };
}
