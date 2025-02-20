import {
  RecorderEvent,
  RecorderStartOptions,
  BaseRecorderManager,
} from './type';
import { getWaveBlob2 } from '../webm-to-wav';
import { MiniChatError, MiniChatErrorCode } from '../mini-chat-error';
import { logger } from '../logger';
export class H5RecorderManager extends BaseRecorderManager {
  private options: RecorderStartOptions = {};
  private stream: MediaStream | null = null;

  private tempFile = '';
  private size = 0;
  private duration = 0;
  private wavBlob?: Blob;

  private isSendCompleted = false;

  private inputLBuffer: Float32Array[] = [];
  private inputRBuffer: Float32Array[] = [];
  private audioContext?: AudioContext;
  private audioSource?: MediaStreamAudioSourceNode;
  private analyser?: AnalyserNode;
  private processor?: ScriptProcessorNode;

  private getUserMedia(): Promise<MediaStream> {
    return new Promise((resolve, reject) => {
      const { sampleRate = 48000, numberOfChannels = 1 } = this.options;
      let isComplete = false;
      navigator.mediaDevices
        .getUserMedia({
          audio: {
            sampleRate,
            channelCount: numberOfChannels,
          },
        })
        .then(stream => {
          logger.debug('H5RecorderManager getUserMedia success', stream);
          if (isComplete) {
            this.stopStream(stream);
          } else {
            resolve(stream);
          }
          isComplete = true;
        })
        .catch(error => {
          isComplete = true;
          logger.debug('H5RecorderManager getUserMedia catch', error);
          reject(error);
        });
      setTimeout(() => {
        isComplete = true;
        reject(new Error('getUserMedia timeout'));
      }, 3000);
    });
  }
  async start(options: RecorderStartOptions) {
    this.options = options;
    this.options.numberOfChannels = options.numberOfChannels || 1;
    this.options.sampleRate = options.sampleRate || 48000;
    this.size = 0;
    this.inputLBuffer = [];
    this.inputRBuffer = [];
    this.stream = null;
    this.isSendCompleted = false;

    try {
      this.stream = await this.getUserMedia();
      logger.debug(
        'H5RecorderManager stream get success',
        this.isStop,
        this.stream,
      );

      if (this.isStop) {
        logger.warn("H5RecorderManager is stopped before it's started");
        this.stopStream();
        this.emitStop();
        return;
      }
      this.startRecord();
    } catch (error) {
      logger.error('H5RecorderManager getUserMedia error', error);
      this.emitError(
        new MiniChatError(
          MiniChatErrorCode.Audio_Permission_Denied,
          'getUserMedia error',
        ),
      );
      this.stop();
    }
  }

  private startRecord() {
    if (!this.stream) {
      throw new Error('stream is null');
    }
    const { numberOfChannels } = this.options;

    this.audioContext = new (window.AudioContext ||
      // @ts-expect-error -- linter-disable-autofix
      window.webkitAudioContext)();
    this.audioSource = this.audioContext.createMediaStreamSource(this.stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 128;
    const createAudioNode =
      this.audioContext.createScriptProcessor ||
      // @ts-expect-error -- linter-disable-autofix
      this.audioContext.createJavaScriptNode;
    const processor = createAudioNode.call(
      this.audioContext,
      4096,
      numberOfChannels,
      numberOfChannels,
    );
    this.processor = processor;

    this.audioSource.connect(this.analyser);
    this.audioSource.connect(processor);
    processor.connect(this.audioContext.destination);

    this._registerVolume();
    this.listenAudioProcess();
  }

  private listenAudioProcess() {
    if (!this.processor) {
      throw new Error('stream is null');
    }
    this.processor.onaudioprocess = event => {
      const lData = event.inputBuffer.getChannelData(0);

      this.inputLBuffer.push(new Float32Array(lData));
      this.size += lData.length;
      if (this.options.numberOfChannels === 2) {
        const rData = event.inputBuffer.getChannelData(1);
        this.size += rData.length;
        this.inputRBuffer.push(
          new Float32Array(event.inputBuffer.getChannelData(1)),
        );
      }
    };
  }
  async stopMedia() {
    if (!this.stream || this.size === 0) {
      return;
    }

    this.audioSource?.disconnect();
    this.analyser?.disconnect();
    this.processor?.disconnect();
    this.audioContext?.close();
    this.stopStream();

    const audioBuffer = this.genAudioBuffer();
    this.duration = audioBuffer.duration * 1000;

    this.wavBlob = await getWaveBlob2(audioBuffer, false);
    this.tempFile = URL.createObjectURL(this.wavBlob);
    this.emitStop();
  }

  private flat(size: number, inputBuffer: Float32Array[]) {
    const data = new Float32Array(size);
    // 合并
    let offset = 0;
    for (let i = 0; i < inputBuffer.length; i++) {
      data.set(inputBuffer[i], offset);
      offset += inputBuffer[i].length;
    }

    return data;
  }

  private genAudioBuffer() {
    const audioBuffer = new AudioBuffer({
      length: this.size,
      sampleRate: this.audioContext?.sampleRate || 48000,
      numberOfChannels: this.options.numberOfChannels || 1,
    });
    const singleSize =
      this.options.numberOfChannels === 2 ? this.size / 2 : this.size;
    const lData = this.flat(singleSize, this.inputLBuffer);
    audioBuffer.copyToChannel(lData, 0, 0);
    if (this.options.numberOfChannels === 2) {
      const rData = this.flat(singleSize, this.inputRBuffer);
      audioBuffer.copyToChannel(rData, 1, 0);
    }
    return audioBuffer;
  }

  private _registerVolume() {
    if (!this.analyser) {
      return () => 0;
    }

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount).slice(
      0,
      64,
    );
    const getVolume = () => {
      if (this.isStop) {
        this.emit(RecorderEvent.VOLUME, {
          volume: 0,
        });
        return;
      }
      // 计算音量
      this.analyser?.getByteFrequencyData(dataArray);
      let volumeSum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        volumeSum += Math.abs(dataArray[i]) * Math.abs(dataArray[i]);
      }
      const volume = volumeSum / dataArray.length / 255 / 255;
      this.emit(RecorderEvent.VOLUME, {
        volume: volume < 0.002 ? 0 : volume,
      });
      setTimeout(() => {
        getVolume();
      }, 100);
    };
    getVolume();
  }
  private emitStop() {
    if (this.isSendCompleted) {
      return;
    }
    this.isSendCompleted = true;
    this.emit(RecorderEvent.STOP, {
      duration: this.duration || 0,
      tempFilePath: this.tempFile,
      fileSize: this.size,
      content: this.wavBlob,
      fileName: `recorder_${Date.now()}.wav`,
    });
  }
  private emitError(error: MiniChatError) {
    if (this.isSendCompleted) {
      return;
    }
    this.isSendCompleted = true;
    this.emit(RecorderEvent.ERROR, error);
  }
  destroy() {
    this.stop();
    this.event.off();
  }
  async stop() {
    if (this.isStop) {
      logger.warn('recorder has been stopped');
      return;
    }
    logger.debug('H5RecorderManager stop');
    this.isStop = true;
    try {
      await this.stopMedia();
      this.event.off();
      this.stream = null;
      this.audioContext = undefined;
      this.audioSource = undefined;
      this.analyser = undefined;
      this.processor = undefined;
      this.wavBlob = undefined;
      this.inputLBuffer = [];
      this.inputRBuffer = [];
    } catch (_err) {
      this.emitError(new MiniChatError(-1, 'unknown error'));
    }
  }
  private stopStream(stream?: MediaStream) {
    (stream || this.stream)?.getTracks().forEach(track => {
      logger.debug('H5RecorderManager , stopStream', track);
      track.stop();
    });
  }
  pause() {
    if (this.isStop) {
      logger.error('recorder has been stopped');
      return;
    }
  }
  resume() {
    if (this.isStop) {
      logger.error('recorder has been stopped');
      return;
    }
  }
}

export class H5RecorderManagerInstance extends H5RecorderManager {
  private static curInstance?: H5RecorderManagerInstance;
  async start(options: RecorderStartOptions) {
    if (this.isStop) {
      throw new MiniChatError(-1, 'recorder is stop');
    }
    logger.debug(
      'H5RedorManagerInstance start instance stopFlag',
      H5RecorderManagerInstance.curInstance?.isStop,
    );
    // There's only one instance at a time.
    if (!H5RecorderManagerInstance.curInstance?.isStop) {
      H5RecorderManagerInstance.curInstance?.stop();
    }
    H5RecorderManagerInstance.curInstance = this;
    return await super.start(options);
  }
}
