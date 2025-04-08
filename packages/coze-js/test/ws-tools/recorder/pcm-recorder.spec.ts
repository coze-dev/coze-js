/// <reference types="vitest" />
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import PcmRecorder, {
  AIDenoiserProcessorMode,
  AIDenoiserProcessorLevel,
} from '../../../src/ws-tools/recorder/pcm-recorder';

// Mock window.__denoiser
const mockDenoiser = {
  createProcessor: vi.fn().mockReturnValue({
    enable: vi.fn().mockResolvedValue(undefined),
    disable: vi.fn().mockResolvedValue(undefined),
    setMode: vi.fn().mockResolvedValue(undefined),
    setLevel: vi.fn().mockResolvedValue(undefined),
    dump: vi.fn(),
    on: vi.fn(),
    removeAllListeners: vi.fn(),
    pipe: vi.fn().mockReturnThis(),
    enabled: true,
  }),
};

// Mock global window object
vi.stubGlobal('window', {
  __denoiser: mockDenoiser,
  MediaStream: vi.fn().mockImplementation(function (tracks) {
    return {
      getTracks: () => tracks || [{ stop: vi.fn() }],
    };
  }),
  MediaStreamTrack: vi.fn().mockImplementation(() => ({
    enabled: true,
    stop: vi.fn(),
  })),
  URL: {
    createObjectURL: vi.fn(),
    revokeObjectURL: vi.fn(),
  },
});

// Mock agora-rtc-sdk-ng/esm
vi.mock('agora-rtc-sdk-ng/esm', () => ({
  createMicrophoneAudioTrack: vi.fn().mockResolvedValue({
    pipe: vi.fn().mockReturnThis(),
    processorDestination: {},
    close: vi.fn(),
    getMediaStreamTrack: vi.fn().mockReturnValue({
      enabled: true,
      stop: vi.fn(),
    }),
  }),
  createCustomAudioTrack: vi.fn().mockResolvedValue({
    pipe: vi.fn().mockReturnThis(),
    processorDestination: {},
    close: vi.fn(),
    getMediaStreamTrack: vi.fn().mockReturnValue({
      enabled: true,
      stop: vi.fn(),
    }),
  }),
}));

// Mock agora-extension-ai-denoiser
vi.mock('agora-extension-ai-denoiser', () => ({
  AIDenoiserExtension: class {
    static instance = mockDenoiser;
    createProcessor() {
      return mockDenoiser.createProcessor();
    }
  },
  AIDenoiserProcessor: class {},
}));

// Mock PcmAudioProcessor
vi.mock('../../../src/ws-tools/recorder/processor/pcm-audio-processor', () => ({
  default: class MockPcmAudioProcessor {
    private callback: (data: ArrayBuffer) => void;

    constructor(callback: (data: ArrayBuffer) => void) {
      this.callback = callback;
    }
    startRecording = vi.fn();
    stopRecording = vi.fn();
    destroy = vi.fn();
    pipe = vi.fn().mockReturnThis();
  },
}));

// Mock WavAudioProcessor
vi.mock('../../../src/ws-tools/recorder/processor/wav-audio-processor', () => ({
  default: class MockWavAudioProcessor {
    private callback: (data: { wav: Blob }) => void;

    constructor(callback: (data: { wav: Blob }) => void) {
      this.callback = callback;
    }
    startRecording = vi.fn();
    stopRecording = vi.fn();
    destroy = vi.fn();
    pipe = vi.fn().mockReturnThis();
  },
}));

// Mock agora-rte-extension
vi.mock('agora-rte-extension', () => ({
  IAudioProcessor: class {},
}));

// Mock utils
vi.mock('../../../src/ws-tools/utils', () => ({
  checkDenoiserSupport: vi.fn().mockReturnValue(true),
}));

// Mock types
vi.mock('../../../src/ws-tools/types', () => ({
  AIDenoisingConfig: {},
  AudioCaptureConfig: {},
  WavRecordConfig: {},
}));

describe('PcmRecorder', () => {
  let recorder: PcmRecorder;

  beforeEach(() => {
    vi.clearAllMocks();
    recorder = new PcmRecorder({
      audioCaptureConfig: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('start', () => {
    it('should initialize audio track and processors correctly', async () => {
      await recorder.start();
      expect(recorder['audioTrack']).toBeDefined();
      expect(recorder['stream']).toBeDefined();
    });

    it('should use custom audio track when mediaStreamTrack is provided', async () => {
      const mockMediaStreamTrack = new window.MediaStreamTrack();
      const customRecorder = new PcmRecorder({
        mediaStreamTrack: mockMediaStreamTrack,
      });

      await customRecorder.start();
      expect(customRecorder['audioTrack']).toBeDefined();
    });
  });

  describe('record', () => {
    it('should set up callbacks correctly', async () => {
      await recorder.start();

      const pcmCallback = vi.fn();
      const wavCallback = vi.fn();
      const dumpCallback = vi.fn();

      await recorder.record({
        pcmAudioCallback: pcmCallback,
        wavAudioCallback: wavCallback,
        dumpAudioCallback: dumpCallback,
      });

      expect(recorder['pcmAudioCallback']).toBe(pcmCallback);
      expect(recorder['wavAudioCallback']).toBe(wavCallback);
      expect(recorder['dumpAudioCallback']).toBe(dumpCallback);
      expect(recorder['recording']).toBe(true);
    });

    it('should throw error if audioTrack is not initialized', async () => {
      await expect(recorder.record()).rejects.toThrow(
        'audioTrack is not initialized',
      );
    });
  });

  describe('pause and resume', () => {
    beforeEach(async () => {
      await recorder.start();
      await recorder.record();
    });

    it('should pause recording correctly', () => {
      recorder.pause();
      expect(recorder['recording']).toBe(false);
      expect(recorder['audioTrack']?.getMediaStreamTrack().enabled).toBe(false);
    });

    it('should resume recording correctly', () => {
      recorder.pause();
      recorder.resume();
      expect(recorder['recording']).toBe(true);
      expect(recorder['audioTrack']?.getMediaStreamTrack().enabled).toBe(true);
    });
  });

  describe('destroy', () => {
    it('should cleanup all resources', async () => {
      await recorder.start();
      await recorder.record();

      recorder.destroy();

      expect(recorder['audioTrack']).toBeUndefined();
      expect(recorder['stream']).toBeUndefined();
      expect(recorder['recording']).toBe(false);
      expect(recorder['pcmAudioCallback']).toBeUndefined();
      expect(recorder['wavAudioCallback']).toBeUndefined();
      expect(recorder['dumpAudioCallback']).toBeUndefined();
    });
  });

  describe('AI Denoiser methods', () => {
    beforeEach(async () => {
      await recorder.start();
    });

    it('should get denoiser status', () => {
      expect(recorder.getDenoiserEnabled()).toBe(undefined);
    });

    it('should set denoiser enabled state', async () => {
      await recorder.setDenoiserEnabled(true);
      await recorder.setDenoiserEnabled(false);
    });

    it('should set denoiser mode', async () => {
      await recorder.setDenoiserMode(AIDenoiserProcessorMode.NSNG);
      await recorder.setDenoiserMode(AIDenoiserProcessorMode.STATIONARY_NS);
    });

    it('should set denoiser level', async () => {
      await recorder.setDenoiserLevel(AIDenoiserProcessorLevel.SOFT);
      await recorder.setDenoiserLevel(AIDenoiserProcessorLevel.AGGRESSIVE);
    });
  });

  describe('Other methods', () => {
    it('should return correct recording status', async () => {
      expect(recorder.getStatus()).toBe('ended');

      await recorder.start();
      await recorder.record();

      expect(recorder.getStatus()).toBe('recording');
    });

    it('should return correct sample rate', () => {
      expect(recorder.getSampleRate()).toBe(44100);
    });

    it('should handle dump request', async () => {
      await recorder.start();
      recorder.dump();
    });
  });
});
