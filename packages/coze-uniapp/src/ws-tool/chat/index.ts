import { type ChatUpdateEvent, WebsocketsEventType } from '@coze/api';

import { PcmRecorder, RecordingStatus } from '../pcm-recorder';
import { WsChatEventNames } from './event-names';
import BaseWsChatClient, { type WsChatClientOptions } from './base';
import { type AudioFormat } from '../pcm-stream-player';

export { WsChatClientOptions, WsChatEventNames };

/**
 * WebSocket Chat Client for WeChat Mini Program
 * Implements real-time chat functionality with audio support
 */
class WsChatClient extends BaseWsChatClient {
  public recorder: PcmRecorder;
  private isMuted = false;
  private turnDetection: 'server_vad' | 'client_vad' = 'server_vad';

  /**
   * Create a new WsChatClient instance
   * @param {any} config - Configuration options
   */
  constructor(config: WsChatClientOptions) {
    super(config);

    this.recorder = new PcmRecorder({
      sampleRate: 16000,
      debug: true,
    });

    this.isMuted = config.audioMutedDefault ?? false;
  }

  /**
   * Start recording audio and sending audio data to server
   * @private
   */
  startRecord() {
    if (this.recorder.getStatus() === RecordingStatus.RECORDING) {
      console.warn('Recorder is already recording');
      return;
    }
    // 如果是客户端判停，需要先取消当前的播放
    if (this.turnDetection === 'client_vad') {
      this.interrupt();
    }
    // 1. Start recorder
    this.recorder.start();

    // Initialize audio playback
    // await this.wavStreamPlayer.add16BitPCM(new ArrayBuffer(0), this.trackId);

    // 2. Register audio data callback
    this.recorder.record({
      pcmAudioCallback: data => {
        const { raw } = data;

        // Convert ArrayBuffer to base64 string for UniApp
        const base64String = this.arrayBufferToBase64(raw);

        // Send audio to WebSocket
        this.ws?.send({
          id: Date.now().toString(),
          event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_APPEND,
          data: {
            delta: base64String,
          },
        });
      },
    });
  }

  /**
   * Stop recording audio
   */
  stopRecord() {
    if (this.recorder.getStatus() !== RecordingStatus.RECORDING) {
      console.warn('Recorder is not recording');
      return;
    }
    this.recorder.destroy();
    this.ws?.send({
      id: Date.now().toString(),
      event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_COMPLETE,
    });
  }

  /**
   * Convert ArrayBuffer to Base64 string for WeChat Mini Program
   * @param {ArrayBuffer} buffer - The buffer to convert
   * @returns {string} - Base64 string
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    // WeChat Mini Program provides a utility function for this conversion
    return uni.arrayBufferToBase64(buffer);
  }

  /**
   * Connect to the chat server and start recording if not muted
   * @param {Object} options - Connection options
   * @param {ChatUpdateEvent} [options.chatUpdate] - Initial chat update event
   * @returns {Promise<void>} - Promise that resolves when connected
   */
  async connect({
    chatUpdate,
  }: {
    chatUpdate?: Partial<ChatUpdateEvent>;
  } = {}) {
    const ws = await this.init();
    this.ws = ws;

    const sampleRate = this.recorder.getSampleRate();
    console.log('sampleRate', sampleRate);

    const event: ChatUpdateEvent = {
      id: chatUpdate?.id || Date.now().toString(),
      event_type: WebsocketsEventType.CHAT_UPDATE,
      data: {
        input_audio: {
          format: 'pcm',
          codec: 'pcm',
          sample_rate: sampleRate,
        },
        output_audio: {
          codec: 'pcm',
          pcm_config: {
            sample_rate: 24000,
          },
          voice_id: this.config.voiceId || undefined,
        },
        turn_detection: {
          type: 'server_vad',
        },
        need_play_prologue: true,
        ...chatUpdate?.data,
      },
    };
    this.ws.send(event);

    // 设置音频播放器的默认格式和采样率
    this.wavStreamPlayer.setDefaultFormat(
      (event.data?.output_audio?.codec as AudioFormat) || 'g711a',
    );
    this.wavStreamPlayer.setSampleRate(
      event.data?.output_audio?.pcm_config?.sample_rate || 8000,
    );

    // 判停模式，server_vad（服务端判停） 或 client_vad（客户端判停，需自行调用 startRecord/stopRecord）
    this.turnDetection = event.data?.turn_detection?.type || 'server_vad';

    console.debug('chat.update:', event);

    // Start recording if not muted && not client_vad
    if (!this.isMuted && this.turnDetection !== 'client_vad') {
      await this.startRecord();
    }

    this.emit(WsChatEventNames.CONNECTED, event);
  }

  /**
   * Disconnect from the chat server and clean up resources
   * @returns {Promise<void>} - Promise that resolves when disconnected
   */
  async disconnect() {
    this.ws?.send({
      id: Date.now().toString(),
      event_type: WebsocketsEventType.CONVERSATION_CHAT_CANCEL,
    });
    this.recorder.destroy();
    this.emit(WsChatEventNames.DISCONNECTED, undefined);

    await new Promise(resolve => setTimeout(resolve, 500));
    this.listeners.clear();
    this.closeWs();
  }

  /**
   * Enable or disable audio input
   * @param {boolean} enable - Whether to enable audio
   * @returns {Promise<void>} - Promise that resolves when the operation completes
   */
  async setAudioEnable(enable: boolean) {
    if (this.turnDetection === 'client_vad') {
      throw new Error('Client VAD mode does not support setAudioEnable');
    }
    const status = this.recorder.getStatus();
    if (enable) {
      if (status === RecordingStatus.IDLE) {
        await this.startRecord();
        this.isMuted = false;
        this.emit(WsChatEventNames.AUDIO_UNMUTED, undefined);
      } else if (status === RecordingStatus.PAUSED) {
        await this.recorder.resume();
        this.isMuted = false;
        this.emit(WsChatEventNames.AUDIO_UNMUTED, undefined);
      } else {
        this.warn('Recorder is already active with status', status);
      }
    } else {
      if (status === RecordingStatus.RECORDING) {
        await this.recorder.pause();
        this.isMuted = true;
        this.emit(WsChatEventNames.AUDIO_MUTED, undefined);
      } else {
        this.warn('Recorder is not recording with status', status);
      }
    }
  }

  /**
   * Interrupt the current conversation
   */
  interrupt() {
    this.ws?.send({
      id: Date.now().toString(),
      event_type: WebsocketsEventType.CONVERSATION_CHAT_CANCEL,
    });

    this.emit(WsChatEventNames.INTERRUPTED, undefined);
  }
}

export { WsChatClient };
