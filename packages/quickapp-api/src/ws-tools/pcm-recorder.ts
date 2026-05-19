/**
 * PCM Recorder for Quick App
 * Handles audio recording in PCM format
 */

/**
 * Recording status enum
 */
export enum RecordingStatus {
  INACTIVE = 'inactive',
  RECORDING = 'recording',
  PAUSED = 'paused',
}

/**
 * PCM Recorder configuration options
 */
export interface PcmRecorderConfig {
  /**
   * Audio sample rate (Hz)
   */
  sampleRate?: number;

  /**
   * Number of audio channels
   */
  channels?: number;

  /**
   * Bits per sample
   */
  bitsPerSample?: number;

  /**
   * Enable debug logging
   */
  debug?: boolean;
}

/**
 * PCM Recorder class for Quick App
 * Handles audio recording in PCM format
 */
export class PcmRecorder {
  /**
   * Configuration options
   */
  private config: Required<PcmRecorderConfig>;

  /**
   * Quick App recorder instance
   */
  private recorder: any;

  private initEvent = false;

  /**
   * Current recording status
   */
  private status: RecordingStatus = RecordingStatus.INACTIVE;

  /**
   * Data callback function
   */
  private onDataCallback: ((data: ArrayBuffer) => void) | null = null;

  /**
   * Error callback function
   */
  private onErrorCallback: ((error: Error) => void) | null = null;

  /**
   * Creates a new PcmRecorder instance
   * @param {PcmRecorderConfig} config - Configuration options
   */
  constructor(config: PcmRecorderConfig = {}) {
    this.config = {
      sampleRate: config.sampleRate || 48000,
      channels: config.channels || 1,
      bitsPerSample: config.bitsPerSample || 16,
      debug: config.debug || false,
    };

    // Import the record module from Quick App
    try {
      this.recorder = require('@system.record');
    } catch (error) {
      // 在测试环境中，使用全局模拟的record对象
      if (
        typeof global !== 'undefined' &&
        (global as any).system &&
        (global as any).system.record
      ) {
        this.recorder = (global as any).system.record;
      } else {
        throw new Error('Failed to load @system.record module');
      }
    }
  }

  /**
   * Initialize the recorder
   */
  private initRecorder(): void {
    if (this.initEvent && this.recorder) {
      return;
    }

    this.initEvent = true;

    try {
      // Set up frame recorded event listener for PCM data
      this.recorder.onframerecorded = (data: any) => {
        if (
          this.status === RecordingStatus.RECORDING &&
          this.onDataCallback &&
          data.frameBuffer
        ) {
          this.onDataCallback(data.frameBuffer);
        }
      };

      if (this.config.debug) {
        console.log('[PcmRecorder] Recorder initialized');
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[PcmRecorder] Failed to initialize recorder:', error);
      }

      if (this.onErrorCallback) {
        this.onErrorCallback(new Error('Failed to initialize recorder'));
      }
    }
  }

  /**
   * Start recording
   */
  start(): void {
    if (this.status === RecordingStatus.RECORDING) {
      return;
    }

    try {
      this.initRecorder();

      // system.record doesn't support pause/resume, so we always start fresh
      this.recorder.start({
        duration: 600000,
        sampleRate: this.config.sampleRate,
        numberOfChannels: this.config.channels,
        encodeBitRate: this.config.sampleRate,
        format: 'pcm',
        frameSize: 1024, // Enable frame callback for PCM data
        success: (data: any) => {
          if (this.config.debug) {
            console.log('[PcmRecorder] Recording completed:', data.uri);
          }
        },
        fail: (data: any, code: number) => {
          if (this.config.debug) {
            console.error('[PcmRecorder] Recording failed:', data, code);
          }
          if (this.onErrorCallback) {
            this.onErrorCallback(
              new Error(`Recording failed: ${data} (code: ${code})`),
            );
          }
        },
      });

      this.status = RecordingStatus.RECORDING;

      if (this.config.debug) {
        console.log('[PcmRecorder] Recording started');
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[PcmRecorder] Failed to start recording:', error);
      }

      if (this.onErrorCallback) {
        this.onErrorCallback(new Error('Failed to start recording'));
      }
    }
  }

  /**
   * Stop recording
   */
  stop(): void {
    if (this.status === RecordingStatus.INACTIVE) {
      return;
    }

    try {
      this.recorder.stop();
      this.status = RecordingStatus.INACTIVE;

      if (this.config.debug) {
        console.log('[PcmRecorder] Recording stopped');
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[PcmRecorder] Failed to stop recording:', error);
      }

      if (this.onErrorCallback) {
        this.onErrorCallback(new Error('Failed to stop recording'));
      }
    }
  }

  /**
   * Pause recording
   */
  pause(): void {
    // system.record doesn't support pause, so we stop instead
    if (this.status !== RecordingStatus.RECORDING) {
      return;
    }

    try {
      this.recorder.stop();
      this.status = RecordingStatus.PAUSED;

      if (this.config.debug) {
        console.log('[PcmRecorder] Recording paused (stopped)');
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[PcmRecorder] Failed to pause recording:', error);
      }

      if (this.onErrorCallback) {
        this.onErrorCallback(new Error('Failed to pause recording'));
      }
    }
  }

  /**
   * Resume recording
   */
  resume(): void {
    // system.record doesn't support resume, so we start fresh
    if (this.status !== RecordingStatus.PAUSED) {
      return;
    }

    try {
      this.start();

      if (this.config.debug) {
        console.log('[PcmRecorder] Recording resumed (restarted)');
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[PcmRecorder] Failed to resume recording:', error);
      }

      if (this.onErrorCallback) {
        this.onErrorCallback(new Error('Failed to resume recording'));
      }
    }
  }

  /**
   * Get current recording status
   * @returns {RecordingStatus} Current recording status
   */
  getStatus(): RecordingStatus {
    return this.status;
  }

  /**
   * Set data callback function
   * @param {Function} callback - Data callback function
   */
  onData(callback: (data: ArrayBuffer) => void): void {
    this.onDataCallback = callback;
  }

  /**
   * Set error callback function
   * @param {Function} callback - Error callback function
   */
  onError(callback: (error: Error) => void): void {
    this.onErrorCallback = callback;
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stop();

    if (this.recorder) {
      // system.record doesn't have release method
      this.recorder = null;
    }

    this.onDataCallback = null;
    this.onErrorCallback = null;

    if (this.config.debug) {
      console.log('[PcmRecorder] Destroyed');
    }
  }
}

export default PcmRecorder;
