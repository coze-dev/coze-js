/**
 * PCM Stream Player for Quick App
 * Handles PCM audio stream playback
 */
export class PcmStreamPlayer {
  /**
   * Audio player instance
   */
  private player: any = null;

  /**
   * Audio module from Quick App
   */
  private audio: any;

  /**
   * File module from Quick App
   */
  private file: any;

  /**
   * Debug mode flag
   */
  private debug: boolean;

  /**
   * Temporary file path for audio data
   */
  private tempFilePath = '';

  /**
   * Creates a new PcmStreamPlayer instance
   * @param {Object} options - Configuration options
   * @param {boolean} [options.debug=false] - Enable debug logging
   */
  constructor(options: { debug?: boolean } = {}) {
    this.debug = options.debug || false;

    // Import required modules from Quick App
    this.audio = require('@system.audio');
    this.file = require('@system.file');

    // Generate temporary file path
    this.tempFilePath = `internal://cache/pcm_stream_${Date.now()}.pcm`;

    if (this.debug) {
      console.log(
        '[PcmStreamPlayer] Initialized with temp file:',
        this.tempFilePath,
      );
    }
  }

  /**
   * Write PCM data to temporary file
   * @param {ArrayBuffer} data - PCM audio data
   * @returns {Promise<void>}
   * @private
   */
  private async writeToFile(data: ArrayBuffer): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.file.writeArrayBuffer({
          uri: this.tempFilePath,
          buffer: data,
          append: true,
          success: () => {
            if (this.debug) {
              console.log('[PcmStreamPlayer] Data written to file');
            }
            resolve();
          },
          fail: (error: any) => {
            if (this.debug) {
              console.error(
                '[PcmStreamPlayer] Failed to write data to file:',
                error,
              );
            }
            reject(error);
          },
        });
      } catch (error) {
        if (this.debug) {
          console.error('[PcmStreamPlayer] Error writing to file:', error);
        }
        reject(error);
      }
    });
  }

  /**
   * Clear the temporary file
   * @returns {Promise<void>}
   * @private
   */
  private async clearFile(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.file.delete({
          uri: this.tempFilePath,
          success: () => {
            if (this.debug) {
              console.log('[PcmStreamPlayer] Temporary file cleared');
            }
            resolve();
          },
          fail: (error: any) => {
            // Ignore if file doesn't exist
            if (this.debug) {
              console.log(
                '[PcmStreamPlayer] Failed to clear file (may not exist):',
                error,
              );
            }
            resolve();
          },
        });
      } catch (error) {
        if (this.debug) {
          console.error('[PcmStreamPlayer] Error clearing file:', error);
        }
        reject(error);
      }
    });
  }

  /**
   * Initialize the audio player
   * @returns {Promise<void>}
   * @private
   */
  private initPlayer(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Create audio player if not exists
        if (!this.player) {
          this.player = this.audio.createPlayer();
        }

        // Set up event listeners
        this.player.onprepare = () => {
          if (this.debug) {
            console.log('[PcmStreamPlayer] Player prepared');
          }
          resolve();
        };

        this.player.onerror = (error: any) => {
          if (this.debug) {
            console.error('[PcmStreamPlayer] Player error:', error);
          }
          reject(error);
        };

        this.player.onfinish = () => {
          if (this.debug) {
            console.log('[PcmStreamPlayer] Playback finished');
          }
        };

        // Prepare the player with the PCM file
        this.player.src = this.tempFilePath;
      } catch (error) {
        if (this.debug) {
          console.error(
            '[PcmStreamPlayer] Failed to initialize player:',
            error,
          );
        }
        reject(error);
      }
    });
  }

  /**
   * Feed PCM data to the player
   * @param {ArrayBuffer} data - PCM audio data
   * @returns {Promise<void>}
   */
  async feed(data: ArrayBuffer): Promise<void> {
    try {
      // Write data to temporary file
      await this.writeToFile(data);

      if (this.debug) {
        console.log('[PcmStreamPlayer] Data fed to player');
      }
    } catch (error) {
      if (this.debug) {
        console.error('[PcmStreamPlayer] Failed to feed data:', error);
      }
      throw error;
    }
  }

  /**
   * Start or resume playback
   * @returns {Promise<void>}
   */
  async play(): Promise<void> {
    try {
      // Initialize player
      await this.initPlayer();

      // Start playback
      this.player.play();

      if (this.debug) {
        console.log('[PcmStreamPlayer] Playback started');
      }
    } catch (error) {
      if (this.debug) {
        console.error('[PcmStreamPlayer] Failed to start playback:', error);
      }
      throw error;
    }
  }

  /**
   * Pause playback
   */
  pause(): void {
    if (!this.player) {
      return;
    }

    try {
      this.player.pause();

      if (this.debug) {
        console.log('[PcmStreamPlayer] Playback paused');
      }
    } catch (error) {
      if (this.debug) {
        console.error('[PcmStreamPlayer] Failed to pause playback:', error);
      }
    }
  }

  /**
   * Stop playback
   */
  stop(): void {
    if (!this.player) {
      return;
    }

    try {
      this.player.stop();

      if (this.debug) {
        console.log('[PcmStreamPlayer] Playback stopped');
      }
    } catch (error) {
      if (this.debug) {
        console.error('[PcmStreamPlayer] Failed to stop playback:', error);
      }
    }
  }

  /**
   * Reset the player and clear temporary file
   * @returns {Promise<void>}
   */
  async reset(): Promise<void> {
    try {
      // Stop playback
      this.stop();

      // Clear temporary file
      await this.clearFile();

      if (this.debug) {
        console.log('[PcmStreamPlayer] Player reset');
      }
    } catch (error) {
      if (this.debug) {
        console.error('[PcmStreamPlayer] Failed to reset player:', error);
      }
      throw error;
    }
  }

  /**
   * Clean up resources
   * @returns {Promise<void>}
   */
  async destroy(): Promise<void> {
    try {
      // Stop playback
      this.stop();

      // Release player
      if (this.player) {
        this.player.release();
        this.player = null;
      }

      // Clear temporary file
      await this.clearFile();

      if (this.debug) {
        console.log('[PcmStreamPlayer] Player destroyed');
      }
    } catch (error) {
      if (this.debug) {
        console.error('[PcmStreamPlayer] Failed to destroy player:', error);
      }
    }
  }
}

export default PcmStreamPlayer;
