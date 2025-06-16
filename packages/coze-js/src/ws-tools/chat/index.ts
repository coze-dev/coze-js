import { v4 as uuid } from 'uuid';

import { WavStreamPlayer, type AudioFormat } from '../wavtools';
import {
  type AudioRecordEvent,
  ClientEventType,
  type WsChatClientOptions,
  WsChatEventNames,
} from '../types';
import {
  PcmRecorder,
  type AIDenoiserProcessorLevel,
  type AIDenoiserProcessorMode,
} from '../index';
import {
  type AudioCodec,
  type ChatUpdateEvent,
  type TurnDetectionType,
  WebsocketsEventType,
} from '../../index';
import BaseWsChatClient from './base';
import { getAudioDevices, setValueByPath } from '../utils';
export { WsChatEventNames };

function isMobileView() {
  return window.innerWidth <= 768; // 通常移动端宽度 <= 768px
}

class WsChatClient extends BaseWsChatClient {
  public recorder: PcmRecorder;
  private isMuted = false;
  private inputAudioCodec: AudioCodec = 'pcm';
  private turnDetection: TurnDetectionType = 'server_vad';
  private playbackVolume = 1.0;

  constructor(config: WsChatClientOptions) {
    super(config);

    const isMobile = config.enableLocalLoopback ?? isMobileView();

    this.wavStreamPlayer = new WavStreamPlayer({
      sampleRate: 24000,
      enableLocalLoopback: isMobile,
      volume: config.playbackVolumeDefault ?? 1,
      // firstFrameCallback: timestamp => {
      //   // this.ws?.send({
      //   //   id: uuid(),
      //   //   event_type: 'client.event',
      //   //   data: {
      //   //     first_audio_timestamp: timestamp,
      //   //   },
      //   // } as any);
      // },
    });

    this.recorder = new PcmRecorder({
      audioCaptureConfig: config.audioCaptureConfig,
      aiDenoisingConfig: config.aiDenoisingConfig,
      mediaStreamTrack: config.mediaStreamTrack,
      wavRecordConfig: config.wavRecordConfig,
      debug: config.debug,
      deviceId: config.deviceId,
    });
    this.isMuted = config.audioMutedDefault ?? false;
  }

  async startRecord() {
    if (this.recorder.getStatus() === 'recording') {
      console.warn('Recorder is already recording');
      return;
    }
    // 如果是客户端判停，需要先取消当前的播放
    if (this.turnDetection === 'client_interrupt') {
      this.interrupt();
    }
    // 1. start recorder
    await this.recorder.start(this.inputAudioCodec);

    // 获取原始麦克风输入用于本地回环
    const rawMediaStream = this.recorder.getRawMediaStream();
    if (!rawMediaStream) {
      throw new Error('无法获取原始麦克风输入');
    }
    this.wavStreamPlayer?.setMediaStream(rawMediaStream);

    // init stream player
    await this.wavStreamPlayer?.add16BitPCM(new ArrayBuffer(0), this.trackId);

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
        // startTime = performance.now();
      },
      wavAudioCallback: (blob, name) => {
        const event: AudioRecordEvent = {
          event_type: ClientEventType.AUDIO_INPUT_DUMP,
          data: {
            name,
            wav: blob,
          },
        };
        this.emit(WsChatEventNames.AUDIO_INPUT_DUMP, event);
      },
      dumpAudioCallback: (blob, name) => {
        const event: AudioRecordEvent = {
          event_type: ClientEventType.AUDIO_INPUT_DUMP,
          data: {
            name,
            wav: blob,
          },
        };
        this.emit(WsChatEventNames.AUDIO_INPUT_DUMP, event);
      },
    });
  }

  stopRecord() {
    if (this.recorder.getStatus() !== 'recording') {
      console.warn('Recorder is not recording');
      return;
    }
    this.recorder.destroy();
    this.ws?.send({
      id: Date.now().toString(),
      event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_COMPLETE,
    });
  }

  async connect({
    chatUpdate,
  }: {
    chatUpdate?: ChatUpdateEvent;
  } = {}) {
    const ws = await this.init();
    this.ws = ws;

    const sampleRate = await this.recorder?.getSampleRate();

    const event: ChatUpdateEvent = {
      id: chatUpdate?.id || uuid(),
      event_type: WebsocketsEventType.CHAT_UPDATE,
      data: {
        input_audio: {
          format: 'pcm',
          codec: 'pcm',
        },
        output_audio: {
          codec: 'pcm',
          pcm_config: {
            sample_rate: 24000,
          },
        },
        turn_detection: {
          type: 'server_vad',
        },
        need_play_prologue: true,
        ...chatUpdate?.data,
      },
    };

    if (this.config.voiceId) {
      setValueByPath(event, 'data.output_audio.voice_id', this.config.voiceId);
    }
    // 强制设置输入音频的采样率为系统默认的采样率
    setValueByPath(event, 'data.input_audio.sample_rate', sampleRate);

    this.wavStreamPlayer?.setSampleRate(
      event.data?.output_audio?.pcm_config?.sample_rate || 24000,
    );
    this.wavStreamPlayer?.setDefaultFormat(
      (event.data?.output_audio?.codec as AudioFormat) || 'pcm',
    );
    this.inputAudioCodec = event.data?.input_audio?.codec || 'pcm';
    this.outputAudioCodec = event.data?.output_audio?.codec || 'pcm';
    this.outputAudioSampleRate =
      event.data?.output_audio?.pcm_config?.sample_rate || 24000;

    // Turn detection mode: server_vad (server-side detection) or client_interrupt (client-side detection; requires manual startRecord/stopRecord)
    this.turnDetection = event.data?.turn_detection?.type || 'server_vad';

    if (!this.isMuted && this.turnDetection !== 'client_interrupt') {
      await this.startRecord();
    }

    this.ws.send(event);

    this.emit(WsChatEventNames.CONNECTED, event);
  }

  async disconnect() {
    this.ws?.send({
      id: uuid(),
      event_type: WebsocketsEventType.CONVERSATION_CHAT_CANCEL,
    });
    await this.recorder?.destroy();
    await this.wavStreamPlayer?.destroy();
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
    if (this.turnDetection === 'client_interrupt') {
      throw new Error('Client interrupt mode does not support setAudioEnable');
    }
    const status = await this.recorder?.getStatus();
    if (enable) {
      if (status === 'ended') {
        if (this.recorder.audioTrack) {
          await this.recorder?.resume();
        } else {
          await this.startRecord();
        }
        this.isMuted = false;
        this.emit(WsChatEventNames.AUDIO_UNMUTED, undefined);
      } else {
        this.warn('recorder is not ended with status', status);
      }
    } else {
      if (status === 'recording') {
        await this.recorder.pause();
        this.isMuted = true;
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
      if (!this.isMuted) {
        await this.startRecord();
      }
      this.emit(WsChatEventNames.AUDIO_INPUT_DEVICE_CHANGED, undefined);
    } else {
      const device = devices.audioInputs.find(d => d.deviceId === deviceId);
      if (!device) {
        throw new Error(`Device with id ${deviceId} not found`);
      }
      this.recorder.config.deviceId = device.deviceId;
      if (!this.isMuted) {
        await this.startRecord();
      }
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
   * en: Set the playback volume
   * zh: 设置播放音量
   * @param volume - The volume level to set (0.0 to 1.0)
   */
  setPlaybackVolume(volume: number) {
    this.playbackVolume = Math.max(0, Math.min(1, volume));
    this.wavStreamPlayer?.setVolume(this.playbackVolume);
  }

  /**
   * en: Get the playback volume
   * zh: 获取播放音量
   * @returns The current volume level (0.0 to 1.0)
   */
  getPlaybackVolume(): number {
    return this.wavStreamPlayer?.getVolume() ?? 0;
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
