import { StreamProcessorSrc } from './worklets/stream_processor';
import LocalLoopback from './local-loopback';
import { decodeAlaw, decodeUlaw } from './codecs/g711';

/**
 * Audio format types supported by WavStreamPlayer
 */
export type AudioFormat = 'pcm' | 'g711a' | 'g711u';

/**
 * Plays audio streams received in raw PCM16, G.711a, or G.711u chunks from the browser
 * @class
 */
export class WavStreamPlayer {
  scriptSrc: string;
  sampleRate: number;
  context: AudioContext | null;
  streamNode: AudioWorkletNode | null;
  trackSampleOffsets: Record<string, { trackId: string, offset: number, currentTime: number }>;
  interruptedTrackIds: Record<string, boolean>;
  isPaused: boolean;
  /**
   * Whether to enable local loopback
   */
  enableLocalLoopback: boolean;
  localLoopback: LocalLoopback | undefined;

  /**
   * Default audio format
   */
  defaultFormat: AudioFormat;
  localLoopbackStream: MediaStream | undefined;
  private muted: boolean = false;

  /**
   * Creates a new WavStreamPlayer instance
   * @param {{sampleRate?: number, enableLocalLoopback?: boolean, defaultFormat?: AudioFormat}} options
   * @returns {WavStreamPlayer}
   */
  constructor({ sampleRate = 44100, enableLocalLoopback = false, defaultFormat = 'pcm' }: {
    sampleRate?: number,
    enableLocalLoopback?: boolean,
    defaultFormat?: AudioFormat
  } = {}) {
    this.scriptSrc = StreamProcessorSrc;
    this.sampleRate = sampleRate;
    this.context = null;
    this.streamNode = null;
    this.trackSampleOffsets = {};
    this.interruptedTrackIds = {};
    this.isPaused = false;
    this.enableLocalLoopback = enableLocalLoopback;
    this.defaultFormat = defaultFormat;

    if(this.enableLocalLoopback) {
      this.localLoopback = new LocalLoopback(true);
    }
  }

  /**
   * Connects the audio context and enables output to speakers
   * @returns {Promise<true>}
   */
  private async connect(): Promise<true> {
    this.context = new AudioContext({ sampleRate: this.sampleRate });

    if(this.enableLocalLoopback) {
      await this.localLoopback?.connect(this.context, this.localLoopbackStream);
    }

    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
    try {
      await this.context.audioWorklet.addModule(this.scriptSrc);
    } catch (e) {
      console.error(e);
      throw new Error(`Could not add audioWorklet module: ${this.scriptSrc}`);
    }
    return true;
  }

  /**
   * Pauses audio playback
   */
  async pause(): Promise<void> {
    if (this.context && !this.isPaused) {
      await this.context.suspend();
      this.isPaused = true;
    }
  }

  /**
   * Resumes audio playback
   */
  async resume(): Promise<void> {
    if (this.context && this.isPaused) {
      await this.context.resume();
      this.isPaused = false;
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
    return Boolean(this.context && this.streamNode && !this.isPaused && this.context.state === 'running');
  }

  /**
   * Starts audio streaming
   * @private
   * @returns {Promise<true>}
   */
  private async _start(): Promise<true> {
    // Ensure worklet is loaded
    if (!this.context) {
      await this.connect();
    }

    const streamNode = new AudioWorkletNode(this.context!, 'stream-processor');
    streamNode.port.onmessage = (e: MessageEvent) => {
      const { event } = e.data;
      if (event === 'stop') {
        if(this.localLoopback) {
          this.localLoopback.stop();
        } else {
          streamNode.disconnect();
        }
        this.streamNode = null;

      } else if (event === 'offset') {
        const { requestId, trackId, offset } = e.data;
        const currentTime = offset / this.sampleRate;
        this.trackSampleOffsets[requestId] = { trackId, offset, currentTime };
      }
    };

    if(this.enableLocalLoopback) {
      this.localLoopback?.start(streamNode);
    } else {
      streamNode.connect(this.context!.destination);
    }

    this.streamNode = streamNode;
    return true;
  }

  /**
   * Adds audio data to the currently playing audio stream
   * You can add chunks beyond the current play point and they will be queued for play
   * @param {ArrayBuffer|Int16Array|Uint8Array} arrayBuffer
   * @param {string} [trackId]
   * @param {AudioFormat} [format] - Audio format: 'pcm', 'g711a', or 'g711u'
   * @returns {Int16Array}
   */
  async add16BitPCM(arrayBuffer: ArrayBuffer | Int16Array | Uint8Array, trackId: string = 'default', format?: AudioFormat): Promise<Int16Array> {
    if (typeof trackId !== 'string') {
      throw new Error(`trackId must be a string`);
    } else if (this.interruptedTrackIds[trackId]) {
      return new Int16Array();
    }
    if (!this.streamNode) {
      await this._start();
    }
    let buffer: Int16Array;
    const audioFormat = format || this.defaultFormat;

    if (arrayBuffer instanceof Int16Array) {
      // Already in PCM format
      buffer = arrayBuffer;
    } else if (arrayBuffer instanceof Uint8Array) {
      // Handle G.711 formats
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
      throw new Error(`argument must be Int16Array, Uint8Array, or ArrayBuffer`);
    }
    this.streamNode!.port.postMessage({ event: 'write', buffer, trackId });
    return buffer;
  }

  /**
   * Gets the offset (sample count) of the currently playing stream
   * @param {boolean} [interrupt]
   * @returns {{trackId: string|null, offset: number, currentTime: number} | null}
   */
  async getTrackSampleOffset(interrupt: boolean = false): Promise<{
    trackId: string | null;
    offset: number;
    currentTime: number;
  } | null> {
    if (!this.streamNode) {
      return null;
    }
    const requestId = crypto.randomUUID();
    this.streamNode.port.postMessage({
      event: interrupt ? 'interrupt' : 'offset',
      requestId,
    });
    let trackSampleOffset;
    while (!trackSampleOffset) {
      trackSampleOffset = this.trackSampleOffsets[requestId];
      await new Promise((r) => setTimeout(r, 1));
    }
    const { trackId } = trackSampleOffset;
    if (interrupt && trackId) {
      this.interruptedTrackIds[trackId] = true;
    }
    return trackSampleOffset;
  }

  /**
   * Strips the current stream and returns the sample offset of the audio
   * @returns {{trackId: string|null, offset: number, currentTime: number} | null}
   */
  async interrupt(): Promise<{
    trackId: string | null;
    offset: number;
    currentTime: number;
  } | null> {
    return this.getTrackSampleOffset(true);
  }

  /**
   * Set media stream for local loopback
   */
  setMediaStream(stream?: MediaStream) {
    this.localLoopbackStream = stream;
  }

  /**
   * Adds G.711 A-law encoded audio data to the currently playing audio stream
   * @param {ArrayBuffer|Uint8Array} arrayBuffer - G.711 A-law encoded data
   * @param {string} [trackId]
   * @returns {Int16Array}
   */
  async addG711a(arrayBuffer: ArrayBuffer | Uint8Array, trackId: string = 'default'): Promise<Int16Array> {
    return this.add16BitPCM(arrayBuffer, trackId, 'g711a');
  }

  /**
   * Adds G.711 μ-law encoded audio data to the currently playing audio stream
   * @param {ArrayBuffer|Uint8Array} arrayBuffer - G.711 μ-law encoded data
   * @param {string} [trackId]
   * @returns {Int16Array}
   */
  async addG711u(arrayBuffer: ArrayBuffer | Uint8Array, trackId: string = 'default'): Promise<Int16Array> {
    return this.add16BitPCM(arrayBuffer, trackId, 'g711u');
  }

  setSampleRate(sampleRate: number) {
    this.sampleRate = sampleRate;
  }

  setDefaultFormat(format: AudioFormat) {
    this.defaultFormat = format;
  }

  /**
   * Sets whether audio playback is muted
   * @param {boolean} muted - Whether to mute audio playback
   */
  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.streamNode) {
      this.streamNode.port.postMessage({ event: 'mute', muted });
    }
  }

  /**
   * Gets whether audio playback is muted
   * @returns {boolean} Whether audio playback is muted
   */
  isMuted(): boolean {
    return this.muted;
  }

  /**
   * Destroys the player instance and releases all resources
   * Should be called when the player is no longer needed
   */
  async destroy(): Promise<void> {
    // Stop any audio that's playing
    if (this.streamNode) {
      this.streamNode.disconnect();
      this.streamNode = null;
    }

    // Clean up local loopback
    if (this.localLoopback) {
      this.localLoopback.cleanup();
      this.localLoopback = undefined;
    }

    // Close audio context
    if (this.context) {
      await this.context.close();
      this.context = null;
    }

    // Reset all state
    this.trackSampleOffsets = {};
    this.interruptedTrackIds = {};
    this.isPaused = false;
  }
}
