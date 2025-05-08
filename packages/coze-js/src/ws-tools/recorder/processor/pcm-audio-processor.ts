import { type IAudioProcessorContext } from 'agora-rte-extension';

import {
  floatTo16BitPCM,
  encodeG711U,
  float32ToInt16Array,
  downsampleTo8000,
  encodeG711A,
} from '../../utils';
import { AudioProcessorSrc } from './pcm-worklet-processor';
import BaseAudioProcessor from './base-audio-processor';

class PcmAudioProcessor extends BaseAudioProcessor {
  name: 'PcmAudioProcessor';
  private chunkProcessor?: (data: ArrayBuffer) => void;
  private workletNode?: AudioWorkletNode;
  private encoding: 'pcm' | 'g711a' | 'g711u';

  constructor(
    chunkProcessor: (data: ArrayBuffer) => void,
    encoding: 'pcm' | 'g711a' | 'g711u' = 'pcm',
  ) {
    super();
    this.name = 'PcmAudioProcessor';
    this.chunkProcessor = chunkProcessor;
    this.encoding = encoding;
  }

  protected async onNode(node: AudioNode, context: IAudioProcessorContext) {
    const audioContext = context.getAudioContext();
    await audioContext.audioWorklet.addModule(AudioProcessorSrc);
    this.workletNode = new AudioWorkletNode(audioContext, 'pcm-processor');
    node?.connect(this.workletNode);

    // workletNode.connect(node);

    this.workletNode.port.onmessage = event => {
      const float32 = event.data.audioData as Float32Array;
      let buffer: ArrayBuffer;
      switch (this.encoding) {
        case 'g711a': {
          const float32_8000 = downsampleTo8000(float32);
          const pcm16_8000 = float32ToInt16Array(float32_8000);
          buffer = encodeG711A(pcm16_8000).buffer;
          break;
        }
        case 'g711u': {
          const float32_8000 = downsampleTo8000(float32);
          const pcm16_8000 = float32ToInt16Array(float32_8000);
          buffer = encodeG711U(pcm16_8000).buffer;
          break;
        }
        case 'pcm':
        default:
          buffer = floatTo16BitPCM(float32);
      }
      this.chunkProcessor?.(buffer);
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
    if (AudioProcessorSrc) {
      URL.revokeObjectURL(AudioProcessorSrc);
    }

    // 5. 清理回调函数
    this.chunkProcessor = undefined;
  }
}

export default PcmAudioProcessor;
