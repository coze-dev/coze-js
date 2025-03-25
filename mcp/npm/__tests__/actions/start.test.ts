import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { logger } from '../../src/utils/logger';
import { createServer } from '../../src/mcp/server';
import { startAction } from '../../src/actions/start';

// 模拟依赖模块
vi.mock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: vi.fn().mockImplementation(() => ({
    // 空对象即可
  })),
}));

vi.mock('../../src/mcp/server', () => ({
  createServer: vi.fn().mockImplementation(() => ({
    connect: vi.fn(),
  })),
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

describe('startAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // 模拟process.on方法
    vi.spyOn(process, 'on').mockImplementation((event, callback) => {
      // 立即调用回调，用于测试
      if (event === 'SIGINT') {
        setTimeout(() => {
          callback();
        }, 100);
      }
      return process;
    });

    // 模拟process.exit
    vi.spyOn(process, 'exit').mockImplementation(vi.fn() as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('应该创建并连接到MCP服务器', async () => {
    await startAction();

    // 验证创建了服务器
    expect(createServer).toHaveBeenCalledWith();

    // 验证创建了StdioServerTransport
    expect(StdioServerTransport).toHaveBeenCalled();

    // 验证连接了传输
    const mockServer = vi.mocked(createServer).mock.results[0].value;
    expect(mockServer.connect).toHaveBeenCalled();
  });

  it('应该处理错误情况', async () => {
    // 模拟createServer抛出错误
    const mockError = new Error('测试错误');
    vi.mocked(createServer).mockImplementationOnce(() => {
      throw mockError;
    });

    await startAction();

    // 验证错误处理
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('测试错误'),
    );
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
