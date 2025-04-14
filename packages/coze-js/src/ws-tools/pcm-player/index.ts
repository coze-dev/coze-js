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
  constructor({ onCompleted }: { onCompleted: () => void }) {
    this.wavStreamPlayer = new WavStreamPlayer({ sampleRate: 24000 });
    this.onCompleted = onCompleted;
  }

  init() {
    this.trackId = `my-track-id-${uuid()}`;
    this.totalDuration = 0;
    if (this.playbackTimeout) {
      clearTimeout(this.playbackTimeout);
      this.playbackTimeout = null;
    }
    this.playbackStartTime = null;
  }

  async disconnect() {
    if (this.playbackTimeout) {
      clearTimeout(this.playbackTimeout);
    }
    await this.wavStreamPlayer.interrupt();
  }

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

  async interrupt() {
    await this.disconnect();
    this.onCompleted();
  }

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

  async togglePlay() {
    if (this.isPlaying()) {
      await this.pause();
    } else {
      await this.resume();
    }
  }

  isPlaying() {
    return this.wavStreamPlayer.isPlaying();
  }

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
