/**
 * G.711 codec implementation for A-law and μ-law
 */

// A-law to linear PCM conversion table
const ALAW_TO_LINEAR_TABLE = new Int16Array(256);
// μ-law to linear PCM conversion table
const ULAW_TO_LINEAR_TABLE = new Int16Array(256);

// Initialize conversion tables
(function initTables() {
  // A-law to linear PCM conversion
  for (let i = 0; i < 256; i++) {
    const aval = i ^ 0x55;
    let t = (aval & 0x0f) << 4;
    const seg = (aval & 0x70) >> 4;

    if (seg) {
      t = (t + 0x108) << (seg - 1);
    } else {
      t += 8;
    }

    ALAW_TO_LINEAR_TABLE[i] = aval & 0x80 ? t : -t;
  }

  // μ-law to linear PCM conversion
  for (let i = 0; i < 256; i++) {
    const uval = ~i;
    let t = ((uval & 0x0f) << 3) + 0x84;
    const seg = (uval & 0x70) >> 4;

    t <<= seg;

    ULAW_TO_LINEAR_TABLE[i] = uval & 0x80 ? 0x84 - t : t - 0x84;
  }
})();

/**
 * Converts G.711 A-law encoded data to PCM16 format
 * @param {Uint8Array} alawData - A-law encoded data
 * @returns {Int16Array} - PCM16 data
 */
export function decodeAlaw(alawData: Uint8Array): Int16Array {
  const pcmData = new Int16Array(alawData.length);

  for (let i = 0; i < alawData.length; i++) {
    pcmData[i] = ALAW_TO_LINEAR_TABLE[alawData[i]];
  }

  return pcmData;
}

/**
 * Converts G.711 μ-law encoded data to PCM16 format
 * @param {Uint8Array} ulawData - μ-law encoded data
 * @returns {Int16Array} - PCM16 data
 */
export function decodeUlaw(ulawData: Uint8Array): Int16Array {
  const pcmData = new Int16Array(ulawData.length);

  for (let i = 0; i < ulawData.length; i++) {
    pcmData[i] = ULAW_TO_LINEAR_TABLE[ulawData[i]];
  }

  return pcmData;
}
