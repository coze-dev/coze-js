import {
  createMicrophoneAudioTrack,
  type IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng/esm';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { AIDenoiserExtension } from 'agora-extension-ai-denoiser';

import CustomAudioProcessor from './custom-audio-processor';

/**
 * Configurations for the audio track of screen sharing.
 */
export interface AudioTrackConfig {
  /**
   * Whether to enable AI denoiser:
   * - `NSNG`: Enable non-stationary noise suppression.
   * - `STATIONARY_NS`: Enable stationary noise suppression.
   */
  aiDenoiserMode?: 'NSNG' | 'STATIONARY_NS';
  /**
   * The path to the AI denoiser assets.
   */
  assetsPath?: string;
  /**
   * Whether to enable acoustic echo cancellation:
   * - `true`: Enable acoustic echo cancellation.
   * - `false`: Do not enable acoustic echo cancellation.
   */
  AEC?: boolean;
  /**
   * Whether to enable audio gain control:
   * - `true`: Enable audio gain control.
   * - `false`: Do not enable audio gain control.
   */
  AGC?: boolean;
  /**
   * Whether to enable automatic noise suppression:
   * - `true`: Enable automatic noise suppression.
   * - `false`: Do not automatic noise suppression.
   */
  ANS?: boolean;
}

class PcmRecorder {
  private audioTrack: IMicrophoneAudioTrack | undefined;
  private stream: MediaStream | undefined;
  private recording = false;
  private audioContext: AudioContext;
  private sourceNode: MediaStreamAudioSourceNode | undefined;
  private processorNode: ScriptProcessorNode | undefined;
  private analyserNode: AnalyserNode | undefined;
  private workletNode: AudioWorkletNode | undefined;
  private audioTrackConfig: AudioTrackConfig | undefined;
  private static denoiser: AIDenoiserExtension | undefined;

  constructor() {
    this.audioContext = new AudioContext();
  }

  private isSupportAIDenoiser() {
    return (
      this.audioTrackConfig?.aiDenoiserMode &&
      PcmRecorder.denoiser !== undefined
    );
  }

  async begin({
    deviceId,
    audioTrackConfig,
  }: {
    deviceId?: string | undefined;
    audioTrackConfig?: AudioTrackConfig;
  }) {
    this.audioTrackConfig = audioTrackConfig;

    if (audioTrackConfig?.aiDenoiserMode && !PcmRecorder.denoiser) {
      // 传入 Wasm 文件所在的公共路径以创建 AIDenoiserExtension 实例，路径结尾不带 / "
      const external = new AIDenoiserExtension({
        assetsPath: audioTrackConfig?.assetsPath ?? '/external',
      });

      external.onloaderror = e => {
        // 如果 Wasm 文件加载失败，你可以关闭插件，例如：
        console.error('Denoiser load error', e);
      };

      // 检查兼容性
      if (!external.checkCompatibility()) {
        // 当前浏览器可能不支持 AI 降噪插件，你可以停止执行之后的逻辑
        console.error('Does not support AI Denoiser!');
      } else {
        // 注册插件
        AgoraRTC.registerExtensions([external]);
        PcmRecorder.denoiser = external;
      }
    }

    // Get microphone audio track
    // See:https://api-ref.agora.io/en/video-sdk/web/4.x/interfaces/microphoneaudiotrackinitconfig.html
    this.audioTrack = await createMicrophoneAudioTrack({
      AEC: audioTrackConfig?.AEC ?? true, // 是否开启回声消除
      ANS: audioTrackConfig?.ANS ?? false, // 是否开启音频增益控制
      AGC: audioTrackConfig?.AGC ?? false, // 是否开启自动噪声抑制
      microphoneId: deviceId,
    });

    this.stream = new MediaStream([this.audioTrack.getMediaStreamTrack()]);
  }

  pause() {
    // Pause recording
    if (this.recording) {
      this.disconnectAudioNodes();
      this.recording = false;
    }
  }

  private disconnectAudioNodes() {
    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode = undefined;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = undefined;
    }

    if (this.analyserNode) {
      this.analyserNode.disconnect();
      this.analyserNode = undefined;
    }

    if (this.workletNode) {
      this.workletNode.disconnect();
      this.workletNode = undefined;
    }
  }

  async record(
    chunkProcessor?: (data: { raw: ArrayBuffer }) => void,
    bufferSize = 2048,
  ) {
    if (!this.audioTrack || !this.stream) {
      throw new Error('audioTrack is not initialized');
    }

    // Ensure AudioContext is in running state
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const customAudioProcessor = new CustomAudioProcessor(data => {
      const pcmData = this.floatTo16BitPCM(data);
      chunkProcessor?.({ raw: pcmData });
    });

    if (this.isSupportAIDenoiser() && PcmRecorder.denoiser) {
      const processor = PcmRecorder.denoiser?.createProcessor();
      await processor.enable();

      this.audioTrack
        .pipe(processor)
        .pipe(customAudioProcessor)
        .pipe(this.audioTrack.processorDestination);
    } else {
      this.audioTrack
        .pipe(customAudioProcessor)
        .pipe(this.audioTrack.processorDestination);
    }

    this.recording = true;
  }

  resume() {
    // Resume recording
    if (!this.recording && this.stream) {
      this.record();
    }
  }

  end() {
    // Stop recording
    this.pause();
  }

  quit() {
    // Exit recording
    this.pause();
    this.audioTrack?.close();
    this.stream?.getTracks().forEach(track => track.stop());

    // Close audio context
    if (this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }

  getStatus() {
    // Get recording status
    if (!this.sourceNode) {
      return 'ended';
    } else if (!this.recording) {
      return 'paused';
    } else {
      return 'recording';
    }
  }

  getSampleRate() {
    return this.audioTrack?.getMediaStreamTrack().getSettings().sampleRate;
  }

  async requestPermission() {
    const permissionStatus = await navigator.permissions.query({
      name: 'microphone' as PermissionName,
    });
    if (permissionStatus.state === 'denied') {
      window.alert('You must grant microphone access to use this feature.');
    } else if (permissionStatus.state === 'prompt') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      } catch (e) {
        window.alert('You must grant microphone access to use this feature.');
      }
    }
    return true;
  }

  async listDevices() {
    if (
      !navigator.mediaDevices ||
      !('enumerateDevices' in navigator.mediaDevices)
    ) {
      throw new Error('Could not request user devices');
    }
    await this.requestPermission();
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter(device => device.kind === 'audioinput');
    const defaultDeviceIndex = audioDevices.findIndex(
      device => device.deviceId === 'default',
    );
    const deviceList = [];
    if (defaultDeviceIndex !== -1) {
      let defaultDevice = audioDevices.splice(defaultDeviceIndex, 1)[0];
      const existingIndex = audioDevices.findIndex(
        device => device.groupId === defaultDevice.groupId,
      );
      if (existingIndex !== -1) {
        defaultDevice = audioDevices.splice(existingIndex, 1)[0];
      }
      // defaultDevice.default = true;
      deviceList.push(defaultDevice);
    }
    return deviceList.concat(audioDevices);
  }

  floatTo16BitPCM(float32Array: Float32Array) {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buffer;
  }
}

export default PcmRecorder;
