// @ts-expect-error no types
import { OggOpusEncoder } from 'opus-encdec/src/oggOpusEncoder.js';
// @ts-expect-error no types
import OpusEncoderLib from 'opus-encdec/dist/libopus-encoder.js';
import { type IAudioProcessorContext } from 'agora-rte-extension';

import { AudioProcessorSrc } from './pcm-worklet-processor';
import BaseAudioProcessor from './base-audio-processor';

/**
 * OpusAudioProcessor
 */
class OpusAudioProcessor extends BaseAudioProcessor {
  name: 'OpusAudioProcessor';
  private chunkProcessor?: (data: ArrayBuffer) => void;
  private workletNode?: AudioWorkletNode;
  private encoder?: OggOpusEncoder;
  private encoderReady = false;

  constructor(chunkProcessor: (data: ArrayBuffer) => void) {
    super();
    this.name = 'OpusAudioProcessor';
    this.chunkProcessor = chunkProcessor;
  }

  protected async onNode(node: AudioNode, context: IAudioProcessorContext) {
    const audioContext = context.getAudioContext();
    await audioContext.audioWorklet.addModule(AudioProcessorSrc);
    this.workletNode = new AudioWorkletNode(audioContext, 'pcm-processor');
    node.connect(this.workletNode);

    // 初始化裸 Opus 编码器
    const encoderConfig = {
      encoderApplication: 2049, // Full Band Audio
      encoderFrameSize: 20, // ms
      encoderSampleRate: audioContext.sampleRate,
      numberOfChannels: 1,
      rawOpus: true,
      originalSampleRate: audioContext.sampleRate,
    };
    this.encoder = new OggOpusEncoder(encoderConfig, OpusEncoderLib);
    if (this.encoder.isReady === false && this.encoder.onready) {
      await new Promise(resolve => {
        this.encoder.onready = resolve;
      });
    }
    this.encoderReady = true;

    this.workletNode.port.onmessage = event => {
      if (!this.encoderReady) {
        return;
      }
      const float32 = event.data.audioData as Float32Array;

      // Opus-encdec 直接支持 Float32Array
      this.encoder.encode([float32]);
      const packets = this.encoder.encodedData || [];
      this.encoder.encodedData = [];

      if (packets && packets.length) {
        for (const packet of packets) {
          this.chunkProcessor?.(packet.buffer);
        }
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

  /**
   * en: Destroy and cleanup resources
   * zh: 销毁并清理资源
   */
  destroy() {
    this.stopRecording();
    if (this.workletNode?.port) {
      this.workletNode.port.onmessage = null;
    }
    if (this.workletNode) {
      this.workletNode.disconnect();
      this.workletNode = undefined;
    }
    if (AudioProcessorSrc) {
      URL.revokeObjectURL(AudioProcessorSrc);
    }
    this.chunkProcessor = undefined;
    if (this.encoder) {
      this.encoder.destroy();
      this.encoder = undefined;
    }
    this.encoderReady = false;
  }
}

export default OpusAudioProcessor;
