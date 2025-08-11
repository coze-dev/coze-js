import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { PcmRecorder, RecordingStatus } from '../pcm-recorder';

// 声明全局 system 对象
declare global {
  var system: {
    record: {
      start: any;
      stop: any;
      onframerecorded: any;
      pause?: any;
      resume?: any;
    };
  };
}

describe('PcmRecorder', () => {
  let recorder: PcmRecorder;
  const mockConfig = {
    sampleRate: 16000,
    encoding: 'pcm',
    format: 'pcm',
    channels: 1,
  };

  // 模拟录音机实例 (system.record API)
  const mockRecorderInstance = {
    start: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    onframerecorded: null,
  };

  beforeEach(() => {
    // 重置模拟
    vi.clearAllMocks();

    // 确保 global.system.record 存在
    if (!global.system) {
      global.system = { record: mockRecorderInstance };
    } else {
      global.system.record = mockRecorderInstance;
    }

    // 创建新的录音机实例
    recorder = new PcmRecorder(mockConfig);
  });

  afterEach(() => {
    if (recorder) {
      recorder.destroy();
    }
  });

  it('should initialize with correct config and status', () => {
    // 验证配置对象
    expect(recorder.config).toEqual({
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      debug: false,
    });
    expect(recorder.getStatus()).toBe(RecordingStatus.INACTIVE);
  });

  it('should start recording', () => {
    const onDataCallback = vi.fn();
    recorder.onData(onDataCallback);
    recorder.start();

    expect(mockRecorderInstance.start).toHaveBeenCalled();
    expect(recorder.getStatus()).toBe(RecordingStatus.RECORDING);

    // 模拟录音数据回调 - 使用 system.record 的 onframerecorded
    const mockData = new ArrayBuffer(16);
    mockRecorderInstance.onframerecorded &&
      mockRecorderInstance.onframerecorded({
        frameBuffer: mockData,
        isLastFrame: false,
      });

    // 在PcmRecorder实现中，onDataCallback接收的是frameBuffer
    expect(onDataCallback).toHaveBeenCalledWith(mockData);
  });

  it('should stop recording', () => {
    recorder.start();
    recorder.stop();

    expect(mockRecorderInstance.stop).toHaveBeenCalled();
    expect(recorder.getStatus()).toBe(RecordingStatus.INACTIVE);
  });

  it('should pause recording', () => {
    recorder.start();
    recorder.pause();

    // system.record 不支持 pause，所以调用 stop
    expect(mockRecorderInstance.stop).toHaveBeenCalled();
    expect(recorder.getStatus()).toBe(RecordingStatus.PAUSED);
  });

  it('should resume recording', () => {
    recorder.start();
    recorder.pause();

    // 重置 mock 以便验证 resume 时的 start 调用
    vi.clearAllMocks();
    recorder.resume();

    // system.record 不支持 resume，所以重新调用 start
    expect(mockRecorderInstance.start).toHaveBeenCalled();
    expect(recorder.getStatus()).toBe(RecordingStatus.RECORDING);
  });

  it('should handle errors', () => {
    const onErrorCallback = vi.fn();
    recorder.onError(onErrorCallback);

    // 模拟 start 方法的 fail 回调
    const mockStart = vi.fn(options => {
      if (options.fail) {
        options.fail('test error', 500);
      }
    });
    mockRecorderInstance.start = mockStart;

    recorder.start();

    // 验证错误回调被调用，并且参数是Error对象
    expect(onErrorCallback).toHaveBeenCalled();
    const callArg = onErrorCallback.mock.calls[0][0];
    expect(callArg).toBeInstanceOf(Error);
    expect(callArg.message).toBe('Recording failed: test error (code: 500)');
  });

  it('should clean up resources on destroy', () => {
    const onDataCallback = vi.fn();
    const onErrorCallback = vi.fn();

    recorder.onData(onDataCallback);
    recorder.onError(onErrorCallback);

    // 使用一个不会触发错误的 mock
    const mockStart = vi.fn();
    mockRecorderInstance.start = mockStart;

    recorder.start();
    recorder.destroy();

    expect(mockRecorderInstance.stop).toHaveBeenCalled();
    expect(recorder.getStatus()).toBe(RecordingStatus.INACTIVE);

    // 确保回调被清除 - 使用 system.record 的 onframerecorded
    mockRecorderInstance.onframerecorded &&
      mockRecorderInstance.onframerecorded({
        frameBuffer: new ArrayBuffer(16),
        isLastFrame: false,
      });

    expect(onDataCallback).not.toHaveBeenCalled();
    expect(onErrorCallback).not.toHaveBeenCalled();
  });
});
