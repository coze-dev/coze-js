import { WebsocketsEventType } from '@coze/api';

import BaseWsTranscriptionClient from './base';
import { RecordingStatus } from '../pcm-recorder';

/**
 * WebSocket transcription client for UniApp/WeChat Mini Program
 * Handles speech-to-text conversion through WebSockets
 */
export class WsTranscriptionClient extends BaseWsTranscriptionClient {
  /**
   * Flag to track if recording is in progress
   */
  private isRecording = false;

  /**
   * Generate a UUID for message identification
   * @private
   * @returns {string} - UUID string
   */
  private static uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Establish WebSocket connection and configure audio format
   * @private
   */
  private async connect() {
    await this.init();
    await this.recorder.start();
    const sampleRate = this.recorder.getSampleRate();

    this.ws?.send({
      id: WsTranscriptionClient.uuid(),
      event_type: WebsocketsEventType.TRANSCRIPTIONS_UPDATE,
      data: {
        input_audio: {
          format: 'pcm',
          codec: 'pcm',
          sample_rate: sampleRate,
          channel: 1,
          bit_depth: 16,
        },
      },
    });
  }

  /**
   * Clean up resources and close connections
   */
  destroy() {
    this.recorder.destroy();
    this.listeners.clear();
    this.closeWs();
  }

  /**
   * Get current recording status
   * @returns {string} - Current status: 'recording', 'paused', or 'ended'
   */
  getStatus() {
    if (this.isRecording) {
      if (this.recorder.getStatus() === RecordingStatus.PAUSED) {
        return 'paused';
      }
      return 'recording';
    }
    return 'ended';
  }

  /**
   * Start recording and transcription
   */
  async start() {
    if (this.getStatus() === 'recording') {
      console.warn('Recording is already started');
      return;
    }

    await this.connect();
    await this.recorder.record({
      pcmAudioCallback: data => {
        const { raw } = data;

        console.log('Raw PCM data received:', raw, this.ws);

        // Convert ArrayBuffer to base64 string for UniApp
        const base64String = this.arrayBufferToBase64(raw);

        // Send audio to WebSocket
        this.ws?.send({
          id: WsTranscriptionClient.uuid(),
          event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_APPEND,
          data: {
            delta: base64String,
          },
        });
      },
    });

    this.isRecording = true;
  }

  /**
   * Convert ArrayBuffer to base64 string (WeChat Mini Program compatible)
   * @param {ArrayBuffer} buffer - The ArrayBuffer to convert
   * @returns {string} - Base64 string
   * @private
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    // Use UniApp's method to convert ArrayBuffer to base64
    return uni.arrayBufferToBase64(buffer);
  }

  /**
   * Stop recording and complete transcription
   */
  stop() {
    this.ws?.send({
      id: WsTranscriptionClient.uuid(),
      event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_COMPLETE,
    });

    this.recorder.destroy();
    this.closeWs();
    this.isRecording = false;
  }

  /**
   * Pause recording (retain context)
   */
  pause() {
    if (this.getStatus() !== 'recording') {
      throw new Error('Recording is not started');
    }

    return this.recorder.pause();
  }

  /**
   * Resume recording after pause
   */
  resume() {
    if (this.getStatus() !== 'paused') {
      throw new Error('Recording is not paused');
    }

    return this.recorder.resume();
  }
}

export default WsTranscriptionClient;
