/* eslint-disable */
/// <reference types="vitest" />
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import {
  checkDevicePermission,
  getAudioDevices,
  floatTo16BitPCM,
  isMobile,
  checkDenoiserSupport,
} from '../../src/ws-tools/utils';
import AgoraRTC from 'agora-rtc-sdk-ng';
import AIDenoiserExtension from 'agora-extension-ai-denoiser';

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

      const result = await checkDevicePermission();
      const result2 = await getAudioDevices();
      expect(result).toEqual({ audio: true });
      expect(result2).toEqual({
        audioInputs: [],
        audioOutputs: [],
      });
    });

    it('should return false when permissions are denied', async () => {
      mockQuery.mockResolvedValue({ state: 'denied' });

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

    it('should return false when denoiser is not supported', () => {
      // Mock AIDenoiserExtension to return incompatible denoiser
      vi.spyOn(mockDenoiser, 'checkCompatibility').mockReturnValue(false);

      const result = checkDenoiserSupport();
      expect(result).toBe(false);
      expect(AgoraRTC.registerExtensions).not.toHaveBeenCalled();
    });
  });
});
