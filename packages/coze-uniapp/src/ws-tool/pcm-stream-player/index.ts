/* eslint-disable @typescript-eslint/no-explicit-any */
import { Resampler } from './resampler';
import { decodeAlaw, decodeUlaw } from './codecs/g711';

/**
 * Audio format types supported by PcmStreamPlayer
 */
export type AudioFormat = 'pcm' | 'g711a' | 'g711u';

/**
 * PcmStreamPlayer for WeChat Mini Program
 * Plays audio streams received in raw PCM16, G.711a, or G.711u chunks
 * @class
 */
export class PcmStreamPlayer {
  private audioContext: any | null = null; // Using 'any' for WebAudioContext due to type limitations
  private inputSampleRate: number;
  private outputSampleRate: number;
  private audioQueue: Int16Array[] = [];
  private isPaused = false;
  private trackSampleOffsets: Record<
    string,
    { trackId: string; offset: number; currentTime: number }
  > = {};
  private interruptedTrackIds: Record<string, boolean> = {};
  private isInitialized = false;
  private isProcessing = false;
  private scriptNode: any = null;
  private bufferSize = 1024;
  private base64Queue: Array<{ base64String: string; trackId: string }> = [];
  private isProcessingQueue = false;
  private lastAudioProcessTime = Infinity;
  private processingTimeThreshold = 0; // 1ms threshold

  // Current buffer and position for continuous playback
  private currentBuffer: Int16Array | null = null;
  private playbackPosition = 0;

  /**
   * Default audio format
   */
  private defaultFormat: AudioFormat = 'pcm';

  // Trigger audio for iPhone silent mode
  private static triggerAudio: any = null;

  /**
   * Creates a new PcmStreamPlayer instance
   * @param {{sampleRate?: number, defaultFormat?: AudioFormat}} options
   * @returns {PcmStreamPlayer}
   */
  constructor({
    sampleRate = 24000,
    defaultFormat = 'pcm',
  }: {
    sampleRate?: number;
    defaultFormat?: AudioFormat;
  } = {}) {
    this.inputSampleRate = sampleRate;
    // 微信小程序，输出的采样率是固定的，所有需要重采样
    this.outputSampleRate = PcmStreamPlayer.getSampleRate();
    this.defaultFormat = defaultFormat;
  }

  /**
   * Initialize the audio context
   * @private
   * @returns {boolean}
   */
  private initialize(): boolean {
    if (this.isInitialized) {
      return true;
    }

    try {
      // Create WebAudioContext for UniApp environment
      this.audioContext = uni.createWebAudioContext();

      if (!this.audioContext) {
        console.error('Failed to create WebAudioContext');
        return false;
      }

      // 在下一帧音频处理前5ms，确保主线程是空闲的
      this.processingTimeThreshold =
        Math.floor((this.bufferSize / this.audioContext.sampleRate) * 1000) - 5;

      // Initialize silent audio trigger for iPhone
      this.initSilentModeTrigger();

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing audio context:', error);
      return false;
    }
  }

  /**
   * Initialize a silent audio player to bypass iPhone silent mode
   * @private
   */
  private initSilentModeTrigger(): void {
    try {
      // Only initialize once
      if (!PcmStreamPlayer.triggerAudio) {
        uni.setInnerAudioOption({
          obeyMuteSwitch: false, // 设置为false以忽略静音开关
          success: () => {
            console.log(
              'Inner audio option set obeyMuteSwitch=false successfully',
            );
          },
          fail: err => {
            console.error('Failed to set inner audio option:', err);
          },
        });
        // Create and configure the trigger audio
        const triggerAudio = uni.createInnerAudioContext();

        // Use a base64 silent audio as a temporary placeholder until loaded
        // In real implementation, should use a file in the app package
        triggerAudio.src =
          'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAASAthz7PAAAAAAAAAAAAAAAA//tAwAAABpADjMQAACK2IHbYwggI0JMZ4M8y5wPEI7iSHf5DMjMH5QdHI25QZIguRmDIJnoZgyDGfCUGQdBjGDa+jm7aGaABBAEAghzNIJhJRmCEYbJkHmUCuMY1/AAIAAQACAQ8QDSSQTJ7gICAwQkDSiYVBpgoBnJDQA==';
        triggerAudio.loop = true;
        triggerAudio.volume = 0.01; // Set to very low volume
        triggerAudio.obeyMuteSwitch = false;

        PcmStreamPlayer.triggerAudio = triggerAudio;

        // Play immediately to bypass iPhone silent mode
        triggerAudio.onPlay = () => {
          console.log('Trigger audio played');
        };
        triggerAudio.play();
      }
    } catch (error) {
      console.error('Error initializing silent mode trigger:', error);
    }
  }

  /**
   * Start audio playback system
   * @private
   */
  private startPlayback(): boolean {
    try {
      // Initialize audio if needed
      if (!this.isInitialized) {
        const initialized = this.initialize();
        if (!initialized) {
          return false;
        }
      }

      // If there is no data in the queue, exit
      if (this.audioQueue.length === 0) {
        return false;
      }

      // Clean up any existing scriptNode to prevent duplicate audio playback
      if (this.scriptNode) {
        try {
          this.scriptNode.disconnect();
          this.scriptNode = null;
        } catch (error) {
          console.warn('Error disconnecting previous script node:', error);
        }
      }

      // Using optional chaining to handle potential null and checking if method exists
      const scriptNode = this.audioContext?.createScriptProcessor
        ? this.audioContext.createScriptProcessor(this.bufferSize, 0, 1)
        : null;

      if (!scriptNode) {
        console.error('Failed to create script processor node');
        return false;
      }

      this.scriptNode = scriptNode;
      this.isProcessing = true;

      // Process audio data
      scriptNode.onaudioprocess = (e: any) => {
        const outputBuffer = e.outputBuffer.getChannelData(0);

        // Fill the output buffer
        this.fillOutputBuffer(outputBuffer);

        // Record the last audio process time
        this.lastAudioProcessTime = Date.now();

        // Check if we have base64 data to process and not currently processing
        this.processBase64Queue();
      };

      // Connect to destination (speakers)
      scriptNode.connect(this.audioContext?.destination);
      return true;
    } catch (error) {
      console.error('Error starting audio playback:', error);
      return false;
    }
  }

  /**
   * Fill the output buffer with audio data from the current buffer or queue
   * @private
   */
  private fillOutputBuffer(outputBuffer: Float32Array): void {
    // If no current buffer, try to get the next one
    if (!this.currentBuffer) {
      if (!this.getNextBuffer()) {
        // No more data, fill with silence
        for (let i = 0; i < outputBuffer.length; i++) {
          outputBuffer[i] = 0;
        }
        this.isProcessing = false;
        return;
      }
    }

    // Fill the output buffer with data from current buffer
    for (let i = 0; i < outputBuffer.length; i++) {
      if (
        this.currentBuffer &&
        this.playbackPosition < this.currentBuffer.length
      ) {
        // Convert from 16-bit PCM to float [-1.0, 1.0] on-the-fly
        outputBuffer[i] = this.currentBuffer[this.playbackPosition++] / 0x8000;
      } else {
        // Current buffer is exhausted, try to get next buffer
        if (!this.getNextBuffer()) {
          // No more data, fill rest with silence
          outputBuffer[i] = 0;
          this.isProcessing = i === outputBuffer.length - 1 ? false : true;
        } else {
          // Got new buffer, use its first sample
          outputBuffer[i] = this.currentBuffer
            ? this.currentBuffer[this.playbackPosition++] / 0x8000
            : 0;
          // Ensure we're still marked as processing since we got a new buffer
          this.isProcessing = true;
        }
      }
    }
  }

  /**
   * Get the next buffer from the queue and prepare it for playback
   * @private
   * @returns {boolean} True if a new buffer was prepared, false if queue is empty
   */
  private getNextBuffer(): boolean {
    // If queue is empty, return false
    if (this.audioQueue.length === 0) {
      return false;
    }

    // Get the next PCM data from queue
    const pcmData = this.audioQueue.shift();
    if (!pcmData || pcmData.length === 0) {
      this.currentBuffer = null;
      return false;
    }

    // Keep the data in Int16Array format and only convert when needed during playback
    this.currentBuffer = pcmData;
    this.playbackPosition = 0;
    return true;
  }

  /**
   * Pauses audio playback
   */
  async pause(): Promise<void> {
    if (this.audioContext && !this.isPaused) {
      try {
        // In UniApp environment, suspend the audio context
        // Check if state and suspend methods exist
        if (
          this.audioContext?.state === 'running' &&
          typeof this.audioContext?.suspend === 'function'
        ) {
          await this.audioContext.suspend();
        }
        this.isPaused = true;
      } catch (error) {
        console.error('Error pausing audio playback:', error);
      }
    }
  }

  /**
   * Resumes audio playback
   */
  async resume(): Promise<void> {
    if (this.audioContext && this.isPaused) {
      try {
        // In UniApp environment, resume the audio context
        // Check if state and resume methods exist
        if (
          this.audioContext?.state === 'suspended' &&
          typeof this.audioContext?.resume === 'function'
        ) {
          await this.audioContext.resume();
        }
        this.isPaused = false;

        // If no scriptNode exists, start playback again
        if (!this.scriptNode && this.audioQueue.length > 0) {
          await this.startPlayback();
        }
      } catch (error) {
        console.error('Error resuming audio playback:', error);
      }
    }
  }

  /**
   * Toggles between play and pause states
   */
  async togglePlay(): Promise<void> {
    if (this.isPaused) {
      await this.resume();
    } else {
      await this.pause();
    }
  }

  /**
   * Checks if audio is currently playing
   * @returns {boolean}
   */
  isPlaying(): boolean {
    return Boolean(
      this.audioContext &&
        !this.isPaused &&
        (this.isProcessing || this.audioQueue.length > 0) &&
        this.audioContext?.state === 'running',
    );
  }

  private isProcessingIdle(): boolean {
    if (this.lastAudioProcessTime === 0) {
      return true;
    }
    const now = Date.now();
    const diff = now - this.lastAudioProcessTime;
    if (diff > 100 || diff < this.processingTimeThreshold) {
      return true;
    }
    return false;
  }

  /**
   * Adds base64 encoded PCM data to a queue for processing
   * This prevents blocking the main thread during audio processing
   * @param {string} base64String - Base64 encoded PCM data
   * @param {string} trackId - Track identifier
   * @returns {boolean} - Success status
   */
  addBase64PCM(base64String: string, trackId = 'default') {
    // Add to processing queue
    this.base64Queue.push({ base64String, trackId });

    // If we're outside the processing window, try to process the queue
    if (this.isProcessingIdle()) {
      this.processBase64Queue();
    }

    return true;
  }

  /**
   * Process the base64 queue when the main thread is idle
   * @private
   */
  private processBase64Queue() {
    // If already processing or queue is empty, do nothing
    if (this.isProcessingQueue || this.base64Queue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    try {
      // Process one item from the queue
      const item = this.base64Queue.shift();
      if (item) {
        const { base64String, trackId } = item;
        // console.log(
        //   `Processing base64 data for track ${trackId}, queue size: ${this.base64Queue.length}`,
        // );
        const binaryString = uni.base64ToArrayBuffer(base64String);
        this.add16BitPCM(binaryString, trackId);
      }
    } catch (error) {
      console.error('Error processing base64 queue:', error);
    } finally {
      this.isProcessingQueue = false;

      // If there are more items and we're still outside the processing window, process the next item
      if (this.base64Queue.length > 0) {
        if (this.isProcessingIdle()) {
          // Use setTimeout to give the main thread a chance to breathe
          setTimeout(() => this.processBase64Queue(), 0);
        }
      }
    }
  }

  /**
   * Adds audio data to the currently playing audio stream
   * @param {ArrayBuffer|Int16Array|Uint8Array} arrayBuffer
   * @param {string} [trackId]
   * @param {AudioFormat} [format] - Audio format: 'pcm', 'g711a', or 'g711u'
   * @returns {Int16Array}
   */
  add16BitPCM(
    arrayBuffer: ArrayBuffer | Int16Array | Uint8Array,
    trackId = 'default',
    format?: AudioFormat,
  ): Int16Array {
    if (typeof trackId !== 'string') {
      throw new Error('trackId must be a string');
    } else if (this.interruptedTrackIds[trackId]) {
      return new Int16Array();
    }

    let buffer: Int16Array;
    const audioFormat = format || this.defaultFormat;

    if (arrayBuffer instanceof Int16Array) {
      // Already in PCM format
      buffer = arrayBuffer;
    } else if (arrayBuffer instanceof Uint8Array) {
      // Handle different formats based on the specified format
      if (audioFormat === 'g711a') {
        buffer = decodeAlaw(arrayBuffer);
      } else if (audioFormat === 'g711u') {
        buffer = decodeUlaw(arrayBuffer);
      } else {
        // Treat as PCM data in Uint8Array
        buffer = new Int16Array(arrayBuffer.buffer);
      }
    } else if (arrayBuffer instanceof ArrayBuffer) {
      // Handle different formats based on the specified format
      if (audioFormat === 'g711a') {
        buffer = decodeAlaw(new Uint8Array(arrayBuffer));
      } else if (audioFormat === 'g711u') {
        buffer = decodeUlaw(new Uint8Array(arrayBuffer));
      } else {
        // Default to PCM
        buffer = new Int16Array(arrayBuffer);
      }
    } else {
      throw new Error(
        'argument must be Int16Array, Uint8Array, or ArrayBuffer',
      );
    }

    // Resample the buffer if input and output sample rates are different
    if (this.inputSampleRate !== this.outputSampleRate) {
      buffer = Resampler.resample(
        buffer,
        this.inputSampleRate,
        this.outputSampleRate,
      );
    }

    // Add to the audio queue
    this.audioQueue.push(buffer);

    if (!this.isProcessing && !this.isPaused) {
      this.startPlayback();
    }

    return buffer;
  }

  /**
   * Gets the offset (sample count) of the currently playing stream
   * @param {boolean} [interrupt]
   * @returns {{trackId: string|null, offset: number, currentTime: number} | null}
   */
  getTrackSampleOffset(interrupt = false): {
    trackId: string | null;
    offset: number;
    currentTime: number;
  } | null {
    if (!this.audioContext) {
      return null;
    }

    // Calculate approximate offset based on audio context time
    const currentTime = this.audioContext?.currentTime || 0;
    const offset = Math.floor(currentTime * this.inputSampleRate);
    const requestId = Date.now().toString();
    const trackId = 'default'; // We're using a default track for all audio

    const result = {
      trackId,
      offset,
      currentTime,
    };

    this.trackSampleOffsets[requestId] = result;

    if (interrupt && trackId) {
      this.interruptedTrackIds[trackId] = true;

      // Clear the audio queue for interrupted track
      this.audioQueue = [];

      // Disconnect the current scriptNode if exists
      if (this.scriptNode) {
        try {
          this.scriptNode.disconnect();
          this.scriptNode = null;
          this.currentBuffer = null;
          this.playbackPosition = 0;
          this.isPaused = false;
        } catch (error) {
          console.warn('Error disconnecting script node:', error);
        }
      }

      this.isProcessing = false;
    }

    return result;
  }

  /**
   * Strips the current stream and returns the sample offset of the audio
   * @returns {{trackId: string|null, offset: number, currentTime: number} | null}
   */
  interrupt(): {
    trackId: string | null;
    offset: number;
    currentTime: number;
  } | null {
    // Clear current buffer and reset playback position
    this.currentBuffer = null;
    this.playbackPosition = 0;
    return this.getTrackSampleOffset(true);
  }

  /**
   * Set the input sample rate for audio playback
   * @param {number} sampleRate - The sample rate of the incoming audio data
   */
  setSampleRate(sampleRate: number): void {
    // We can change the input sample rate at any time
    this.inputSampleRate = sampleRate;
    console.log(
      `Input sample rate set to ${sampleRate}Hz, output sample rate is ${this.outputSampleRate}Hz`,
    );
  }

  /**
   * Set the default audio format
   * @param {AudioFormat} format
   */
  setDefaultFormat(format: AudioFormat): void {
    this.defaultFormat = format;
  }

  /**
   * Adds G.711 A-law encoded audio data to the currently playing audio stream
   * @param {ArrayBuffer|Uint8Array} arrayBuffer - G.711 A-law encoded data
   * @param {string} [trackId]
   * @returns {Int16Array}
   */
  addG711a(
    arrayBuffer: ArrayBuffer | Uint8Array,
    trackId = 'default',
  ): Int16Array {
    return this.add16BitPCM(arrayBuffer, trackId, 'g711a');
  }

  /**
   * Adds G.711 μ-law encoded audio data to the currently playing audio stream
   * @param {ArrayBuffer|Uint8Array} arrayBuffer - G.711 μ-law encoded data
   * @param {string} [trackId]
   * @returns {Int16Array}
   */
  addG711u(
    arrayBuffer: ArrayBuffer | Uint8Array,
    trackId = 'default',
  ): Int16Array {
    return this.add16BitPCM(arrayBuffer, trackId, 'g711u');
  }

  static getSampleRate(): number {
    const audioContext = uni.createWebAudioContext() as any;
    const { sampleRate } = audioContext;
    audioContext.close();
    return sampleRate;
  }

  /**
   * Cleanup static resources when the app is closed or the page is unloaded
   */
  static cleanup(): void {
    if (PcmStreamPlayer.triggerAudio) {
      PcmStreamPlayer.triggerAudio.stop();
      PcmStreamPlayer.triggerAudio.destroy();
      PcmStreamPlayer.triggerAudio = null;
    }
  }
}

// Export for use with import {PcmStreamPlayer} from '@coze/uniapp-api/ws-tools'
export default PcmStreamPlayer;
