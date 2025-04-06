import {
  createMicrophoneAudioTrack,
  type ILocalAudioTrack,
  createCustomAudioTrack,
} from 'agora-rtc-sdk-ng/esm';
import AgoraRTC from 'agora-rtc-sdk-ng';
import {
  AIDenoiserExtension,
  AIDenoiserProcessor,
} from 'agora-extension-ai-denoiser';

import PcmAudioProcessor from './processor/pcm-audio-processor';
import {
  type AIDenoisingConfig,
  type AudioCaptureConfig,
  type WavRecordConfig,
} from '../chat/types';
import WavAudioProcessor from './processor/wav-audio-processor';
import { IAudioProcessor } from 'agora-rte-extension';
import { checkDenoiserSupport } from '../utils';

export enum AIDenoiserProcessorMode {
  NSNG = 'NSNG',
  STATIONARY_NS = 'STATIONARY_NS',
}
export enum AIDenoiserProcessorLevel {
  SOFT = 'SOFT',
  AGGRESSIVE = 'AGGRESSIVE',
}

export interface PcmRecorderConfig {
  audioCaptureConfig?: AudioCaptureConfig;
  aiDenoisingConfig?: AIDenoisingConfig;
  mediaStreamTrack?: MediaStreamTrack;
  wavRecordConfig?: WavRecordConfig;
  deviceId?: string;
  debug?: boolean;
}

class PcmRecorder {
  private audioTrack: ILocalAudioTrack | undefined;
  private stream: MediaStream | undefined;
  private recording = false;
  private static denoiser: AIDenoiserExtension | undefined;
  private wavAudioProcessor: WavAudioProcessor | undefined;
  private pcmAudioProcessor: PcmAudioProcessor | undefined;
  private wavAudioProcessor2: WavAudioProcessor | undefined;
  private processor: AIDenoiserProcessor | undefined;
  private pcmAudioCallback: ((data: { raw: ArrayBuffer }) => void) | undefined;
  private wavAudioCallback: ((blob: Blob, name: string) => void) | undefined;
  private dumpAudioCallback: ((blob: Blob, name: string) => void) | undefined;
  private static aiDenoiserSupport: boolean = false;

  public config: PcmRecorderConfig;
  constructor(config: PcmRecorderConfig) {
    config.audioCaptureConfig = config.audioCaptureConfig ?? {};
    config.aiDenoisingConfig = config.aiDenoisingConfig ?? {};
    this.config = config;
    const { audioCaptureConfig, aiDenoisingConfig } = config;

    if (checkDenoiserSupport(config.aiDenoisingConfig?.assetsPath)) {
      PcmRecorder.aiDenoiserSupport = true;
      PcmRecorder.denoiser = window.__denoiser;
    }

    if (aiDenoisingConfig?.mode && PcmRecorder.aiDenoiserSupport) {
      // 同时使用两种降噪方案时，则强制开启音频增益控制和禁用自动噪声抑制
      audioCaptureConfig.autoGainControl = true;
      audioCaptureConfig.noiseSuppression = false;
    }
  }

  async start() {
    const {
      deviceId,
      mediaStreamTrack,
      audioCaptureConfig,
      wavRecordConfig,
      debug,
    } = this.config;
    if (mediaStreamTrack) {
      this.audioTrack = await createCustomAudioTrack({
        mediaStreamTrack,
      });
    } else {
      // Get microphone audio track
      // See:https://api-ref.agora.io/en/video-sdk/web/4.x/interfaces/microphoneaudiotrackinitconfig.html
      this.audioTrack = await createMicrophoneAudioTrack({
        AEC: audioCaptureConfig?.echoCancellation ?? true, // 是否开启回声消除
        ANS: audioCaptureConfig?.noiseSuppression ?? true, // 是否开启自动噪声抑制
        AGC: audioCaptureConfig?.autoGainControl ?? true, // 是否开启音频增益控制
        microphoneId: deviceId,
        encoderConfig: {
          sampleRate: 44100,
        },
      });
    }

    this.stream = new MediaStream([this.audioTrack.getMediaStreamTrack()]);

    // 降噪前音频
    if (debug && wavRecordConfig?.enableSourceRecord) {
      this.wavAudioProcessor = new WavAudioProcessor(audioData => {
        this.wavAudioCallback?.(audioData.wav, 'source');
      });
    }

    // 降噪后音频
    if (debug && wavRecordConfig?.enableDenoiseRecord) {
      this.wavAudioProcessor2 = new WavAudioProcessor(audioData => {
        this.wavAudioCallback?.(audioData.wav, 'denoise');
      });
    }

    // pcm 音频处理
    this.pcmAudioProcessor = new PcmAudioProcessor(data => {
      this.pcmAudioCallback?.({ raw: data });
    });

    let audioProcessor: IAudioProcessor | undefined;
    if (this.isSupportAIDenoiser()) {
      this.log('support ai denoiser');
      this.processor = PcmRecorder.denoiser!.createProcessor();

      if (this.wavAudioProcessor) {
        audioProcessor = this.audioTrack
          .pipe(this.wavAudioProcessor)
          .pipe(this.processor);
      } else {
        audioProcessor = this.audioTrack.pipe(this.processor);
      }

      audioProcessor = audioProcessor.pipe(this.pcmAudioProcessor);

      if (this.wavAudioProcessor2) {
        audioProcessor = audioProcessor.pipe(this.wavAudioProcessor2);
      }
      audioProcessor.pipe(this.audioTrack.processorDestination);

      this.handleProcessor();
    } else {
      audioProcessor = this.audioTrack.pipe(this.pcmAudioProcessor);
      if (this.wavAudioProcessor) {
        audioProcessor = audioProcessor.pipe(this.wavAudioProcessor);
      }

      audioProcessor.pipe(this.audioTrack.processorDestination);
    }
  }

  async record({
    pcmAudioCallback,
    wavAudioCallback,
    dumpAudioCallback,
  }: {
    pcmAudioCallback?: (data: { raw: ArrayBuffer }) => void;
    wavAudioCallback?: (blob: Blob, name: string) => void;
    dumpAudioCallback?: (blob: Blob, name: string) => void;
  } = {}) {
    if (!this.audioTrack || !this.stream) {
      throw new Error('audioTrack is not initialized');
    }
    if (this.isSupportAIDenoiser() && !this.processor) {
      throw new Error('processor is not initialized');
    }

    this.pcmAudioCallback = pcmAudioCallback;
    this.wavAudioCallback = wavAudioCallback;
    this.dumpAudioCallback = dumpAudioCallback;

    this.recording = true;
  }

  private async handleProcessor() {
    if (!this.processor) {
      return;
    }

    await this.processor.enable();

    this.processor.on('overload', async () => {
      console.warn('denoiser processor overload');
      // 调整为稳态降噪模式，临时关闭 AI 降噪
      await this.processor?.setMode(AIDenoiserProcessorMode.STATIONARY_NS);
      // 完全关闭 AI 降噪，使用浏览器自带的降噪
      // await processor.disable()
    });

    this.processor.on('dump', (blob: Blob, name: string) => {
      // 将降噪处理过程中的音频数据文件以 .pcm 格式转储到本地
      this.dumpAudioCallback?.(blob, name);
      // const objectURL = URL.createObjectURL(blob);
      // const tag = document.createElement('a');
      // tag.download = name;
      // tag.href = objectURL;
      // tag.click();
      // setTimeout(() => {
      //   URL.revokeObjectURL(objectURL);
      // }, 0);
    });

    this.processor.on('dumpend', () => {
      this.log('dump ended!!');
    });
  }

  /**
   * en: Pause audio recording temporarily
   * zh: 暂时暂停音频录制
   */
  pause() {
    if (this.recording) {
      // 1. 暂停音频轨道，而不是关闭它
      if (this.audioTrack) {
        const mediaStreamTrack = this.audioTrack.getMediaStreamTrack();
        mediaStreamTrack.enabled = false; // 暂停音频采集
      }

      // 2. 暂停所有处理器的录制
      this.wavAudioProcessor?.stopRecording();
      this.wavAudioProcessor2?.stopRecording();
      this.pcmAudioProcessor?.stopRecording();

      // 3. 更新录制状态
      this.recording = false;
    } else {
      this.warn('error: recorder is not recording');
    }
  }

  /**
   * en: Resume audio recording
   * zh: 恢复音频录制
   */
  resume() {
    if (!this.recording && this.audioTrack) {
      // 1. 重新启用音频轨道
      const mediaStreamTrack = this.audioTrack.getMediaStreamTrack();
      mediaStreamTrack.enabled = true; // 恢复音频采集

      // 2. 恢复所有处理器的录制
      this.wavAudioProcessor?.startRecording();
      this.wavAudioProcessor2?.startRecording();
      this.pcmAudioProcessor?.startRecording();

      // 3. 更新录制状态
      this.recording = true;
    } else {
      this.warn('recorder is recording');
    }
  }

  /**
   * en: Destroy and cleanup all resources
   * zh: 销毁并清理所有资源
   */
  destroy() {
    // 1. 销毁所有音频处理器
    this.wavAudioProcessor?.destroy();
    this.wavAudioProcessor2?.destroy();
    this.pcmAudioProcessor?.destroy();

    // 2. 关闭并清理音频轨道
    if (this.audioTrack) {
      this.audioTrack.close();
      this.audioTrack = undefined;
    }

    // 3. 停止并清理媒体流
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = undefined;
    }

    // 4. 清理 AI 降噪处理器
    if (this.processor) {
      // 移除事件监听器
      this.processor.removeAllListeners();

      // 禁用处理器
      this.processor.disable();
      this.processor = undefined;
    }

    this.pcmAudioCallback = undefined;
    this.wavAudioCallback = undefined;
    this.dumpAudioCallback = undefined;

    // 5. 重置录音状态
    this.recording = false;
  }

  getStatus() {
    if (this.recording) {
      return 'recording';
    } else {
      return 'ended';
    }
  }

  getDenoiserEnabled() {
    return this.processor?.enabled;
  }

  async setDenoiserEnabled(enabled: boolean) {
    if (this.checkProcessor()) {
      if (enabled) {
        await this.processor?.enable();
      } else {
        await this.processor?.disable();
      }
    }
  }

  async setDenoiserMode(mode: AIDenoiserProcessorMode) {
    if (this.checkProcessor()) {
      await this.processor?.setMode(mode);
    }
  }

  async setDenoiserLevel(level: AIDenoiserProcessorLevel) {
    if (this.checkProcessor()) {
      await this.processor?.setLevel(level);
    }
  }

  /**
   * 导出降噪处理过程中的音频数据文件
   */
  dump() {
    if (this.checkProcessor()) {
      this.processor?.dump();
    }
  }

  /**
   * 获取音频采样率
   */
  getSampleRate() {
    return 44100;
    // return this.audioTrack?.getMediaStreamTrack().getSettings().sampleRate;
  }

  private log(...args: any[]) {
    if (this.config.debug) {
      console.log(...args);
    }
    return true;
  }
  private warn(...args: any[]) {
    if (this.config.debug) {
      console.warn(...args);
    }
    return true;
  }

  private checkProcessor() {
    if (!this.processor) {
      // throw new Error('processor is not initialized');
      this.log('processor is not initialized');
      return false;
    }
    return true;
  }

  private isSupportAIDenoiser() {
    return (
      this.config.aiDenoisingConfig?.mode && PcmRecorder.denoiser !== undefined
    );
  }
}

export default PcmRecorder;
