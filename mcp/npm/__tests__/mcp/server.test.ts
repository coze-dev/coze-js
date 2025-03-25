import { describe, it, expect, vi, beforeEach } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { logger } from '../../src/utils/logger';
import { createServer } from '../../src/mcp/server';
import { searchNpmPackages } from '../../src/mcp/search';
import { fetchNpmPackages } from '../../src/mcp/fetch';

// 模拟依赖
vi.mock('@modelcontextprotocol/sdk/server/mcp.js', () => ({
  McpServer: vi.fn().mockImplementation(() => ({
    tool: vi.fn(),
  })),
}));

vi.mock('../../src/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../src/mcp/search', () => ({
  searchNpmPackages: {
    name: 'searchNpmPackages',
    description: 'Search for NPM packages',
    schema: { shape: {} },
    execute: vi.fn(),
  },
}));

vi.mock('../../src/mcp/fetch', () => ({
  fetchNpmPackages: {
    name: 'fetchNpmPackages',
    description: 'Fetch NPM package info',
    schema: { shape: {} },
    execute: vi.fn(),
  },
}));

describe('MCP Server 测试', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('创建服务器应该设置正确的名称和描述', () => {
    createServer();

    // 验证 McpServer 构造函数被调用时传入了正确的参数
    expect(McpServer).toHaveBeenCalledWith({
      name: 'npm-mcp',
      description: expect.stringContaining('NPM MCP Server'),
      version: '1.0.0',
    });

    // 验证日志调用
    expect(logger.debug).toHaveBeenCalledWith('Creating MCP server: npm-mcp');
  });

  it('应该注册所有工具', () => {
    const server = createServer();

    // 验证 tool 方法为每个工具被调用
    expect(server.tool).toHaveBeenCalledTimes(2);

    // 验证为 fetchNpmPackages 调用了 tool 方法
    expect(server.tool).toHaveBeenCalledWith(
      fetchNpmPackages.name,
      fetchNpmPackages.description,
      fetchNpmPackages.schema.shape,
      fetchNpmPackages.execute,
    );

    // 验证为 searchNpmPackages 调用了 tool 方法
    expect(server.tool).toHaveBeenCalledWith(
      searchNpmPackages.name,
      searchNpmPackages.description,
      searchNpmPackages.schema.shape,
      searchNpmPackages.execute,
    );
  });

  it('应该返回创建好的服务器实例', () => {
    const result = createServer();
    expect(result).toBeDefined();
    expect(result).toHaveProperty('tool');
  });
});
