import { v4 as uuid } from 'uuid';

import PcmRecorder, {
  AIDenoiserProcessorLevel,
  AIDenoiserProcessorMode,
} from '../recorder/pcm-recorder';
import { type ChatUpdateEvent, WebsocketsEventType } from '../..';
import { type WsChatClientOptions, WsChatEventNames } from './types';
import BaseWsChatClient from './base';
import { getAudioDevices } from '../utils';
export { WsChatEventNames };

class WsChatClient extends BaseWsChatClient {
  public readonly recorder: PcmRecorder;

  constructor(config: WsChatClientOptions) {
    super(config);
    this.recorder = new PcmRecorder({
      audioCaptureConfig: config.audioCaptureConfig,
      aiDenoisingConfig: config.aiDenoisingConfig,
      mediaStreamTrack: config.mediaStreamTrack,
      wavRecordConfig: config.wavRecordConfig,
      debug: config.debug,
      deviceId: config.deviceId,
    });
    this.config = config;
  }

  private async startRecord() {
    // 1. start recorder
    await this.recorder.start();

    // init stream player
    await this.wavStreamPlayer.add16BitPCM(new ArrayBuffer(0), this.trackId);

    let startTime = performance.now();
    // 2. recording
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

        // this.log('input_audio_buffer_append', performance.now() - startTime);
        startTime = performance.now();
      },
      wavAudioCallback: (blob, name) => {
        const event = {
          event_type: 'audio.input.dump' as const,
          data: {
            name,
            wav: blob,
          },
        };
        this.emit(WsChatEventNames.AUDIO_INPUT_DUMP, event);
      },
      dumpAudioCallback: (blob, name) => {
        const event = {
          event_type: 'audio.input.dump' as const,
          data: {
            name,
            wav: blob,
          },
        };
        this.emit(WsChatEventNames.AUDIO_INPUT_DUMP, event);
      },
    });
  }

  async connect({
    chatUpdate,
  }: {
    chatUpdate?: ChatUpdateEvent;
  } = {}) {
    await this.init();

    await this.startRecord();
    const sampleRate = await this.recorder?.getSampleRate();

    this.ws?.send({
      id: chatUpdate?.id || uuid(),
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
    });

    this.emit(WsChatEventNames.CONNECTED, undefined);
  }

  async disconnect() {
    await this.wavStreamPlayer.interrupt();
    await this.recorder?.destroy();
    this.emit(WsChatEventNames.DISCONNECTED, undefined);

    await new Promise(resolve => setTimeout(resolve, 500));
    this.listeners.clear();
    this.closeWs();
  }

  /**
   * en: Set the audio enable
   * zh: 设置是否静音
   * @param enable - The enable to set
   */
  async setAudioEnable(enable: boolean) {
    const status = await this.recorder?.getStatus();
    if (enable) {
      if (status === 'ended') {
        await this.recorder?.resume();
        this.emit(WsChatEventNames.AUDIO_UNMUTED, undefined);
      } else {
        this.warn('recorder is not ended with status', status);
      }
    } else {
      if (status === 'recording') {
        await this.recorder.pause();
        this.emit(WsChatEventNames.AUDIO_MUTED, undefined);
      } else {
        this.warn('recorder is not recording with status', status);
      }
    }
  }

  /**
   * en: Set the audio input device
   * zh: 设置音频输入设备
   * @param deviceId - The device ID to set
   */
  async setAudioInputDevice(deviceId: string) {
    if (this.recorder.getStatus() !== 'ended') {
      await this.recorder.destroy();
    }
    const devices = await getAudioDevices();
    if (deviceId === 'default') {
      this.recorder.config.deviceId = undefined;
      this.startRecord();
      this.emit(WsChatEventNames.AUDIO_INPUT_DEVICE_CHANGED, undefined);
    } else {
      const device = devices.audioInputs.find(d => d.deviceId === deviceId);
      if (!device) {
        throw new Error(`Device with id ${deviceId} not found`);
      }
      this.recorder.config.deviceId = device.deviceId;
      this.startRecord();
      this.emit(WsChatEventNames.AUDIO_INPUT_DEVICE_CHANGED, undefined);
    }
  }

  /**
   * en: Interrupt the conversation
   * zh: 打断对话
   */
  interrupt() {
    this.ws?.send({
      id: uuid(),
      event_type: WebsocketsEventType.CONVERSATION_CHAT_CANCEL,
    });

    this.emit(WsChatEventNames.INTERRUPTED, undefined);
  }

  /**
   * en: Set the denoiser enabled
   * zh: 设置是否启用降噪
   * @param enabled - The enabled to set
   */
  setDenoiserEnabled(enabled: boolean) {
    this.recorder.setDenoiserEnabled(enabled);
    if (enabled) {
      this.emit(WsChatEventNames.DENOISER_ENABLED, undefined);
    } else {
      this.emit(WsChatEventNames.DENOISER_DISABLED, undefined);
    }
  }

  /**
   * en: Set the denoiser level
   * zh: 设置降噪等级
   * @param level - The level to set
   */
  setDenoiserLevel(level: AIDenoiserProcessorLevel) {
    this.log('setDenoiserLevel', level);
    this.recorder.setDenoiserLevel(level);
  }

  /**
   * en: Set the denoiser mode
   * zh: 设置降噪模式
   * @param mode - The mode to set
   */
  setDenoiserMode(mode: AIDenoiserProcessorMode) {
    this.log('setDenoiserMode', mode);
    this.recorder.setDenoiserMode(mode);
  }
}

export default WsChatClient;
