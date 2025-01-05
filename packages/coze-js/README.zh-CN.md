# Coze API SDK
[![npm version](https://img.shields.io/npm/v/%40coze%2Fapi)](https://www.npmjs.com/package/@coze/api)
[![npm downloads](https://img.shields.io/npm/dm/%40coze%2Fapi)](https://www.npmjs.com/package/@coze/api)
[![bundle size](https://img.shields.io/bundlephobia/min/%40coze%2Fapi)](https://bundlephobia.com/package/@coze/api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](./README.md) | 简体中文

[Coze](https://www.coze.com)（或[扣子](https://www.coze.cn)）API 平台的官方 Node.js 和浏览器 SDK。

## 快速开始

### 1. 安装

```sh
npm install @coze/api
# 或
pnpm install @coze/api
```

### 2. 基本用法

```javascript
import { CozeAPI, COZE_CN_BASE_URL, ChatStatus, RoleType } from '@coze/api';

// 使用个人访问令牌初始化客户端
const client = new CozeAPI({
  token: 'your_pat_token', // 从 https://www.coze.cn/open/oauth/pats 获取你的 PAT
  // 或者
  // token: async () => {
  //   // 如果令牌过期则刷新
  //   return 'your_oauth_token';
  // },
  baseURL: COZE_CN_BASE_URL,
});

// 简单对话示例
async function quickChat() {
  const v = await client.chat.createAndPoll({
    bot_id: 'your_bot_id',
    additional_messages: [{
      role: RoleType.User,
      content: 'Hello!',
      content_type: 'text',
    }],
  });

  if (v.chat.status === ChatStatus.COMPLETED) {
    for (const item of v.messages) {
      console.log('[%s]:[%s]:%s', item.role, item.type, item.content);
    }
    console.log('usage', v.chat.usage);
  }
}
```

## 主要特性

- 🌐 **完整 API 支持**：覆盖所有 [Coze 开放平台 API](https://www.coze.cn/docs/developer_guides/api_overview)
- 🔐 **多种认证方式**：PAT、OAuth、JWT、OAuth PKCE
- 🔄 **流式响应支持**：聊天和工作流的实时响应
- 🌍 **跨平台**：支持 Node.js（≥14）和现代浏览器
- ⚙️ **可配置**：超时、请求头、信号、调试选项

## 认证选项

1. **个人访问令牌（最简单）**
```javascript
const client = new CozeAPI({
  token: 'your_pat_token',
  baseURL: COZE_CN_BASE_URL,
});
```

2. **其他认证方式**
- OAuth Web 应用
- OAuth PKCE
- JWT
- 设备码流程

[查看认证示例 →](../../examples/coze-js-node/src/auth/)

## 高级用法

### 流式对话
```javascript
import { CozeAPI, ChatEventType, RoleType } from '@coze/api';

async function streamChat() {
  const stream = await client.chat.stream({
    bot_id: 'your_bot_id',
    additional_messages: [{
      role: RoleType.User,
      content: 'Hello!',
      content_type: 'text',
    }],
  });

  for await (const part of stream) {
    if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
      process.stdout.write(part.data.content); // 实时响应
    }
  }
}
```

## 更多示例

| 功能 | 描述 | 示例 |
|---------|-------------|----------|
| 对话 | 文本对话 | [chat.ts](../../examples/coze-js-node/src/chat.ts) |
| Bot管理 | 创建和管理Bot | [bot.ts](../../examples/coze-js-node/src/bot.ts) |
| 数据集 | 文档管理 | [datasets.ts](../../examples/coze-js-node/src/datasets.ts) |
| 工作流 | 执行工作流 | [workflow.ts](../../examples/coze-js-node/src/workflow.ts) |
| 语音 | 语音合成 | [voice.ts](../../examples/coze-js-node/src/voice.ts) |

[查看所有示例 →](../../examples/coze-js-node/src/)

## 开发

```bash
# 安装依赖
rush update  # 如果未安装 `rush` 命令，请参见 ../../README.md

# 运行测试
npm run test
```

## 尝试示例

### Node.js
```bash
cd examples/coze-js-node
rush build
npx tsx ./src/chat.ts
```

### 浏览器
```bash
cd examples/coze-js-web
rush build
npm run start
```

## 文档

详细的 API 文档和指南，请访问：
- [API 概览](https://www.coze.cn/docs/developer_guides/api_overview)
- [认证指南](https://www.coze.cn/docs/developer_guides/authentication)
