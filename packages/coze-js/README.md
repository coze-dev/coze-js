
# Coze API SDK
[![npm version](https://img.shields.io/npm/v/%40coze%2Fapi)](https://www.npmjs.com/package/@coze/api)
[![npm downloads](https://img.shields.io/npm/dm/%40coze%2Fapi)](https://www.npmjs.com/package/@coze/api)
[![bundle size](https://img.shields.io/bundlephobia/min/%40coze%2Fapi)](https://bundlephobia.com/package/@coze/api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

English | [简体中文](./README.zh-CN.md)

Official Node.js and Browser SDK for [Coze](https://www.coze.com)（or [扣子](https://www.coze.cn)） API platform.

## Quick Start

### 1. Installation


```sh
npm install @coze/api
# or
pnpm install @coze/api
```

### 2. Basic Usage

```javascript
import { CozeAPI, COZE_COM_BASE_URL, ChatStatus, RoleType } from '@coze/api';

// Initialize client with your Personal Access Token
const client = new CozeAPI({
  token: 'your_pat_token', // Get your PAT from https://www.coze.com/open/oauth/pats
  // or
  // token: async () => {
  //   // refresh token if expired
  //   return 'your_oauth_token';
  // },
  baseURL: COZE_COM_BASE_URL,
});

// Simple chat example
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

## Key Features

- 🌐 **Full API Support**: Covers all [Coze Open Platform APIs](https://www.coze.com/docs/developer_guides/api_overview)
- 🔐 **Multiple Auth Methods**: PAT, OAuth, JWT, OAuth PKCE
- 🔄 **Streaming Support**: Real-time responses for chat and workflow
- 🌍 **Cross-Platform**: Works in Node.js (≥14) and modern browsers
- ⚙️ **Configurable**: Timeout, headers, signal, debug options

## Authentication Options

1. **Personal Access Token (Simplest)**
```javascript
const client = new CozeAPI({
  token: 'your_pat_token',
  baseURL: COZE_COM_BASE_URL, // Use COZE_CN_BASE_URL for China region
});
```

2. **Other Auth Methods**
- OAuth Web Application
- OAuth PKCE
- JWT
- Device Code Flow

[View authentication examples →](../../examples/coze-js-node/src/auth/)

## Advanced Usage

### Streaming Chat
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
      process.stdout.write(part.data.content); // Real-time response
    }
  }
}
```

## More Examples

| Feature | Description | Example |
|---------|-------------|----------|
| Chat | Text conversations | [chat.ts](../../examples/coze-js-node/src/chat.ts) |
| Bot Management | Create and manage bots | [bot.ts](../../examples/coze-js-node/src/bot.ts) |
| Datasets | Document management | [datasets.ts](../../examples/coze-js-node/src/datasets.ts) |
| Workflow | Run workflow | [workflow.ts](../../examples/coze-js-node/src/workflow.ts) |
| Voice | Speech synthesis | [voice.ts](../../examples/coze-js-node/src/voice.ts) |

[View all examples →](../../examples/coze-js-node/src/)

## Development

```bash
# Install dependencies
rush update  # If `rush` command is not installed, see ../../README.md

# Run tests
npm run test
```

## Try Examples

### Node.js
```bash
cd examples/coze-js-node
rush build
npx tsx ./src/chat.ts
```

### Browser
```bash
cd examples/coze-js-web
rush build
npx tsx ./src/chat.ts
```

## Documentation

For detailed API documentation and guides, visit:
- [API Overview](https://www.coze.com/docs/developer_guides/api_overview)
- [Authentication Guide](https://www.coze.com/docs/developer_guides/authentication)
