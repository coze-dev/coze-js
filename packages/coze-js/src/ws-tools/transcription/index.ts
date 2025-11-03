import { v4 as uuid } from 'uuid';

import {
  type AIDenoiserProcessorLevel,
  type AIDenoiserProcessorMode,
} from '../recorder/pcm-recorder';
import {
  type AudioConfig,
  type TranscriptionsUpdateEvent,
} from '../../resources/websockets/types';
import { WebsocketsEventType } from '../..';
import BaseWsTranscriptionClient from './base';

class WsTranscriptionClient extends BaseWsTranscriptionClient {
  private isRecording = false;

  private async connect() {
    await this.init();
    await this.recorder.start();
    const sampleRate = this.recorder.getSampleRate();
    this.ws?.send({
      id: uuid(),
      event_type: WebsocketsEventType.TRANSCRIPTIONS_UPDATE,
      data: this.getInitialUpdateData(sampleRate),
    });
  }

  private getInitialUpdateData(
    sampleRate: number,
  ): TranscriptionsUpdateEvent['data'] {
    const defaultInputAudio: AudioConfig = {
      format: 'pcm',
      codec: 'pcm',
      sample_rate: sampleRate,
      channel: 1,
      bit_depth: 16,
    };

    const customUpdateData = this.config.transcriptionUpdateData;

    if (!customUpdateData) {
      return {
        input_audio: defaultInputAudio,
      };
    }

    if (!customUpdateData.input_audio) {
      return {
        ...customUpdateData,
        input_audio: defaultInputAudio,
      };
    }

    return {
      ...customUpdateData,
      input_audio: {
        ...defaultInputAudio,
        ...customUpdateData.input_audio,
      },
    };
  }

  destroy() {
    this.recorder.destroy();
    this.listeners.clear();
    this.closeWs();
  }

  getStatus() {
    if (this.isRecording) {
      if (this.recorder.getStatus() === 'ended') {
        return 'paused';
      }
      return 'recording';
    }
    return 'ended';
  }

  async start() {
    if (this.getStatus() === 'recording') {
      console.warn('Recording is already started');
      return;
    }
    await this.connect();
    await this.recorder.record({
      pcmAudioCallback: data => {
        const { raw } = data;

        // Convert ArrayBuffer to base64 string
        const base64String = btoa(
          Array.from(new Uint8Array(raw))
            .map(byte => String.fromCharCode(byte))
            .join(''),
        );

        // send audio to ws
        this.ws?.send({
          id: uuid(),
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
   * 停止录音，提交结果
   */
  stop() {
    this.ws?.send({
      id: uuid(),
      event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_COMPLETE,
    });
    this.recorder.destroy();
    this.closeWs();
    this.isRecording = false;
  }

  /**
   * 暂停录音（保留上下文）
   */
  pause() {
    if (this.getStatus() !== 'recording') {
      throw new Error('Recording is not started');
    }
    return this.recorder.pause();
  }

  /**
   * 恢复录音
   */
  resume() {
    if (this.getStatus() !== 'paused') {
      throw new Error('Recording is not paused');
    }
    return this.recorder.resume();
  }

  getDenoiserEnabled() {
    return this.recorder.getDenoiserEnabled();
  }

  setDenoiserEnabled(enabled: boolean) {
    return this.recorder.setDenoiserEnabled(enabled);
  }

  setDenoiserMode(mode: AIDenoiserProcessorMode) {
    return this.recorder.setDenoiserMode(mode);
  }

  setDenoiserLevel(level: AIDenoiserProcessorLevel) {
    return this.recorder.setDenoiserLevel(level);
  }
}
export default WsTranscriptionClient;
