/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * PcmRecorder for WeChat Mini Program
 * Records audio using the uni.getRecorderManager API and provides PCM data
 */

/**
 * Recording status types
 */
export enum RecordingStatus {
  IDLE = 'idle',
  RECORDING = 'recording',
  PAUSED = 'paused',
}

/**
 * Configuration options for PcmRecorder
 */
export interface PcmRecorderConfig {
  /**
   * Sample rate for audio recording (default: 16000)
   */
  sampleRate?: number;
  /**
   * Enable debug logging
   */
  debug?: boolean;
}

/**
 * PcmRecorder class for WeChat Mini Program
 * Simplified version without AI denoising and other advanced features
 */
export class PcmRecorder {
  /**
   * The recorder manager instance from uni API
   */
  private recorderManager: UniApp.RecorderManager;
  /**
   * Current recording status
   */
  private status: RecordingStatus = RecordingStatus.IDLE;
  /**
   * Callback function for PCM audio data
   */
  private pcmAudioCallback: ((data: { raw: ArrayBuffer }) => void) | undefined;
  /**
   * Configuration for the recorder
   */
  private config: PcmRecorderConfig;

  /**
   * Creates a new PcmRecorder instance
   * @param {PcmRecorderConfig} config - Configuration options
   */
  constructor(config: PcmRecorderConfig = {}) {
    // Merge provided config with defaults
    this.config = {
      ...config,
    };

    // Initialize the recorder manager
    this.recorderManager = uni.getRecorderManager();
    this.setupEventListeners();

    this.log('PcmRecorder initialized');
  }

  /**
   * Set up event listeners for the recorder manager
   * @private
   */
  private setupEventListeners(): void {
    // Handle frame buffer events (PCM data chunks)
    this.recorderManager.onFrameRecorded(({ frameBuffer, isLastFrame }) => {
      // this.log(
      //   'Frame recorded',
      //   isLastFrame ? '(last frame)' : '',
      //   frameBuffer.byteLength,
      // );

      if (this.status === RecordingStatus.RECORDING) {
        // Pass the PCM data to callback
        this.pcmAudioCallback?.({ raw: frameBuffer });
      }

      if (isLastFrame) {
        this.status = RecordingStatus.IDLE;
      }
    });

    // Handle errors
    this.recorderManager.onError(error => {
      console.error('Recording error:', error);
      this.status = RecordingStatus.IDLE;
    });

    // Handle recording stop
    this.recorderManager.onStop(() => {
      this.log('Recording stopped');
      this.status = RecordingStatus.IDLE;
    });

    // Handle recording pause
    this.recorderManager.onPause(() => {
      this.log('Recording paused');
      this.status = RecordingStatus.PAUSED;
    });

    // Note: RecorderManager does not have an onResume event in WeChat Mini Program
    // We'll handle resume status manually in the resume() method

    // Handle recording start
    this.recorderManager.onStart(() => {
      this.log('Recording started');
      this.status = RecordingStatus.RECORDING;
    });
  }

  /**
   * Start recording audio
   */
  start() {
    if (this.status !== RecordingStatus.IDLE) {
      this.log('Cannot start recording: already in progress');
      return;
    }

    const options: UniApp.RecorderManagerStartOptions = {
      duration: 600000, // 10 minutes max
      sampleRate: this.config.sampleRate,
      numberOfChannels: 1,
      format: 'PCM', // Always PCM for our use case
      frameSize: 2,
    };

    try {
      this.recorderManager.start(options);
      this.log('Recording started with options:', options);
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw new Error('Failed to start recording');
    }
  }

  /**
   * Start recording and register callbacks
   * @param {object} params - Parameters containing callbacks
   * @param {function} params.pcmAudioCallback - Callback for PCM audio data
   */
  record({
    pcmAudioCallback,
  }: {
    pcmAudioCallback?: (data: { raw: ArrayBuffer }) => void;
  } = {}): void {
    // Register the callback
    this.pcmAudioCallback = pcmAudioCallback;
  }

  /**
   * Pause recording temporarily
   */
  pause(): void {
    if (this.status === RecordingStatus.RECORDING) {
      this.recorderManager.pause();
      this.log('Recording paused');
    } else {
      this.log('Cannot pause: not recording');
    }
  }

  /**
   * Resume recording after pause
   */
  resume(): void {
    if (this.status === RecordingStatus.PAUSED) {
      this.recorderManager.resume();
      // Manually update status since there's no onResume event
      this.status = RecordingStatus.RECORDING;
      this.log('Recording resumed');
    } else {
      this.log('Cannot resume: not paused');
    }
  }

  /**
   * Stop recording and clean up resources
   */
  destroy(): void {
    // Stop recording if in progress
    if (this.status !== RecordingStatus.IDLE) {
      this.recorderManager.stop();
    }

    // Clear callbacks
    this.pcmAudioCallback = undefined;
    this.status = RecordingStatus.IDLE;

    this.log('Recorder destroyed');
  }

  /**
   * Get current recording status
   * @returns {string} - Current status: 'idle', 'recording', or 'paused'
   */
  getStatus(): string {
    return this.status;
  }

  /**
   * Get current sample rate
   * @returns {number} - Sample rate in Hz
   */
  getSampleRate(): number {
    return this.config.sampleRate || 16000;
  }

  /**
   * Log messages when debug is enabled
   * @private
   */
  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[PcmRecorder]', ...args);
    }
  }
}

// Export for use with import {PcmRecorder} from '@coze/uniapp-api/ws-tools'
export default PcmRecorder;
