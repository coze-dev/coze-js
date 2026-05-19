/**
 * Vitest 测试设置文件
 * 用于配置全局测试环境
 */
import { vi } from 'vitest';

// 模拟 Quick App 全局对象
global.system = {};

// 模拟 @system.audio
const audioMock = {
  getRecorder: vi.fn().mockReturnValue({
    start: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    prepare: vi.fn(),
    release: vi.fn(),
    ondata: null,
    onerror: null,
  }),
  getPlayer: vi.fn().mockReturnValue({
    src: '',
    play: vi.fn(),
    pause: vi.fn(),
    stop: vi.fn(),
    onprepared: null,
    onplay: null,
    onpause: null,
    onstop: null,
    onerror: null,
  }),
};

global.system.audio = audioMock;

// 模拟 @system.record
const recordMock = {
  start: vi.fn(),
  stop: vi.fn(),
  onframerecorded: null,
};

global.system.record = recordMock;

// 模拟 require 函数
global.require = vi.fn(module => {
  if (module === '@system.audio') {
    return audioMock;
  }
  if (module === '@system.record') {
    return recordMock;
  }
  throw new Error(`Module ${module} not mocked`);
});

// 在测试环境中模拟 require('@system.audio') 和 require('@system.record')
const originalRequire = typeof require !== 'undefined' ? require : null;
if (originalRequire && typeof originalRequire === 'function') {
  global.require = function (id) {
    if (id === '@system.audio') {
      return audioMock;
    }
    if (id === '@system.record') {
      return recordMock;
    }
    return originalRequire(id);
  };
}

// 模拟 @system.websocket
global.system.websocket = {
  create: () => ({
    connect: vi.fn(),
    send: vi.fn(),
    close: vi.fn(),
    onopen: vi.fn(),
    onmessage: vi.fn(),
    onerror: vi.fn(),
    onclose: vi.fn(),
  }),
};

// 模拟 @system.buffer
global.system.buffer = {
  from: vi.fn(() => ({ data: new ArrayBuffer(0) })),
  toString: vi.fn(() => ''),
};

// 模拟 @system.file
global.system.file = {
  writeText: vi.fn(),
  readText: vi.fn(),
  delete: vi.fn(),
  mkdir: vi.fn(),
};
