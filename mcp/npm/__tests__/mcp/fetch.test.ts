import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

import { logger } from '../../src/utils/logger';
import { fetchNpmPackages } from '../../src/mcp/fetch';

// 模拟 axios
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

describe('fetchNpmPackages 功能测试', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('正确获取单个包的信息', async () => {
    // 模拟包的响应数据
    const mockReactPackageInfo = {
      data: {
        name: 'react',
        description:
          'React is a JavaScript library for building user interfaces.',
        'dist-tags': {
          latest: '18.2.0',
          next: '18.3.0',
        },
        versions: {
          '18.2.0': {
            name: 'react',
            version: '18.2.0',
            description:
              'React is a JavaScript library for building user interfaces.',
            author: { name: 'React Team' },
            dist: {
              tarball: 'https://registry.npmjs.org/react/-/react-18.2.0.tgz',
              shasum: '123456',
            },
          },
          '18.3.0': {
            name: 'react',
            version: '18.3.0',
            description:
              'React is a JavaScript library for building user interfaces.',
            author: { name: 'React Team' },
            dist: {
              tarball: 'https://registry.npmjs.org/react/-/react-18.3.0.tgz',
              shasum: '654321',
            },
          },
        },
        license: 'MIT',
        author: { name: 'React Team' },
        homepage: 'https://reactjs.org/',
        keywords: ['react', 'frontend'],
        repository: {
          type: 'git',
          url: 'git+https://github.com/facebook/react.git',
        },
        time: {
          '18.2.0': '2022-06-14T00:00:00.000Z',
          '18.3.0': '2023-01-01T00:00:00.000Z',
        },
        bugs: {
          url: 'https://github.com/facebook/react/issues',
        },
        contributors: [{ name: 'Contributor 1' }],
        maintainers: [{ name: 'Maintainer 1' }],
      },
    };

    // 设置 axios 模拟返回值
    mockGet.mockResolvedValueOnce(mockReactPackageInfo);

    // 调用函数
    const result = await fetchNpmPackages.execute({
      packageNames: ['react'],
      registry: 'https://registry.npmjs.org',
    });

    // 验证 axios 是否被正确调用
    expect(mockGet).toHaveBeenCalledWith('https://registry.npmjs.org/react');

    // 验证返回结果
    expect(result).toHaveProperty('content');
    expect(result.content[0].type).toBe('text');

    // 解析并验证返回的JSON内容
    const parsedContent = JSON.parse(result.content[0].text);
    expect(parsedContent).toHaveLength(1);
    expect(parsedContent[0].name).toBe('react');
    expect(parsedContent[0].license).toBe('MIT');
    expect(parsedContent[0].latest.version).toBe('18.2.0');
    expect(parsedContent[0].distTags.latest).toBe('18.2.0');
    expect(parsedContent[0].distTags.next).toBe('18.3.0');

    // 验证日志是否被正确调用
    expect(logger.info).toHaveBeenCalled();
    expect(logger.success).toHaveBeenCalled();
  });

  it('正确处理多个包的并发请求', async () => {
    // 模拟多个包的响应数据
    const mockReactPackageInfo = {
      data: {
        name: 'react',
        'dist-tags': { latest: '18.2.0' },
        versions: {
          '18.2.0': {
            name: 'react',
            version: '18.2.0',
            dist: {},
          },
        },
        license: 'MIT',
      },
    };

    const mockVuePackageInfo = {
      data: {
        name: 'vue',
        'dist-tags': { latest: '3.3.4' },
        versions: {
          '3.3.4': {
            name: 'vue',
            version: '3.3.4',
            dist: {},
          },
        },
        license: 'MIT',
      },
    };

    // 设置 axios 模拟返回值，按顺序返回不同的结果
    mockGet.mockResolvedValueOnce(mockReactPackageInfo);
    mockGet.mockResolvedValueOnce(mockVuePackageInfo);

    // 调用函数
    const result = await fetchNpmPackages.execute({
      packageNames: ['react', 'vue'],
      registry: 'https://registry.npmjs.org',
    });

    // 验证 axios 被调用了两次
    expect(mockGet).toHaveBeenCalledTimes(2);
    expect(mockGet).toHaveBeenCalledWith('https://registry.npmjs.org/react');
    expect(mockGet).toHaveBeenCalledWith('https://registry.npmjs.org/vue');

    // 解析返回结果
    const parsedContent = JSON.parse(result.content[0].text);

    // 验证结果包含两个包
    expect(parsedContent).toHaveLength(2);

    // 验证第一个包信息
    expect(parsedContent[0].name).toBe('react');
    expect(parsedContent[0].latest.version).toBe('18.2.0');

    // 验证第二个包信息
    expect(parsedContent[1].name).toBe('vue');
    expect(parsedContent[1].latest.version).toBe('3.3.4');
  });

  it('正确处理包不存在的情况', async () => {
    // 模拟 404 错误
    const notFoundError = new Error('Request failed with status code 404');
    (notFoundError as any).response = { status: 404 };

    // 设置 axios 模拟抛出 404 错误
    mockGet.mockRejectedValueOnce(notFoundError);

    // 调用函数
    const result = await fetchNpmPackages.execute({
      packageNames: ['non-existent-package'],
      registry: 'https://registry.npmjs.org',
    });

    // 验证返回结果
    const parsedContent = JSON.parse(result.content[0].text);
    expect(parsedContent).toHaveLength(1);
    expect(parsedContent[0].success).toBe(false);
    expect(parsedContent[0].message).toBe(
      'Request failed with status code 404',
    );

    // 验证错误日志被调用
    expect(logger.error).toHaveBeenCalled();
  });

  it('正确处理混合存在和不存在的包', async () => {
    // 模拟正常包响应
    const mockPackageInfo = {
      data: {
        name: 'lodash',
        'dist-tags': { latest: '4.17.21' },
        versions: {
          '4.17.21': {
            name: 'lodash',
            version: '4.17.21',
            dist: {},
          },
        },
        license: 'MIT',
      },
    };

    // 模拟 404 错误
    const notFoundError = new Error('Request failed with status code 404');
    (notFoundError as any).response = { status: 404 };

    // 设置 axios 模拟一个成功一个失败
    mockGet.mockResolvedValueOnce(mockPackageInfo);
    mockGet.mockRejectedValueOnce(notFoundError);

    // 调用函数
    const result = await fetchNpmPackages.execute({
      packageNames: ['lodash', 'non-existent-package'],
      registry: 'https://registry.npmjs.org',
    });

    // 解析返回结果
    const parsedContent = JSON.parse(result.content[0].text);

    // 验证结果包含两个包
    expect(parsedContent).toHaveLength(2);

    // 验证第一个包信息
    expect(parsedContent[0].name).toBe('lodash');
    expect(parsedContent[0].latest.version).toBe('4.17.21');

    // 验证第二个包信息（不存在的包）
    expect(parsedContent[1].success).toBe(false);
    expect(parsedContent[1].message).toBe(
      'Request failed with status code 404',
    );
  });

  it('正确处理自定义 registry', async () => {
    // 模拟包响应
    const mockPackageInfo = {
      data: {
        name: 'express',
        'dist-tags': { latest: '4.18.2' },
        versions: {
          '4.18.2': {
            name: 'express',
            version: '4.18.2',
            dist: {},
          },
        },
        license: 'MIT',
      },
    };

    // 设置 axios 模拟返回值
    mockGet.mockResolvedValueOnce(mockPackageInfo);

    // 调用函数，使用自定义 registry
    await fetchNpmPackages.execute({
      packageNames: ['express'],
      registry: 'https://registry.npmmirror.com',
    });

    // 验证 axios 调用使用了自定义 registry
    expect(mockGet).toHaveBeenCalledWith(
      'https://registry.npmmirror.com/express',
    );
  });

  it('正确处理网络错误', async () => {
    // 模拟网络错误
    const networkError = new Error('Network Error');

    // 设置 axios 模拟网络错误
    mockGet.mockRejectedValueOnce(networkError);

    // 调用函数
    const result = await fetchNpmPackages.execute({
      packageNames: ['react'],
      registry: 'https://registry.npmjs.org',
    });

    // 验证返回结果
    const parsedContent = JSON.parse(result.content[0].text);
    expect(parsedContent).toHaveLength(1);
    expect(parsedContent[0].success).toBe(false);
    expect(parsedContent[0].message).toBe('Network Error');

    // 验证错误日志被调用
    expect(logger.error).toHaveBeenCalled();
  });
});
