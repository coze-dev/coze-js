import {
  AudioProcessor,
  type IAudioProcessorContext,
} from 'agora-rte-extension';

import { AudioProcessorSrc } from './pcm-worklet-processor';

class CustomAudioProcessor extends AudioProcessor {
  name: 'CustomAudioProcessor';
  private chunkProcessor: (data: Float32Array) => void;

  constructor(chunkProcessor: (data: Float32Array) => void) {
    super();
    this.name = 'CustomAudioProcessor';
    this.chunkProcessor = chunkProcessor;
  }

  protected async onNode(node: AudioNode, context: IAudioProcessorContext) {
    const audioContext = context.getAudioContext();
    await audioContext.audioWorklet.addModule(AudioProcessorSrc);
    const workletNode = new AudioWorkletNode(audioContext, 'pcm-processor');
    node?.connect(workletNode);

    workletNode.connect(node);

    workletNode.port.onmessage = event => {
      this.chunkProcessor?.(event.data.audioData);
    };

    this.output(node, context);
  }
}

export default CustomAudioProcessor;
