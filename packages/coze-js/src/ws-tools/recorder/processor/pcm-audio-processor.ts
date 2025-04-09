import {
  AudioProcessor,
  type IAudioProcessorContext,
} from 'agora-rte-extension';

import { AudioProcessorSrc } from './pcm-worklet-processor';
import { floatTo16BitPCM } from '../../utils';

class PcmAudioProcessor extends AudioProcessor {
  name: 'PcmAudioProcessor';
  private chunkProcessor?: (data: ArrayBuffer) => void;
  private workletNode?: AudioWorkletNode;

  constructor(chunkProcessor: (data: ArrayBuffer) => void) {
    super();
    this.name = 'PcmAudioProcessor';
    this.chunkProcessor = chunkProcessor;
  }

  protected async onNode(node: AudioNode, context: IAudioProcessorContext) {
    const audioContext = context.getAudioContext();
    await audioContext.audioWorklet.addModule(AudioProcessorSrc);
    this.workletNode = new AudioWorkletNode(audioContext, 'pcm-processor');
    node?.connect(this.workletNode);

    // workletNode.connect(node);

    this.workletNode.port.onmessage = event => {
      this.chunkProcessor?.(
        floatTo16BitPCM(event.data.audioData as Float32Array),
      );
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
