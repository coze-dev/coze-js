import crypto from 'crypto';

import { describe, it, expect, vi } from 'vitest';

import { randomHash } from '../random';

vi.mock('crypto');

describe('randomHash', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate random string with specified length', () => {
    const mockHex = '1234567890abcdef';
    vi.mocked(crypto.randomBytes).mockReturnValue({
      toString: () => mockHex,
    } as any);

    const result = randomHash(8);
    expect(result).toBe('12345678');
    expect(crypto.randomBytes).toHaveBeenCalledWith(4);
  });

  it('should handle odd length numbers', () => {
    const mockHex = '1234567890abcdef';
    vi.mocked(crypto.randomBytes).mockReturnValue({
      toString: () => mockHex,
    } as any);

    const result = randomHash(5);
    expect(result).toBe('12345');
    expect(crypto.randomBytes).toHaveBeenCalledWith(3);
  });

  it('should return empty string for length 0', () => {
    const result = randomHash(0);
    expect(result).toBe('');
    expect(crypto.randomBytes).toHaveBeenCalledWith(0);
  });

  it('should handle large numbers', () => {
    const mockHex = '1234567890abcdef'.repeat(10); // 生成足够长的字符串
    vi.mocked(crypto.randomBytes).mockReturnValue({
      toString: () => mockHex,
    } as any);

    const result = randomHash(32);
    expect(result.length).toBe(32);
    expect(crypto.randomBytes).toHaveBeenCalledWith(16);
  });
});
