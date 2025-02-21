import { describe, expect, test } from 'vitest';

import { isWeb, isWeapp, isTT, isMini } from '../../../src/libs/utils/device';
import {
  TextDecoder,
  TextEncoder,
  TextEncoderPonyfill,
  TextDecoderPonyfill,
} from '../../../src/libs/utils/decorder';
function compareUint8Arrays(arr1: Uint8Array, arr2: Uint8Array): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

describe('utils/decorder', () => {
  test('TextEncoder', () => {
    console.log('Test:', { isWeb, isWeapp, isTT, isMini });
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode('svg---') as unknown as Uint8Array;
    expect(
      compareUint8Arrays(
        uint8Array,
        new Uint8Array([115, 118, 103, 45, 45, 45]),
      ),
    ).toBe(true);
  });

  test('TextDecoder', () => {
    const decoder = new TextDecoder();
    const uint8Array = new Uint8Array([115, 118, 103, 45, 45, 45]);
    const str = decoder.decode(uint8Array);
    expect(str).toBe('svg---');
  });

  test('TextEncoderPonyfill', () => {
    const encoder = new TextEncoderPonyfill();
    const uint8Array = encoder.encode('svg---') as unknown as Uint8Array;
    expect(
      compareUint8Arrays(
        uint8Array,
        new Uint8Array([115, 118, 103, 45, 45, 45]),
      ),
    ).toBe(true);
  });

  test('TextDecoderPonyfill', () => {
    const decoder = new TextDecoderPonyfill();
    const uint8Array = new Uint8Array([115, 118, 103, 45, 45, 45]);
    const str = decoder.decode(uint8Array);
    expect(str).toBe('svg---');
  });
});
