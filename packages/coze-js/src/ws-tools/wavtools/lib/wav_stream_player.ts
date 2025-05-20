import { StreamProcessorSrc } from './worklets/stream_processor';
import LocalLookback from './local-lookback';

/**
 * Plays audio streams received in raw PCM16 chunks from the browser
 * @class
 */
export class WavStreamPlayer {
  scriptSrc: string;
  sampleRate: number;
  context: AudioContext | null;
  stream: AudioWorkletNode | null;
  trackSampleOffsets: Record<string, { trackId: string, offset: number, currentTime: number }>;
  interruptedTrackIds: Record<string, boolean>;
  isPaused: boolean;
  /**
   * Whether to enable local lookback
   */
  enableLocalLookback: boolean;
  localLookback: LocalLookback | undefined;

  /**
   * Creates a new WavStreamPlayer instance
   * @param {{sampleRate?: number}} options
   * @returns {WavStreamPlayer}
   */
  constructor({ sampleRate = 44100, enableLocalLookback = false }: { sampleRate?: number, enableLocalLookback?: boolean } = {}) {
    this.scriptSrc = StreamProcessorSrc;
    this.sampleRate = sampleRate;
    this.context = null;
    this.stream = null;
    this.trackSampleOffsets = {};
    this.interruptedTrackIds = {};
    this.isPaused = false;
    this.enableLocalLookback = enableLocalLookback;

    if(this.enableLocalLookback) {
      this.localLookback = new LocalLookback(true);
    }
  }

  /**
   * Connects the audio context and enables output to speakers
   * @returns {Promise<true>}
   */
  private async connect(): Promise<true> {
    this.context = new AudioContext({ sampleRate: this.sampleRate });

    if(this.enableLocalLookback) {
      this.localLookback?.connect(this.context);
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
    return Boolean(this.context && this.stream && !this.isPaused && this.context.state === 'running');
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
        streamNode.disconnect();
        this.stream = null;

      } else if (event === 'offset') {
        const { requestId, trackId, offset } = e.data;
        const currentTime = offset / this.sampleRate;
        this.trackSampleOffsets[requestId] = { trackId, offset, currentTime };
      }
    };

    if(this.enableLocalLookback) {
      this.localLookback?.start(streamNode);
    } else {
      streamNode.connect(this.context!.destination);
    }

    this.stream = streamNode;
    return true;
  }

  /**
   * Adds 16BitPCM data to the currently playing audio stream
   * You can add chunks beyond the current play point and they will be queued for play
   * @param {ArrayBuffer|Int16Array} arrayBuffer
   * @param {string} [trackId]
   * @returns {Int16Array}
   */
  async add16BitPCM(arrayBuffer: ArrayBuffer | Int16Array, trackId: string = 'default'): Promise<Int16Array> {
    if (typeof trackId !== 'string') {
      throw new Error(`trackId must be a string`);
    } else if (this.interruptedTrackIds[trackId]) {
      return new Int16Array();
    }
    if (!this.stream) {
      await this._start();
    }
    let buffer: Int16Array;
    if (arrayBuffer instanceof Int16Array) {
      buffer = arrayBuffer;
    } else if (arrayBuffer instanceof ArrayBuffer) {
      buffer = new Int16Array(arrayBuffer);
    } else {
      throw new Error(`argument must be Int16Array or ArrayBuffer`);
    }
    this.stream!.port.postMessage({ event: 'write', buffer, trackId });
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
    if (!this.stream) {
      return null;
    }
    const requestId = crypto.randomUUID();
    this.stream.port.postMessage({
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
   * Set media stream for local lookback
   */
  setMediaStream(stream?: MediaStream) {
    this.localLookback?.setMediaStream(stream);
  }
}
