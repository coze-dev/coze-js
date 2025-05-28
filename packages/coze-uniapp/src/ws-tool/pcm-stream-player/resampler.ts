/**
 * Simple audio resampler for PCM audio data
 * Converts audio from one sample rate to another using linear interpolation
 */
export const Resampler = {
  /**
   * Resample PCM audio data from one sample rate to another
   * @param {Int16Array} inputBuffer - Input PCM buffer
   * @param {number} inputSampleRate - Original sample rate
   * @param {number} outputSampleRate - Target sample rate
   * @returns {Int16Array} - Resampled PCM buffer
   */
  resample(
    inputBuffer: Int16Array,
    inputSampleRate: number,
    outputSampleRate: number,
  ): Int16Array {
    // If sample rates are the same, return the original buffer
    if (inputSampleRate === outputSampleRate) {
      return inputBuffer;
    }

    // Calculate the output buffer size based on the ratio of sample rates
    const ratio = outputSampleRate / inputSampleRate;
    const outputLength = Math.ceil(inputBuffer.length * ratio);
    const outputBuffer = new Int16Array(outputLength);

    // Perform linear interpolation for resampling
    for (let i = 0; i < outputLength; i++) {
      // Calculate the position in the input buffer
      const inputPos = i / ratio;
      const inputIndex = Math.floor(inputPos);
      const fraction = inputPos - inputIndex;

      // Handle edge case at the end of the buffer
      if (inputIndex >= inputBuffer.length - 1) {
        outputBuffer[i] = inputBuffer[inputBuffer.length - 1];
        continue;
      }

      // Linear interpolation between two adjacent samples
      const sample1 = inputBuffer[inputIndex];
      const sample2 = inputBuffer[inputIndex + 1];

      // Calculate interpolated value and ensure it's within Int16 range
      const interpolatedValue = sample1 + fraction * (sample2 - sample1);
      outputBuffer[i] = Math.max(
        Math.min(Math.round(interpolatedValue), 32767),
        -32768,
      );
    }

    return outputBuffer;
  },
};
