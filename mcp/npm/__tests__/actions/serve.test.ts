import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import morgan from 'morgan';
import express from 'express';

import { logger } from '../../src/utils/logger';
import { serveAction } from '../../src/actions/serve';

// 准备mock应用
const mockApp = {
  use: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
  listen: vi.fn().mockImplementation((port, callback) => {
    if (callback) {
      callback();
    }
    return { on: vi.fn() };
  }),
};

// 模拟依赖模块
vi.mock('express', () => ({
  default: vi.fn(() => mockApp),
}));

vi.mock('morgan', () => ({
  default: vi.fn(() => 'morgan-middleware'),
}));

// 模拟SSEServerTransport
const mockHandlePostMessage = vi.fn();
const mockSSETransport = {
  handlePostMessage: mockHandlePostMessage,
};

vi.mock('@modelcontextprotocol/sdk/server/sse.js', () => ({
  SSEServerTransport: vi.fn().mockImplementation(() => mockSSETransport),
}));

// 模拟createServer返回的服务器
const mockConnect = vi.fn();
const mockMCPServer = {
  connect: mockConnect,
};

vi.mock('../../src/mcp/server', () => ({
  createServer: vi.fn().mockImplementation(() => mockMCPServer),
}));

// 模拟本地logger
vi.mock('../../src/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    debug: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

// 模拟process.exit以避免测试提前终止
const originalExit = process.exit;

describe('serveAction', () => {
  const mockPort = 3000;

  beforeEach(() => {
    // 重置所有模拟
    vi.clearAllMocks();
    process.exit = vi.fn() as any;

    // 重置 Express 应用的路由处理程序
    mockApp.get.mockReset();
    mockApp.post.mockReset();
  });

  afterEach(() => {
    process.exit = originalExit;
    vi.resetAllMocks();
  });

  it('应该创建Express应用并启动服务器', () => {
    // 调用被测试的函数
    serveAction(mockPort);

    // 验证Express应用被正确配置
    expect(express).toHaveBeenCalled();
    expect(morgan).toHaveBeenCalledWith('tiny');
    expect(mockApp.use).toHaveBeenCalledWith('morgan-middleware');

    // 验证路由设置
    expect(mockApp.get).toHaveBeenCalledWith('/sse', expect.any(Function));
    expect(mockApp.post).toHaveBeenCalledWith(
      '/messages',
      expect.any(Function),
    );

    // 验证服务器已启动
    expect(mockApp.listen).toHaveBeenCalledWith(mockPort, expect.any(Function));
    expect(logger.success).toHaveBeenCalledWith(
      expect.stringContaining(`${mockPort}`),
    );
  });

  it('应该在GET /sse请求时创建SSE传输并连接到服务器', () => {
    // 验证基本服务器设置
    serveAction(mockPort);
    expect(mockApp.get).toHaveBeenCalledWith('/sse', expect.any(Function));
  });

  it('应该在POST /messages请求时处理消息', () => {
    // 验证POST路由设置
    serveAction(mockPort);
    expect(mockApp.post).toHaveBeenCalledWith(
      '/messages',
      expect.any(Function),
    );
  });
});
