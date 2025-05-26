/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * PcmStreamPlayer for WeChat Mini Program
 * Plays audio streams received in raw PCM16 chunks
 * @class
 */
export class PcmStreamPlayer {
  private audioContext: any | null = null; // Using 'any' for WebAudioContext due to type limitations
  private sampleRate: number;
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

  // Current buffer and position for continuous playback
  private currentBuffer: Float32Array | null = null;
  private playbackPosition = 0;

  // Trigger audio for iPhone silent mode
  private static triggerAudio: any = null;

  /**
   * Creates a new PcmStreamPlayer instance
   * @param {{sampleRate?: number}} options
   * @returns {PcmStreamPlayer}
   */
  constructor({
    sampleRate = 24000,
  }: {
    sampleRate?: number;
  } = {}) {
    this.sampleRate = sampleRate;
  }

  /**
   * Initialize the audio context
   * @private
   * @returns {Promise<boolean>}
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

      // Set the sample rate
      if (this.audioContext.sampleRate !== this.sampleRate) {
        console.warn(
          `Audio context sample rate (${this.audioContext.sampleRate}) differs from specified rate (${this.sampleRate})`,
        );
      }

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
  private async startPlayback(): Promise<boolean> {
    try {
      // Initialize audio if needed
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          return false;
        }
      }

      // If there is no data in the queue, exit
      if (this.audioQueue.length === 0) {
        return false;
      }

      // Create the scriptProcessor node (only once)
      const bufferSize = 4096;
      // Using optional chaining to handle potential null and checking if method exists
      const scriptNode = this.audioContext?.createScriptProcessor
        ? this.audioContext.createScriptProcessor(bufferSize, 0, 1)
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
    // If we don't have a current buffer or have finished playing it, get the next one
    if (
      !this.currentBuffer ||
      this.playbackPosition >= this.currentBuffer.length
    ) {
      // Get next buffer from queue
      this.getNextBuffer();
    }

    // Fill the output buffer
    for (let i = 0; i < outputBuffer.length; i++) {
      if (
        this.currentBuffer &&
        this.playbackPosition < this.currentBuffer.length
      ) {
        // If we have data, use it
        outputBuffer[i] = this.currentBuffer[this.playbackPosition++];
      } else {
        // Try to get the next buffer if we ran out
        if (this.getNextBuffer() && this.currentBuffer) {
          // If we got a new buffer, use its first sample
          outputBuffer[i] = this.currentBuffer[0];
          this.playbackPosition = 1; // Move to next position for next time
        } else {
          // No more data, output silence
          outputBuffer[i] = 0;
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
    if (this.audioQueue.length === 0) {
      this.currentBuffer = null;
      return false;
    }

    // Get the next PCM data from queue
    const pcmData = this.audioQueue.shift();
    if (!pcmData || pcmData.length === 0) {
      this.currentBuffer = null;
      return false;
    }

    // Convert Int16Array to Float32Array for audio processing
    const float32Data = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      // Convert from 16-bit PCM to float [-1.0, 1.0]
      float32Data[i] = pcmData[i] / 0x8000;
    }

    // Set as current buffer and reset position
    this.currentBuffer = float32Data;
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

  /**
   * Adds PCM audio data to the currently playing audio stream
   * @param {ArrayBuffer|Int16Array|Uint8Array} arrayBuffer
   * @param {string} [trackId]
   * @returns {Int16Array}
   */
  async add16BitPCM(
    arrayBuffer: ArrayBuffer | Int16Array | Uint8Array,
    trackId = 'default',
  ): Promise<Int16Array> {
    if (typeof trackId !== 'string') {
      throw new Error('trackId must be a string');
    } else if (this.interruptedTrackIds[trackId]) {
      return new Int16Array();
    }

    let buffer: Int16Array;

    if (arrayBuffer instanceof Int16Array) {
      // Already in PCM format
      buffer = arrayBuffer;
    } else if (arrayBuffer instanceof Uint8Array) {
      // Treat as PCM data in Uint8Array
      buffer = new Int16Array(arrayBuffer.buffer);
    } else if (arrayBuffer instanceof ArrayBuffer) {
      // Convert ArrayBuffer to Int16Array
      buffer = new Int16Array(arrayBuffer);
    } else {
      throw new Error(
        'argument must be Int16Array, Uint8Array, or ArrayBuffer',
      );
    }

    // Add to the audio queue
    this.audioQueue.push(buffer);

    // Start playback if not already playing and not paused
    if (!this.isProcessing && !this.isPaused) {
      await this.startPlayback();
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
    const offset = Math.floor(currentTime * this.sampleRate);
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
   * Set the sample rate for audio playback
   * @param {number} sampleRate
   */
  setSampleRate(sampleRate: number): void {
    if (sampleRate !== PcmStreamPlayer.getSampleRate()) {
      throw new Error('Sample rate cannot be changed after initialization');
    } else {
      this.sampleRate = sampleRate;
    }
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
