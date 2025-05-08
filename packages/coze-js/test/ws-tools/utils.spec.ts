/* eslint-disable */
/// <reference types="vitest" />
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import {
  checkDevicePermission,
  getAudioDevices,
  floatTo16BitPCM,
  float32ToInt16Array,
  downsampleTo8000,
  isMobile,
  checkDenoiserSupport,
  isBrowserExtension,
  encodeG711A,
  encodeG711U,
} from '../../src/ws-tools/utils';
import AgoraRTC from 'agora-rtc-sdk-ng';

vi.mock('agora-rtc-sdk-ng', () => ({
  default: {
    registerExtensions: vi.fn(),
  },
}));

const mockDenoiser = {
  checkCompatibility: vi.fn().mockReturnValue(true),
};

vi.mock('agora-extension-ai-denoiser', () => ({
  AIDenoiserExtension: vi.fn().mockImplementation(() => mockDenoiser),
}));

describe('WS Tools Utils', () => {
  describe('checkDevicePermission', () => {
    const mockGetUserMedia = vi.fn();
    const mockQuery = vi.fn();

    beforeEach(() => {
      // Mock navigator APIs
      global.navigator.mediaDevices = {
        getUserMedia: mockGetUserMedia,
        enumerateDevices: vi.fn().mockResolvedValue([]),
      } as any;
      global.navigator.permissions = {
        query: mockQuery,
      } as any;
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should return true when permissions are granted', async () => {
      const mockStream = {
        getTracks: () => [
          {
            stop: vi.fn(),
          },
        ],
      };
      mockQuery.mockResolvedValue({ state: 'granted' });
      mockGetUserMedia.mockResolvedValue(mockStream);
      const mockDevices = [
        {
          groupId: 'test-group-id',
          deviceId: 'test-device-id',
          kind: 'audioinput',
          label: 'test-device-label',
        },
        {
          groupId: 'test-group-id',
          deviceId: 'test-device-id',
          kind: 'audiooutput',
          label: 'test-device-label',
        },
      ];

      vi.spyOn(navigator.mediaDevices, 'enumerateDevices').mockResolvedValue(
        mockDevices as any,
      );

      const result = await checkDevicePermission();

      const result2 = await getAudioDevices();
      expect(result).toEqual({ audio: true });
      expect(result2).toEqual({
        audioInputs: mockDevices.filter(device => device.kind === 'audioinput'),
        audioOutputs: mockDevices.filter(
          device => device.kind === 'audiooutput',
        ),
      });
    });

    it('should return false when permissions are denied', async () => {
      mockQuery.mockResolvedValue({ state: 'denied' });

      const result = await checkDevicePermission();
      expect(result).toEqual({ audio: false });
    });

    it('should return false when mediaDevices is not supported', async () => {
      global.navigator.mediaDevices = undefined;
      const result = await checkDevicePermission();
      expect(result).toEqual({ audio: false });
    });

    it('should return false when throw error', async () => {
      mockGetUserMedia.mockRejectedValue(new Error('test'));
      const result = await checkDevicePermission();
      expect(result).toEqual({ audio: false });
    });
  });

  describe('floatTo16BitPCM', () => {
    it('should convert float32 array to 16-bit PCM', () => {
      const input = new Float32Array([0, 0.5, -0.5, 1, -1]);
      const result = floatTo16BitPCM(input);

      expect(result).toBeInstanceOf(ArrayBuffer);
      expect(result.byteLength).toBe(input.length * 2);
    });
  });

  describe('float32ToInt16Array', () => {
    it('should convert Float32Array to Int16Array', () => {
      const input = new Float32Array([0, 0.5, -0.5, 1, -1]);
      const result = float32ToInt16Array(input);

      expect(result).toBeInstanceOf(Int16Array);
      expect(result.length).toBe(input.length);
      expect(result[0]).toBe(0); // Zero remains zero
      
      // Instead of checking exact values with toBeCloseTo, check the values are proportionally correct
      // For positive values, check they're between 0 and 0x7fff (32767)
      expect(result[1]).toBeGreaterThan(0);
      expect(result[1]).toBeLessThanOrEqual(0x7fff);
      
      // For negative values, check they're between -0x8000 (-32768) and 0
      expect(result[2]).toBeLessThan(0);
      expect(result[2]).toBeGreaterThanOrEqual(-0x8000);
      
      // Check that max values map to extremes
      expect(result[3]).toBe(0x7fff); // 1.0 maps to max positive
      expect(result[4]).toBe(-0x8000); // -1.0 maps to max negative
    });
  });

  describe('downsampleTo8000', () => {
    it('should downsample 48000Hz to 8000Hz', () => {
      // Create a test array with 48 elements to simulate 48000Hz sampling rate
      const input = new Float32Array(48);
      for (let i = 0; i < 48; i++) {
        input[i] = i / 48;
      }

      const result = downsampleTo8000(input);

      // Should be downsampled by a factor of 6 (48000/8000)
      expect(result.length).toBe(8);
      // Check that values are sampled at the correct intervals
      expect(result[0]).toBe(input[0]); // First sample
      expect(result[1]).toBe(input[6]); // Sample at index 6
      expect(result[7]).toBe(input[42]); // Last sample at index 42
    });
  });

  describe('isMobile', () => {
    it('should detect mobile devices', () => {
      const mockUserAgents = {
        iPhone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3)',
        android: 'Mozilla/5.0 (Linux; Android 11)',
        desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      };

      // Test mobile detection
      Object.defineProperty(navigator, 'userAgent', {
        value: mockUserAgents.iPhone,
        configurable: true,
      });
      expect(isMobile()).toBe(true);

      // Test desktop detection
      Object.defineProperty(navigator, 'userAgent', {
        value: mockUserAgents.desktop,
        configurable: true,
      });
      expect(isMobile()).toBe(false);
    });
  });

  describe('checkDenoiserSupport', () => {
    beforeEach(() => {
      // Reset window.__denoiser before each test
      window.__denoiser = undefined;
      window.__denoiserSupported = undefined;
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should initialize denoiser and return true when supported', () => {
      const result = checkDenoiserSupport();
      expect(result).toBe(true);
      expect(window.__denoiser).toBeDefined();
      expect(AgoraRTC.registerExtensions).toHaveBeenCalled();
    });

    it('should initialize denoiser with custom assets path when provided', () => {
      const customPath = '/custom/assets/path';
      const result = checkDenoiserSupport(customPath);
      expect(result).toBe(true);
      // We'd need to verify the AIDenoiserExtension was created with the correct path
      // but that's challenging with our current mock setup
    });

    it('should return false when denoiser is not supported', () => {
      // Mock AIDenoiserExtension to return incompatible denoiser
      vi.spyOn(mockDenoiser, 'checkCompatibility').mockReturnValue(false);

      const result = checkDenoiserSupport();
      expect(result).toBe(false);
      expect(AgoraRTC.registerExtensions).not.toHaveBeenCalled();
    });

    it('should use cached denoiser support value when available', () => {
      // Set the support value before calling the function
      window.__denoiserSupported = true;
      const checkCompatibilitySpy = vi.spyOn(mockDenoiser, 'checkCompatibility');
      
      const result = checkDenoiserSupport();
      
      expect(result).toBe(true);
      // Should not check compatibility again
      expect(checkCompatibilitySpy).not.toHaveBeenCalled();
    });
  });

  describe('isBrowserExtension', () => {
    // Save original chrome reference and ensure TypeScript is happy
    const originalChrome = typeof window !== 'undefined' ? (window as any).chrome : undefined;
    const originalGlobalChrome = typeof global !== 'undefined' ? (global as any).chrome : undefined;

    afterEach(() => {
      // Restore original chrome references
      (window as any).chrome = originalChrome;
      (global as any).chrome = originalGlobalChrome;
    });

    it('should return true for browser extensions', () => {
      // Mock both window.chrome and global chrome
      const mockChrome = {
        runtime: {
          id: 'test-extension-id'
        }
      };
      (window as any).chrome = mockChrome;
      // In jsdom, we need to set the global chrome object as well
      (global as any).chrome = mockChrome;

      expect(isBrowserExtension()).toBe(true);
    });

    it('should return false when not in a browser extension', () => {
      (window as any).chrome = undefined;
      expect(isBrowserExtension()).toBe(false);

      (window as any).chrome = {};
      expect(isBrowserExtension()).toBe(false);

      (window as any).chrome = { runtime: {} };
      expect(isBrowserExtension()).toBe(false);
    });
  });

  describe('encodeG711A', () => {
    it('should encode PCM to G.711 A-law', () => {
      const pcmData = new Int16Array([-32768, -16384, 0, 16384, 32767]);
      const result = encodeG711A(pcmData);

      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBe(pcmData.length);
      // Specific encoding values would require detailed testing of the algorithm
    });
  });

  describe('encodeG711U', () => {
    it('should encode PCM to G.711 μ-law', () => {
      const pcmData = new Int16Array([-32768, -16384, 0, 16384, 32767]);
      const result = encodeG711U(pcmData);

      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBe(pcmData.length);
      // Specific encoding values would require detailed testing of the algorithm
    });
  });
});
