import {
  AudioProcessor,
  type IAudioProcessorContext,
} from 'agora-rte-extension';

import { WavProcessorSrc } from './wav-worklet-processor';
import { floatTo16BitPCM } from '../../utils';

class WavAudioProcessor extends AudioProcessor {
  name: 'WavAudioProcessor';
  private onAudioData?: (data: { wav: Blob }) => void;
  private workletNode?: AudioWorkletNode;

  constructor(onAudioData: (data: { wav: Blob }) => void) {
    super();
    this.name = 'WavAudioProcessor';
    this.onAudioData = onAudioData;
  }

  protected async onNode(node: AudioNode, context: IAudioProcessorContext) {
    const audioContext = context.getAudioContext();
    await audioContext.audioWorklet.addModule(WavProcessorSrc);

    this.workletNode = new window.AudioWorkletNode(
      audioContext,
      'wav-processor',
    );
    node?.connect(this.workletNode);

    this.workletNode.port.onmessage = event => {
      if (event.data.type === 'audio') {
        const { audioData, sampleRate, numChannels } = event.data;
        const wavBlob = this.createWavFile(audioData, sampleRate, numChannels);
        console.log('[wav-audio-processor] onAudioData', event.data);
        this.onAudioData?.({
          wav: wavBlob,
        });
      }
    };

    this.startRecording();

    this.output(node, context);
  }

  startRecording() {
    this.workletNode?.port.postMessage({ type: 'start' });
  }

  stopRecording() {
    this.workletNode?.port.postMessage({ type: 'stop' });
  }

  private createWavFile(
    audioData: Float32Array,
    sampleRate: number,
    numChannels: number,
  ): Blob {
    const buffer = floatTo16BitPCM(audioData);
    // const dataView = new DataView(buffer);

    const wavBuffer = new ArrayBuffer(44 + buffer.byteLength);
    const view = new DataView(wavBuffer);

    // Write WAV header
    const writeString = (view2: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view2.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    // RIFF identifier
    writeString(view, 0, 'RIFF');
    // File length
    view.setUint32(4, 36 + buffer.byteLength, true);
    // RIFF type
    writeString(view, 8, 'WAVE');
    // Format chunk identifier
    writeString(view, 12, 'fmt ');
    // Format chunk length
    view.setUint32(16, 16, true);
    // Sample format (raw)
    view.setUint16(20, 1, true);
    // Channel count
    view.setUint16(22, numChannels, true);
    // Sample rate
    view.setUint32(24, sampleRate, true);
    // Byte rate (sample rate * block align)
    view.setUint32(28, sampleRate * numChannels * 2, true);
    // Block align (channel count * bytes per sample)
    view.setUint16(32, numChannels * 2, true);
    // Bits per sample
    view.setUint16(34, 16, true);
    // Data chunk identifier
    writeString(view, 36, 'data');
    // Data chunk length
    view.setUint32(40, buffer.byteLength, true);

    // Write audio data
    const uint8Array = new Uint8Array(buffer);
    const wavUint8Array = new Uint8Array(wavBuffer);
    wavUint8Array.set(uint8Array, 44);

    return new Blob([wavBuffer], { type: 'audio/wav' });
  }

  /**
   * en: Destroy and cleanup resources
   * zh: 销毁并清理资源
   */
  destroy() {
    // 1. 停止录音
    this.stopRecording();

    // 2. 移除 workletNode 的消息监听器
    if (this.workletNode?.port) {
      this.workletNode.port.onmessage = null;
    }

    // 3. 断开 workletNode 的连接
    if (this.workletNode) {
      this.workletNode.disconnect();
      this.workletNode = undefined;
    }

    // 4. 释放 Blob URL
    if (WavProcessorSrc) {
      URL.revokeObjectURL(WavProcessorSrc);
    }

    // 5. 清理回调函数
    this.onAudioData = undefined;
  }
}

export default WavAudioProcessor;
