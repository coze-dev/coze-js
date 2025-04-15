import { isBrowserExtension } from '../../utils';

const WavProcessorWorklet = `
class WavProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.port.onmessage = this.handleMessage.bind(this);
    this.initialize();
  }

  initialize() {
    this.chunks = [];
    this.isRecording = false;
  }

  handleMessage(event) {
    const { type } = event.data;

    switch (type) {
      case 'start':
        this.isRecording = true;
        break;
      case 'stop':
        if (this.isRecording) {
          this.isRecording = false;
          const audioData = this.processChunks();
          this.port.postMessage({
            type: 'audio',
            audioData,
            sampleRate: sampleRate,
            numChannels: this.chunks[0]?.length || 1,
          });
          this.initialize();
        }
        break;
    }
  }

  processChunks() {
    // Combine all channels
    const channels = [];
    const firstChunk = this.chunks[0] || [];
    const numChannels = firstChunk.length || 1;

    for (let channel = 0; channel < numChannels; channel++) {
      const length = this.chunks.reduce((sum, chunk) => sum + chunk[channel].length, 0);
      const channelData = new Float32Array(length);
      let offset = 0;

      for (const chunk of this.chunks) {
        channelData.set(chunk[channel], offset);
        offset += chunk[channel].length;
      }

      channels.push(channelData);
    }

    // Interleave channels
    const interleaved = new Float32Array(channels[0].length * channels.length);
    for (let i = 0; i < channels[0].length; i++) {
      for (let channel = 0; channel < channels.length; channel++) {
        interleaved[i * channels.length + channel] = channels[channel][i];
      }
    }

    return interleaved;
  }

  process(inputs) {
    const input = inputs[0];
    if (input && input[0] && this.isRecording) {
      // Clone the input data
      const chunk = input.map(channel => channel.slice());
      this.chunks.push(chunk);
    }
    return true;
  }
}

registerProcessor('wav-processor', WavProcessor);
`;

let src = '';
if (isBrowserExtension()) {
  src = chrome.runtime.getURL('wav-worklet-processor.js');
} else {
  const script = new Blob([WavProcessorWorklet], {
    type: 'application/javascript',
  });
  src = URL.createObjectURL(script);
}
export const WavProcessorSrc = src;
