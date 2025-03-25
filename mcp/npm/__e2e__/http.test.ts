import path from 'path';
import { type ChildProcess, spawn } from 'child_process';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

// 定义返回结果的接口
interface ToolResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

// 设置 HTTP 服务器地址和端口
const HTTP_HOST = '127.0.0.1';
const HTTP_PORT = 3200;
const HTTP_URL = `http://${HTTP_HOST}:${HTTP_PORT}/sse`;
let childProcess: ChildProcess = null;
beforeAll(async () => {
  // 启动 CLI 进程
  const cliPath = path.resolve(__dirname, '../src/cli.ts');
  childProcess = spawn('npx', [
    'tsx',
    cliPath,
    'serve',
    '--port',
    HTTP_PORT.toString(),
  ]);
  await new Promise(resolve => setTimeout(resolve, 1000));
});

afterAll(() => {
  if (childProcess) {
    childProcess.kill();
  }
});

describe('npm-mcp fetchPackages http e2e tests', () => {
  let mcpClient: Client;

  beforeAll(async () => {
    // 创建 HTTP 传输层
    const transport = new SSEClientTransport(new URL(HTTP_URL));

    mcpClient = new Client(
      {
        name: 'npm-mcp-test-client',
        version: '1.0.0',
      },
      {
        capabilities: {
          prompts: {},
          resources: {},
          tools: {},
        },
      },
    );

    await mcpClient.connect(transport);
  });

  afterAll(async () => {
    if (mcpClient) {
      await mcpClient.close();
    }
  });

  it('获取流行的 npm 包信息', async () => {
    // 调用 fetchNpmPackages 函数获取流行的包
    const result = (await mcpClient.callTool({
      name: 'fetchNpmPackages',
      arguments: {
        packageNames: ['react', 'vue'],
      },
    })) as ToolResponse;

    // 解析返回的 JSON 字符串
    const content = result.content[0].text;
    const parsedResult = JSON.parse(content);

    // 验证结果是否符合预期
    expect(parsedResult).toBeInstanceOf(Array);
    expect(parsedResult.length).toBe(2);

    // 验证 react 包信息
    const reactInfo = parsedResult.find(pkg => pkg.name === 'react');
    expect(reactInfo).toBeDefined();
    expect(reactInfo).toMatchObject({
      name: 'react',
      license: 'MIT',
    });
    expect(reactInfo.latest).toBeDefined();
    expect(reactInfo.latest.name).toBe('react');
    expect(reactInfo.latest.version).toBeDefined();
    expect(reactInfo.distTags).toBeDefined();
    expect(reactInfo.distTags.latest).toBeDefined();

    // 验证 vue 包信息
    const vueInfo = parsedResult.find(pkg => pkg.name === 'vue');
    expect(vueInfo).toBeDefined();
    expect(vueInfo).toMatchObject({
      name: 'vue',
      license: 'MIT',
    });
    expect(vueInfo.latest).toBeDefined();
    expect(vueInfo.latest.name).toBe('vue');
    expect(vueInfo.latest.version).toBeDefined();
    expect(vueInfo.distTags).toBeDefined();
    expect(vueInfo.distTags.latest).toBeDefined();
  });

  it('处理不存在的包', async () => {
    // 使用一个不可能存在的包名
    const nonExistentPackageName =
      'this-package-should-not-exist-12345678901234567890';

    // 调用 fetchNpmPackages 函数
    const result = (await mcpClient.callTool({
      name: 'fetchNpmPackages',
      arguments: {
        packageNames: [nonExistentPackageName],
      },
    })) as ToolResponse;

    // 解析返回的 JSON 字符串
    const content = result.content[0].text;
    const parsedResult = JSON.parse(content);

    // 验证结果是否符合预期
    expect(parsedResult).toBeInstanceOf(Array);
    expect(parsedResult.length).toBe(1);
    expect(parsedResult[0]).toMatchObject({
      success: false,
      message: 'Package not found',
    });
  });

  it('处理混合存在和不存在的包', async () => {
    // 使用一个存在的包和一个不存在的包
    const existingPackage = 'lodash';
    const nonExistentPackage =
      'this-package-should-not-exist-98765432109876543210';

    // 调用 fetchNpmPackages 函数
    const result = (await mcpClient.callTool({
      name: 'fetchNpmPackages',
      arguments: {
        packageNames: [existingPackage, nonExistentPackage],
      },
    })) as ToolResponse;

    // 解析返回的 JSON 字符串
    const content = result.content[0].text;
    const parsedResult = JSON.parse(content);

    // 验证结果是否符合预期
    expect(parsedResult).toBeInstanceOf(Array);
    expect(parsedResult.length).toBe(2);

    // 验证存在的包
    const lodashInfo = parsedResult.find(pkg => pkg.name === 'lodash');
    expect(lodashInfo).toBeDefined();
    expect(lodashInfo).toMatchObject({
      name: 'lodash',
      license: 'MIT',
    });
    expect(lodashInfo.latest).toBeDefined();
    expect(lodashInfo.latest.name).toBe('lodash');

    // 验证不存在的包
    const nonExistentInfo = parsedResult.find(
      pkg => typeof pkg.success !== 'undefined' && pkg.success === false,
    );
    expect(nonExistentInfo).toBeDefined();
    expect(nonExistentInfo).toMatchObject({
      success: false,
      message: 'Package not found',
    });
  });

  it('处理自定义 registry', async () => {
    // 调用 fetchNpmPackages 函数，使用中国镜像 registry
    const customRegistry = 'https://registry.npmmirror.com';
    const result = (await mcpClient.callTool({
      name: 'fetchNpmPackages',
      arguments: {
        packageNames: ['express'],
        registry: customRegistry,
      },
    })) as ToolResponse;

    // 解析返回的 JSON 字符串
    const content = result.content[0].text;
    const parsedResult = JSON.parse(content);

    // 验证结果是否符合预期
    expect(parsedResult).toBeInstanceOf(Array);
    expect(parsedResult.length).toBe(1);

    // 验证 express 包信息
    const expressInfo = parsedResult[0];
    expect(expressInfo).toBeDefined();
    expect(expressInfo).toMatchObject({
      name: 'express',
      license: 'MIT',
    });
    expect(expressInfo.latest).toBeDefined();
    expect(expressInfo.latest.name).toBe('express');
    expect(expressInfo.latest.version).toBeDefined();
    expect(expressInfo.distTags).toBeDefined();
    expect(expressInfo.distTags.latest).toBeDefined();
  });
});

describe('npm-mcp searchPackages http e2e tests', () => {
  let mcpClient: Client;

  beforeAll(async () => {
    // 创建 HTTP 传输层
    const transport = new SSEClientTransport(new URL(HTTP_URL));

    mcpClient = new Client(
      {
        name: 'npm-mcp-test-client',
        version: '1.0.0',
      },
      {
        capabilities: {
          prompts: {},
          resources: {},
          tools: {},
        },
      },
    );

    await mcpClient.connect(transport);
  });

  afterAll(async () => {
    if (mcpClient) {
      await mcpClient.close();
    }
  });

  it('基本搜索功能', async () => {
    // 使用常见的关键词进行搜索
    const result = (await mcpClient.callTool({
      name: 'searchNpmPackages',
      arguments: {
        keyword: 'react',
        size: 5, // 限制结果数量，加快测试速度
      },
    })) as ToolResponse;

    // 解析返回的 JSON 字符串
    const content = result.content[0].text;
    const parsedResult = JSON.parse(content);

    // 验证结果是否符合预期
    expect(parsedResult).toBeInstanceOf(Array);
    expect(parsedResult.length).toBeLessThanOrEqual(5);

    // 验证至少有一个结果
    expect(parsedResult.length).toBeGreaterThan(0);

    // 验证每个结果包含必要的信息
    parsedResult.forEach(item => {
      expect(item).toHaveProperty('package');
      expect(item.package).toHaveProperty('name');
      expect(item.package).toHaveProperty('version');
      expect(item).toHaveProperty('score');
      expect(item).toHaveProperty('searchScore');
    });

    // 验证搜索结果中包含关键词
    const hasReactRelatedPackage = parsedResult.some(
      item =>
        item.package.name.includes('react') ||
        (item.package.description &&
          item.package.description.includes('react')),
    );
    expect(hasReactRelatedPackage).toBe(true);
  });

  it('分页功能测试', async () => {
    // 第一页结果
    const firstPageResult = (await mcpClient.callTool({
      name: 'searchNpmPackages',
      arguments: {
        keyword: 'vue',
        size: 3,
        from: 0,
      },
    })) as ToolResponse;

    // 解析第一页结果
    const firstPageContent = firstPageResult.content[0].text;
    const firstPageParsed = JSON.parse(firstPageContent);

    // 第二页结果
    const secondPageResult = (await mcpClient.callTool({
      name: 'searchNpmPackages',
      arguments: {
        keyword: 'vue',
        size: 3,
        from: 3,
      },
    })) as ToolResponse;

    // 解析第二页结果
    const secondPageContent = secondPageResult.content[0].text;
    const secondPageParsed = JSON.parse(secondPageContent);

    // 验证两页结果不同
    expect(firstPageParsed.length).toBeLessThanOrEqual(3);
    expect(secondPageParsed.length).toBeLessThanOrEqual(3);

    // 确保两页包名不重复
    const firstPageNames = firstPageParsed.map(item => item.package.name);
    const secondPageNames = secondPageParsed.map(item => item.package.name);

    // 检查交集是否为空
    const intersection = firstPageNames.filter(name =>
      secondPageNames.includes(name),
    );
    expect(intersection.length).toBe(0);
  });

  it('质量过滤测试', async () => {
    // 使用较高的质量阈值进行搜索
    const highQualityResult = (await mcpClient.callTool({
      name: 'searchNpmPackages',
      arguments: {
        keyword: 'http client',
        size: 5,
        quality: 0.9, // 高质量阈值
        popularity: 0.8,
        maintenance: 0.8,
      },
    })) as ToolResponse;

    // 解析高质量搜索结果
    const highQualityContent = highQualityResult.content[0].text;
    const highQualityParsed = JSON.parse(highQualityContent);

    // 验证所有返回的包都有较高的质量分数
    highQualityParsed.forEach(item => {
      expect(item.score.detail.quality).toBeGreaterThanOrEqual(0.8);
    });
  });

  it('自定义 registry 测试', async () => {
    // 使用中国镜像 registry 进行搜索
    const customRegistryResult = (await mcpClient.callTool({
      name: 'searchNpmPackages',
      arguments: {
        keyword: 'react',
        size: 3,
        registry: 'https://registry.npmmirror.com',
      },
    })) as ToolResponse;

    // 解析自定义 registry 结果
    const customRegistryContent = customRegistryResult.content[0].text;
    const customRegistryParsed = JSON.parse(customRegistryContent);

    // 验证结果是否符合预期
    expect(customRegistryParsed).toBeInstanceOf(Array);
    expect(customRegistryParsed.length).toBeLessThanOrEqual(3);
    expect(customRegistryParsed.length).toBeGreaterThan(0);
  });

  it('特殊关键词搜索测试', async () => {
    // 使用特殊关键词（包含空格、特殊字符等）
    const specialKeywordResult = (await mcpClient.callTool({
      name: 'searchNpmPackages',
      arguments: {
        keyword: 'state management',
        size: 3,
      },
    })) as ToolResponse;

    // 解析特殊关键词搜索结果
    const specialKeywordContent = specialKeywordResult.content[0].text;
    const specialKeywordParsed = JSON.parse(specialKeywordContent);

    // 验证结果是否符合预期
    expect(specialKeywordParsed).toBeInstanceOf(Array);
    expect(specialKeywordParsed.length).toBeGreaterThan(0);

    // 验证搜索结果与关键词相关
    const hasRelevantPackage = specialKeywordParsed.some(
      item =>
        (item.package.description &&
          (item.package.description.toLowerCase().includes('state') ||
            item.package.description.toLowerCase().includes('management'))) ||
        (item.package.keywords &&
          item.package.keywords.some(
            keyword =>
              keyword.toLowerCase().includes('state') ||
              keyword.toLowerCase().includes('management'),
          )),
    );
    expect(hasRelevantPackage).toBe(true);
  });

  it('错误处理测试 - 非法 registry', async () => {
    // 使用错误的 registry URL
    const invalidRegistryResult = (await mcpClient.callTool({
      name: 'searchNpmPackages',
      arguments: {
        keyword: 'react',
        registry: 'https://invalid-registry.example.com',
      },
    })) as ToolResponse;

    // 验证返回错误信息
    const errorContent = invalidRegistryResult.content[0].text;
    expect(errorContent).toContain('Error Searching NPM Packages');
  });
});
