import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

import { logger } from '../../src/utils/logger';
import { searchNpmPackages } from '../../src/mcp/search';

// 模拟axios
vi.mock('axios');

const mockGet = vi.fn();
axios.get = mockGet;

// 模拟 logger
vi.mock('../../src/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    debug: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('searchNpmPackages 功能测试', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('正确处理搜索请求并返回结果', async () => {
    // 模拟搜索响应数据
    const mockSearchResponse = {
      data: {
        objects: [
          {
            package: {
              name: 'test-package',
              version: '1.0.0',
              description: 'A test package',
              keywords: ['test', 'package'],
              author: { name: 'Test Author', email: 'test@example.com' },
              publisher: { username: 'testuser', email: 'test@example.com' },
              date: '2023-01-01',
            },
            score: {
              final: 0.8,
              detail: {
                quality: 0.9,
                popularity: 0.7,
                maintenance: 0.8,
              },
            },
            searchScore: 0.85,
          },
        ],
        total: 1,
        time: '100ms',
      },
    };

    // 设置 axios 模拟返回值
    mockGet.mockResolvedValueOnce(mockSearchResponse);

    // 调用函数
    const result = await searchNpmPackages.execute({
      keyword: 'test',
      size: 10,
      from: 0,
      quality: 0.5,
      popularity: 0.5,
      maintenance: 0.5,
      registry: 'https://registry.npmjs.org',
    });

    // 验证 axios 是否被正确调用
    expect(mockGet).toHaveBeenCalledWith(
      'https://registry.npmjs.org/-/v1/search',
      {
        params: {
          text: 'test',
          size: 10,
          from: 0,
          quality: 0.5,
          popularity: 0.5,
          maintenance: 0.5,
        },
      },
    );

    // 验证返回结果
    expect(result).toHaveProperty('content');
    expect(result.content[0].type).toBe('text');

    // 解析并验证返回的JSON内容
    const parsedContent = JSON.parse(result.content[0].text);
    expect(parsedContent).toHaveLength(1);
    expect(parsedContent[0].package.name).toBe('test-package');
    expect(parsedContent[0].score.final).toBe(0.8);
    expect(parsedContent[0].searchScore).toBe(0.85);

    // 验证日志是否被正确调用
    expect(logger.info).toHaveBeenCalled();
    expect(logger.debug).toHaveBeenCalled();
    expect(logger.success).toHaveBeenCalled();
  });

  it('正确处理自定义 registry', async () => {
    // 设置 axios 模拟返回空结果
    mockGet.mockResolvedValueOnce({
      data: {
        objects: [],
        total: 0,
        time: '50ms',
      },
    });

    // 使用自定义 registry
    await searchNpmPackages.execute({
      keyword: 'test',
      registry: 'https://registry.npmmirror.com',
    });

    // 验证 axios 调用时使用了自定义 registry
    expect(mockGet).toHaveBeenCalledWith(
      'https://registry.npmmirror.com/-/v1/search',
      expect.any(Object),
    );
  });

  it('处理 registry 末尾的斜杠', async () => {
    // 设置 axios 模拟返回空结果
    mockGet.mockResolvedValueOnce({
      data: {
        objects: [],
        total: 0,
        time: '50ms',
      },
    });

    // 使用带有末尾斜杠的 registry
    await searchNpmPackages.execute({
      keyword: 'test',
      registry: 'https://registry.npmjs.org/',
    });

    // 验证 axios 调用时正确处理了末尾斜杠
    expect(mockGet).toHaveBeenCalledWith(
      'https://registry.npmjs.org/-/v1/search',
      expect.any(Object),
    );
  });

  it('正确处理请求错误', async () => {
    // 模拟 axios 抛出错误
    const errorMessage = 'Network Error';
    mockGet.mockRejectedValueOnce(new Error(errorMessage));

    // 调用函数
    const result = await searchNpmPackages.execute({
      keyword: 'test',
      registry: 'https://registry.npmjs.org',
    });

    // 验证错误处理
    expect(logger.error).toHaveBeenCalled();
    expect(result.content[0].text).toContain('Error Searching NPM Packages');
    expect(result.content[0].text).toContain(errorMessage);
  });

  it('结果映射处理包信息正确', async () => {
    // 模拟包含多个结果的响应
    const mockMultipleResults = {
      data: {
        objects: [
          {
            package: {
              name: 'package1',
              version: '1.0.0',
              description: 'First package',
              keywords: ['first'],
              author: { name: 'Author 1' },
              publisher: { username: 'user1' },
              date: '2023-01-01',
            },
            score: { final: 0.9, detail: {} },
            searchScore: 0.9,
          },
          {
            package: {
              name: 'package2',
              version: '2.0.0',
              description: 'Second package',
              keywords: ['second'],
              author: { name: 'Author 2' },
              publisher: { username: 'user2' },
              date: '2023-02-01',
            },
            score: { final: 0.8, detail: {} },
            searchScore: 0.8,
          },
        ],
        total: 2,
        time: '150ms',
      },
    };

    // 设置 axios 模拟返回值
    mockGet.mockResolvedValueOnce(mockMultipleResults);

    // 调用函数
    const result = await searchNpmPackages.execute({
      keyword: 'test',
      registry: 'https://registry.npmjs.org',
    });

    // 解析返回结果
    const parsedContent = JSON.parse(result.content[0].text);

    // 验证结果包含两个包
    expect(parsedContent).toHaveLength(2);

    // 验证第一个包信息
    expect(parsedContent[0].package.name).toBe('package1');
    expect(parsedContent[0].package.version).toBe('1.0.0');
    expect(parsedContent[0].package.description).toBe('First package');

    // 验证第二个包信息
    expect(parsedContent[1].package.name).toBe('package2');
    expect(parsedContent[1].package.version).toBe('2.0.0');
    expect(parsedContent[1].package.description).toBe('Second package');
  });
});
