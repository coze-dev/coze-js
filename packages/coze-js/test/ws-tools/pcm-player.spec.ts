/* eslint-disable */
/// <reference types="vitest" />
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import PcmPlayer from '../../src/ws-tools/pcm-player';
import { WavStreamPlayer } from '../../src/ws-tools/wavtools';

// Mock WavStreamPlayer
vi.mock('../../src/ws-tools/wavtools', () => ({
  WavStreamPlayer: vi.fn().mockImplementation(() => ({
    add16BitPCM: vi.fn().mockResolvedValue(true),
    interrupt: vi.fn().mockResolvedValue(true),
    pause: vi.fn().mockResolvedValue(true),
    resume: vi.fn().mockResolvedValue(true),
    isPlaying: vi.fn(),
  })),
}));

// Mock uuid
vi.mock('uuid', () => ({
  v4: vi.fn().mockReturnValue('test-uuid'),
}));

describe('PcmPlayer', () => {
  let player: PcmPlayer;
  let mockOnCompleted: Mock;
  let mockWavStreamPlayer: {
    add16BitPCM: Mock;
    interrupt: Mock;
    pause: Mock;
    resume: Mock;
    isPlaying: Mock;
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    mockOnCompleted = vi.fn();
    player = new PcmPlayer({ onCompleted: mockOnCompleted });

    // Get the mock WavStreamPlayer instance
    mockWavStreamPlayer = (WavStreamPlayer as unknown as Mock).mock.results[0]
      .value;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      expect(WavStreamPlayer).toHaveBeenCalledWith({ sampleRate: 24000 });
      expect(player['onCompleted']).toBe(mockOnCompleted);
      expect(player['isPauseDefault']).toBe(false);
    });

    it('should initialize with isPauseDefault true', () => {
      const pausePlayer = new PcmPlayer({
        onCompleted: mockOnCompleted,
        isPauseDefault: true,
      });
      expect(pausePlayer['isPauseDefault']).toBe(true);
    });
  });

  describe('init', () => {
    it('should initialize player with a new track ID', () => {
      player.init();
      expect(player['trackId']).toBe('my-track-id-test-uuid');
      expect(player['totalDuration']).toBe(0);
      expect(player['playbackStartTime']).toBeNull();
      expect(mockWavStreamPlayer.add16BitPCM).toHaveBeenCalledWith(
        new ArrayBuffer(0),
        'my-track-id-test-uuid',
      );
    });

    it('should clear existing timeout if present', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      player['playbackTimeout'] = setTimeout(() => {}, 1000) as any;

      player.init();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      expect(player['playbackTimeout']).toBeNull();
    });

    it('should pause player if isPauseDefault is true', () => {
      const pausePlayer = new PcmPlayer({
        onCompleted: mockOnCompleted,
        isPauseDefault: true,
      });
      const pauseSpy = vi.spyOn(pausePlayer, 'pause');

      pausePlayer.init();

      expect(pauseSpy).toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('should clear timeout and interrupt WavStreamPlayer', async () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      player['playbackTimeout'] = setTimeout(() => {}, 1000) as any;

      await player.destroy();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      expect(mockWavStreamPlayer.interrupt).toHaveBeenCalled();
    });
  });

  describe('complete', () => {
    it('should set timeout for onCompleted callback', () => {
      player['playbackStartTime'] = Date.now();
      player['totalDuration'] = 5; // 5 seconds
      player['elapsedBeforePause'] = 1; // 1 second already passed

      player['complete']();

      expect(player['playbackTimeout']).not.toBeNull();

      // Advance time to trigger the callback
      vi.advanceTimersByTime(4000); // (5 - 1) * 1000

      expect(mockOnCompleted).toHaveBeenCalled();
      expect(player['playbackStartTime']).toBeNull();
      expect(player['elapsedBeforePause']).toBe(0);
    });

    it('should not set timeout if playbackStartTime is null', () => {
      player['playbackStartTime'] = null;

      player['complete']();

      expect(player['playbackTimeout']).toBeNull();
      expect(mockOnCompleted).not.toHaveBeenCalled();
    });
  });

  describe('interrupt', () => {
    it('should destroy player and call onCompleted', async () => {
      const destroySpy = vi.spyOn(player, 'destroy');

      await player.interrupt();

      expect(destroySpy).toHaveBeenCalled();
      expect(mockOnCompleted).toHaveBeenCalled();
    });
  });

  describe('pause', () => {
    it('should pause playback and save elapsed time', async () => {
      const now = Date.now();
      player['playbackStartTime'] = now - 2000; // Started 2 seconds ago
      player['playbackPauseTime'] = null;
      player['playbackTimeout'] = setTimeout(() => {}, 1000) as any;

      vi.setSystemTime(now);

      await player.pause();

      expect(mockWavStreamPlayer.pause).toHaveBeenCalled();
      expect(player['playbackPauseTime']).toBe(now);
      expect(player['elapsedBeforePause']).toBe(2);
    });

    it('should not update elapsed time if already paused', async () => {
      player['playbackStartTime'] = Date.now() - 2000;
      player['playbackPauseTime'] = Date.now() - 1000;
      player['elapsedBeforePause'] = 1;

      await player.pause();

      expect(mockWavStreamPlayer.pause).toHaveBeenCalled();
      expect(player['elapsedBeforePause']).toBe(1); // Should not change
    });

    it('should clear timeout if exists', async () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      player['playbackTimeout'] = setTimeout(() => {}, 1000) as any;

      await player.pause();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      expect(player['playbackTimeout']).toBeNull();
    });
  });

  describe('resume', () => {
    it('should resume playback and update timeout', async () => {
      const now = Date.now();
      vi.setSystemTime(now);

      player['playbackPauseTime'] = now - 1000;
      player['totalDuration'] = 10;
      player['elapsedBeforePause'] = 3;

      await player.resume();

      expect(mockWavStreamPlayer.resume).toHaveBeenCalled();
      expect(player['playbackStartTime']).toBe(now);
      expect(player['playbackPauseTime']).toBeNull();

      // Check if timeout is set with correct duration
      expect(player['playbackTimeout']).not.toBeNull();

      // Advance time to trigger the callback (10 - 3 seconds remaining)
      vi.advanceTimersByTime(7000);

      expect(mockOnCompleted).toHaveBeenCalled();
      expect(player['playbackStartTime']).toBeNull();
      expect(player['elapsedBeforePause']).toBe(0);
    });

    it('should not update anything if playbackPauseTime is null', async () => {
      player['playbackPauseTime'] = null;

      await player.resume();

      expect(mockWavStreamPlayer.resume).toHaveBeenCalled();
      expect(player['playbackStartTime']).toBeNull();
      expect(player['playbackTimeout']).toBeNull();
    });
  });

  describe('togglePlay', () => {
    it('should pause if currently playing', async () => {
      mockWavStreamPlayer.isPlaying.mockReturnValue(true);
      const pauseSpy = vi.spyOn(player, 'pause');

      await player.togglePlay();

      expect(pauseSpy).toHaveBeenCalled();
    });

    it('should resume if not currently playing', async () => {
      mockWavStreamPlayer.isPlaying.mockReturnValue(false);
      const resumeSpy = vi.spyOn(player, 'resume');

      await player.togglePlay();

      expect(resumeSpy).toHaveBeenCalled();
    });
  });

  describe('isPlaying', () => {
    it('should return the value from WavStreamPlayer.isPlaying', () => {
      mockWavStreamPlayer.isPlaying.mockReturnValue(true);
      expect(player.isPlaying()).toBe(true);

      mockWavStreamPlayer.isPlaying.mockReturnValue(false);
      expect(player.isPlaying()).toBe(false);
    });
  });

  describe('append', () => {
    beforeEach(() => {
      // Initialize player
      player.init();
      vi.clearAllMocks();
    });

    it('should decode base64 and add PCM data to WavStreamPlayer', async () => {
      const base64Message = 'AQIDBA=='; // [1, 2, 3, 4] in base64
      const now = Date.now();
      vi.setSystemTime(now);

      await player.append(base64Message);

      // Verify add16BitPCM was called
      expect(mockWavStreamPlayer.add16BitPCM).toHaveBeenCalledWith(
        expect.any(ArrayBuffer),
        player['trackId'],
      );

      // Verify tracking values were updated
      expect(player['totalDuration']).toBeGreaterThan(0);
      expect(player['playbackStartTime']).toBe(now);
      expect(player['elapsedBeforePause']).toBe(0);
    });

    it('should not update playbackStartTime if already set', async () => {
      const startTime = Date.now() - 1000;
      player['playbackStartTime'] = startTime;

      await player.append('AQIDBA==');

      expect(player['playbackStartTime']).toBe(startTime);
    });

    it('should not update playbackStartTime if paused', async () => {
      player['playbackStartTime'] = null;
      player['playbackPauseTime'] = Date.now();

      await player.append('AQIDBA==');

      expect(player['playbackStartTime']).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockWavStreamPlayer.add16BitPCM.mockRejectedValue(
        new Error('Test error'),
      );

      await player.append('AQIDBA==');

      expect(consoleSpy).toHaveBeenCalledWith(
        '[pcm player] error',
        expect.any(Error),
      );
    });
  });
});
