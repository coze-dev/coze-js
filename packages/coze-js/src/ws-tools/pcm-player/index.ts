import { v4 as uuid } from 'uuid';

import { WavStreamPlayer } from '../wavtools';

class PcmPlayer {
  private wavStreamPlayer: WavStreamPlayer;
  private trackId = 'default';
  private totalDuration = 0;
  private playbackStartTime: number | null = null;
  private playbackPauseTime: number | null = null;
  private playbackTimeout: NodeJS.Timeout | null = null;
  private elapsedBeforePause = 0;
  private onCompleted: () => void;
  private isPauseDefault = false;
  constructor({
    onCompleted,
    isPauseDefault = false,
  }: {
    onCompleted: () => void;
    isPauseDefault?: boolean;
  }) {
    this.wavStreamPlayer = new WavStreamPlayer({ sampleRate: 24000 });
    this.onCompleted = onCompleted;
    this.isPauseDefault = isPauseDefault;
  }

  /**
   * Initializes the PCM player with a new track ID. This method must be called before using append.
   * After calling interrupt, init must be called again to reinitialize the player.
   * @param {Object} options - Initialization options
   * @param {boolean} [options.isPauseDefault=false] - Whether to start in paused state
   */
  init() {
    this.trackId = `my-track-id-${uuid()}`;
    this.totalDuration = 0;
    if (this.playbackTimeout) {
      clearTimeout(this.playbackTimeout);
      this.playbackTimeout = null;
    }
    this.playbackStartTime = null;
    this.wavStreamPlayer.add16BitPCM(new ArrayBuffer(0), this.trackId);
    if (this.isPauseDefault) {
      this.pause();
    }
  }

  /**
   * Destroys the PCM player instance and cleans up resources.
   * Should be called when the page is unloaded or when the instance is no longer needed.
   */
  async destroy() {
    if (this.playbackTimeout) {
      clearTimeout(this.playbackTimeout);
    }
    await this.wavStreamPlayer.interrupt();
  }

  /**
   * Completes the current playback and triggers the onCompleted callback after remaining duration.
   * @private
   */
  complete() {
    if (this.playbackStartTime) {
      // 剩余时间 = 总时间 - 已播放时间 - 已暂停时间
      const now = new Date().getTime();
      const remaining =
        this.totalDuration -
        (now - this.playbackStartTime) / 1000 -
        this.elapsedBeforePause;

      this.playbackTimeout = setTimeout(() => {
        this.onCompleted();
        this.playbackStartTime = null;
        this.elapsedBeforePause = 0;
      }, remaining * 1000);
    }
  }

  /**
   * Interrupts the current playback. Any audio appended after interrupt will not play
   * until init is called again to reinitialize the player.
   */
  async interrupt() {
    await this.destroy();
    this.onCompleted();
  }

  /**
   * Pauses the current playback. The playback can be resumed from the paused position
   * by calling resume.
   */
  async pause() {
    if (this.playbackTimeout) {
      clearTimeout(this.playbackTimeout);
      this.playbackTimeout = null;
    }
    if (this.playbackStartTime && !this.playbackPauseTime) {
      this.playbackPauseTime = Date.now();
      this.elapsedBeforePause +=
        (this.playbackPauseTime - this.playbackStartTime) / 1000;
    }
    await this.wavStreamPlayer.pause();
  }

  /**
   * Resumes playback from the last paused position.
   */
  async resume() {
    if (this.playbackPauseTime) {
      this.playbackStartTime = Date.now();
      this.playbackPauseTime = null;

      // Update the timeout with remaining duration
      if (this.playbackTimeout) {
        clearTimeout(this.playbackTimeout);
      }
      const remaining = this.totalDuration - this.elapsedBeforePause;
      this.playbackTimeout = setTimeout(() => {
        this.onCompleted();
        console.debug('[pcm player] completed', this.totalDuration);
        this.playbackStartTime = null;
        this.elapsedBeforePause = 0;
      }, remaining * 1000);
    }
    await this.wavStreamPlayer.resume();
  }

  /**
   * Toggles between play and pause states.
   * If currently playing, it will pause; if paused, it will resume playback.
   */
  async togglePlay() {
    if (this.isPlaying()) {
      await this.pause();
    } else {
      await this.resume();
    }
  }

  /**
   * Checks if audio is currently playing.
   * @returns {boolean} True if audio is playing, false otherwise
   */
  isPlaying() {
    return this.wavStreamPlayer.isPlaying();
  }

  /**
   * Appends and plays a base64 encoded PCM audio chunk.
   * Must call init before using this method.
   * @param {string} message - Base64 encoded PCM audio data
   */
  async append(message: string) {
    const decodedContent = atob(message);
    const arrayBuffer = new ArrayBuffer(decodedContent.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < decodedContent.length; i++) {
      view[i] = decodedContent.charCodeAt(i);
    }

    // Calculate duration in seconds
    const bytesPerSecond = 24000 * 1 * (16 / 8); // sampleRate * channels * (bitDepth/8)
    const duration = arrayBuffer.byteLength / bytesPerSecond;
    this.totalDuration += duration;

    try {
      await this.wavStreamPlayer.add16BitPCM(arrayBuffer, this.trackId);

      // Start or update the playback timer
      if (!this.playbackStartTime && !this.playbackPauseTime) {
        this.playbackStartTime = Date.now();
        this.elapsedBeforePause = 0;
      }
    } catch (error) {
      console.warn('[pcm player] error', error);
    }
  }
}

export default PcmPlayer;
