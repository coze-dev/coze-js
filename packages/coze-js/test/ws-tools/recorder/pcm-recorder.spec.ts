/// <reference types="vitest" />
// @vitest-environment jsdom
/* eslint-disable */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
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
const mockURL = {
  createObjectURL: vi.fn().mockReturnValue('blob:mock-url'),
  revokeObjectURL: vi.fn(),
};

vi.stubGlobal('window', {
  __denoiser: mockDenoiser,
  __denoiserSupported: true,
  MediaStream: vi.fn().mockImplementation(function (tracks) {
    return {
      getTracks: () => tracks || [{ stop: vi.fn() }],
    };
  }),
  MediaStreamTrack: vi.fn().mockImplementation(() => ({
    enabled: true,
    stop: vi.fn(),
  })),
  URL: mockURL,
});

vi.stubGlobal('URL', mockURL);
vi.stubGlobal(
  'AudioContext',
  vi.fn().mockImplementation(() => ({
    createGain: vi.fn().mockReturnValue({
      connect: vi.fn(),
      gain: { value: 1 },
    }),
    createMediaStreamSource: vi.fn().mockReturnValue({
      connect: vi.fn(),
    }),
    createScriptProcessor: vi.fn().mockReturnValue({
      connect: vi.fn(),
      disconnect: vi.fn(),
      addEventListener: vi.fn(),
    }),
    destination: {},
  })),
);

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

// Define mock processors - move all processor mocking to a dedicated module factory
// This avoids hoisting issues
vi.mock('../../../src/ws-tools/recorder/processor/pcm-audio-processor', () => {
  return {
    default: vi.fn().mockImplementation(callback => ({
      startRecording: vi.fn(),
      stopRecording: vi.fn(),
      destroy: vi.fn(),
      pipe: vi.fn().mockReturnThis(),
      _callback: callback,
    })),
  };
});

// Mock OpusAudioProcessor
vi.mock('../../../src/ws-tools/recorder/processor/opus-audio-processor', () => {
  return {
    default: vi.fn().mockImplementation(callback => ({
      startRecording: vi.fn(),
      stopRecording: vi.fn(),
      destroy: vi.fn(),
      pipe: vi.fn().mockReturnThis(),
      _callback: callback,
    })),
  };
});

// Mock WavAudioProcessor
vi.mock('../../../src/ws-tools/recorder/processor/wav-audio-processor', () => {
  return {
    default: vi.fn().mockImplementation(callback => ({
      startRecording: vi.fn(),
      stopRecording: vi.fn(),
      destroy: vi.fn(),
      pipe: vi.fn().mockReturnThis(),
      _callback: callback,
    })),
  };
});

// Mock worklet processor
vi.mock(
  '../../../src/ws-tools/recorder/processor/pcm-worklet-processor',
  () => {
    return {
      default: vi.fn().mockImplementation(() => ({
        startRecording: vi.fn(),
        stopRecording: vi.fn(),
        destroy: vi.fn(),
        pipe: vi.fn().mockReturnThis(),
      })),
    };
  },
);

// Mock utils
vi.mock('../../../src/ws-tools/utils', () => ({
  checkDenoiserSupport: vi.fn().mockReturnValue(true),
  isBrowserExtension: vi.fn().mockReturnValue(false),
  floatTo16BitPCM: vi.fn(),
  float32ToInt16Array: vi.fn(),
  downsampleTo8000: vi.fn(),
  isMobile: vi.fn(),
  encodeG711A: vi.fn(),
  encodeG711U: vi.fn(),
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
      aiDenoisingConfig: {
        mode: AIDenoiserProcessorMode.NSNG,
        level: AIDenoiserProcessorLevel.SOFT,
      },
      debug: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('start', () => {
    it('should initialize audio track and processors correctly', async () => {
      await recorder.start();
      expect(recorder['audioTrack']).toBeDefined();
    });

    it('should use custom audio track when mediaStreamTrack is provided', async () => {
      const mockMediaStreamTrack = new window.MediaStreamTrack();
      const customRecorder = new PcmRecorder({
        mediaStreamTrack: mockMediaStreamTrack,
      });

      await customRecorder.start();
      expect(customRecorder['audioTrack']).toBeDefined();
    });

    it('should use custom audio track when mediaStreamTrack is function ', async () => {
      const mockMediaStreamTrack = new window.MediaStreamTrack();
      const customRecorder = new PcmRecorder({
        mediaStreamTrack: () => Promise.resolve(mockMediaStreamTrack),
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
      await expect(async () => {
        await recorder.record();
      }).rejects.toThrow('audioTrack is not initialized');
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
      expect(recorder.getDenoiserEnabled()).toBe(true);
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
      // According to the implementation, the sample rate is fixed at 48000
      expect(recorder.getSampleRate()).toBe(48000);
    });

    it('should handle dump request', async () => {
      await recorder.start();
      recorder.dump();
      expect(mockDenoiser.createProcessor().dump).toHaveBeenCalled();
    });

    it('should not dump when processor is not initialized', () => {
      // Create a recorder with processor unavailable
      const customRecorder = new PcmRecorder({
        aiDenoisingConfig: { mode: undefined },
      });

      // Set up a spy on the log method
      const logSpy = vi.spyOn(customRecorder as any, 'log');

      customRecorder.dump();
      expect(logSpy).toHaveBeenCalledWith('processor is not initialized');
    });
  });

  describe('Debug and Error Handling', () => {
    it('should log messages when debug is enabled', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Create recorder with debug enabled
      const debugRecorder = new PcmRecorder({ debug: true });

      // Trigger log and warn methods with private access
      (debugRecorder as any).log('test log');
      (debugRecorder as any).warn('test warning');

      expect(logSpy).toHaveBeenCalledWith('test log');
      expect(warnSpy).toHaveBeenCalledWith('test warning');
    });

    it('should not log messages when debug is disabled', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Create recorder with debug disabled
      const debugRecorder = new PcmRecorder({ debug: false });

      // Trigger log and warn methods with private access
      (debugRecorder as any).log('test log');
      (debugRecorder as any).warn('test warning');

      expect(logSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('should handle warn message when trying to pause while not recording', async () => {
      const warnSpy = vi.spyOn(recorder as any, 'warn');

      // Recorder should not be recording at this point
      recorder.pause();

      expect(warnSpy).toHaveBeenCalledWith('error: recorder is not recording');
    });

    it('should handle warn message when trying to resume while already recording', async () => {
      const warnSpy = vi.spyOn(recorder as any, 'warn');

      await recorder.start();
      await recorder.record(); // Now recording

      recorder.resume(); // Try to resume while already recording

      expect(warnSpy).toHaveBeenCalledWith('recorder is recording');
    });
  });

  describe('isSupportAIDenoiser and checkProcessor', () => {
    it('should check if AI denoiser is supported', () => {
      // Create a recorder with AI mode enabled
      const aiEnabledRecorder = new PcmRecorder({
        aiDenoisingConfig: { mode: AIDenoiserProcessorMode.NSNG },
      });

      // Access the private method using type assertion
      const supportResult = (aiEnabledRecorder as any).isSupportAIDenoiser();
      expect(supportResult).toBe(true);

      // Create a recorder with AI mode disabled
      const aiDisabledRecorder = new PcmRecorder({
        aiDenoisingConfig: { mode: undefined },
      });

      // The method returns undefined if the mode is not set, so explicitly check for falsy
      expect(Boolean((aiDisabledRecorder as any).isSupportAIDenoiser())).toBe(
        false,
      );
    });

    it('should check if processor is initialized', async () => {
      // Test with a processor that is initialized
      await recorder.start();
      await recorder.record();
      expect((recorder as any).checkProcessor()).toBe(true);

      // Test with a processor that is not initialized
      const newRecorder = new PcmRecorder({});
      expect((newRecorder as any).checkProcessor()).toBe(false);
    });
  });
});
