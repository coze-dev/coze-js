import { v4 as uuid } from 'uuid';

import {
  type AIDenoiserProcessorLevel,
  type AIDenoiserProcessorMode,
} from '../recorder/pcm-recorder';
import {
  type SimultInterpretationUpdateEvent,
  WebsocketsEventType,
} from '../..';
import BaseWsSimultInterpretationClient from './base';

class WsSimultInterpretationClient extends BaseWsSimultInterpretationClient {
  private isRecording = false;

  private async connect(simultUpdate?: SimultInterpretationUpdateEvent) {
    await this.init();
    await this.recorder.start();

    const sampleRate = this.recorder.getSampleRate();
    if (simultUpdate?.data?.output_audio?.voice_id === '') {
      simultUpdate.data.output_audio.voice_id = undefined;
    }
    this.ws?.send({
      id: uuid(),
      event_type: WebsocketsEventType.SIMULT_INTERPRETATION_UPDATE,
      data: {
        input_audio: {
          format: 'pcm',
          codec: 'pcm',
          sample_rate: sampleRate,
          channel: 1,
          bit_depth: 16,
        },
        output_audio: {
          codec: 'pcm',
          pcm_config: {
            sample_rate: 24000,
          },
        },
        ...simultUpdate?.data,
      },
    });
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

  async start(chatUpdate?: SimultInterpretationUpdateEvent) {
    if (this.getStatus() === 'recording') {
      console.warn('Recording is already started');
      return;
    }
    await this.connect(chatUpdate);
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
export default WsSimultInterpretationClient;
