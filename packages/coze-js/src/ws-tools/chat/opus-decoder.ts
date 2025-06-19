// @ts-expect-error no types
import { OggOpusDecoder } from 'opus-encdec/src/oggOpusDecoder.js';
// @ts-expect-error no types
import OpusDecoderLib from 'opus-encdec/dist/libopus-decoder.js';

export interface OpusDecoderConfig {
  /**
   * Input sample rate of the encoded Opus data
   * @default 24000
   */
  inputSampleRate?: number;

  /**
   * Output sample rate for the decoded PCM data
   * If different from input, resampling will be performed
   * @default 24000
   */
  outputSampleRate?: number;
}

class OpusDecoder {
  private decoder: OggOpusDecoder;
  private decoderReady = false;
  private config: OpusDecoderConfig;

  constructor(config: OpusDecoderConfig) {
    this.config = config;

    this.decoder = new OggOpusDecoder(
      {
        rawOpus: true,
        numberOfChannels: 1,
        decoderSampleRate: this.config.inputSampleRate || 24000,
        outputBufferSampleRate: this.config.outputSampleRate || 24000,
      },
      OpusDecoderLib,
    );

    // Initialize the decoder
    if (this.decoder.isReady === false && this.decoder.onready) {
      this.decoder.onready = () => {
        this.decoderReady = true;
      };
    } else {
      this.decoderReady = true;
    }
  }

  /**
   * Decode Opus data to PCM audio
   * @param data Opus encoded data as Uint8Array
   * @returns Decoded PCM audio as Int16Array or null if error
   */
  decode(inputBuffer: Uint8Array): Int16Array | null {
    try {
      let decodedBuffer: Float32Array | undefined;
      this.decoder.decodeRaw(inputBuffer, (outputBuffer: Float32Array) => {
        decodedBuffer = outputBuffer;
      });
      if (!decodedBuffer) {
        return null;
      }
      // 转成 Int16Array
      const decodedBufferInt16 = new Int16Array(decodedBuffer.length);
      for (let i = 0; i < decodedBuffer.length; i++) {
        decodedBufferInt16[i] = decodedBuffer[i] * 0x8000;
      }
      return decodedBufferInt16;
    } catch (error) {
      console.error('Error decoding Opus data:', error);
      return null;
    }
  }

  /**
   * Check if the decoder is ready
   */
  isReady(): boolean {
    return this.decoderReady;
  }

  /**
   * Wait for the decoder to be ready
   * @returns Promise that resolves when decoder is ready
   */
  async waitForReady(): Promise<void> {
    if (this.decoderReady) {
      return Promise.resolve();
    }

    return new Promise<void>(resolve => {
      const checkInterval = setInterval(() => {
        if (this.decoderReady) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 10);
    });
  }

  /**
   * Release resources used by the decoder
   */
  destroy(): void {
    if (this.decoder) {
      this.decoder.destroy();
    }
  }
}

export default OpusDecoder;
