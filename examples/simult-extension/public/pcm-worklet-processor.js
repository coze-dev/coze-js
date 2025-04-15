class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.port.onmessage = this.handleMessage.bind(this);
    this.initialize();
  }

  initialize() {
    this.buffer = [];
    this.bufferSize = 1024;
    this.isRecording = false;
  }

  handleMessage(event) {
    const { type } = event.data;

    switch (type) {
      case 'start':
        this.isRecording = true;
        break;
      case 'stop':
        this.isRecording = false;
        break;
      default:
        break;
    }
  }

  process(inputs) {
    const input = inputs[0];
    if (input.length > 0 && this.isRecording) {
      // 将当前输入添加到缓冲区
      this.buffer = this.buffer.concat(Array.from(input[0]));

      // 当缓冲区达到或超过目标大小时发送数据
      if (this.buffer.length >= this.bufferSize) {
        // 发送1024个字节的数据
        this.port.postMessage({
          audioData: new Float32Array(this.buffer),
        });

        // 清空缓冲区
        this.buffer = [];
      }
    }
    return true;
  }
}

registerProcessor('pcm-processor', PCMProcessor);
