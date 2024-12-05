# Taro Coze API SDK

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official [Taro](https://docs.taro.zone/docs/) SDK for [Coze](https://www.coze.com)（or [扣子](https://www.coze.cn)） API platform.

## Quick Start

### 1. Installation

```sh
npm install @coze/taro-api @coze/api
# or
pnpm install @coze/taro-api @coze/api
```

### 2. Basic Usage

```javascript
import { COZE_COM_BASE_URL, RoleType, ChatStatus } from '@coze/api';
import { CozeAPI } from '@coze/taro-api';

// Initialize client with your Personal Access Token
const client = new CozeAPI({
  token: 'your_pat_token', // Get your PAT from https://www.coze.com/open/oauth/pats
  baseURL: COZE_COM_BASE_URL,
});

// Simple chat example
async function quickChat() {
  try {
    const v = await client.chat.createAndPoll({
      bot_id: 'your_bot_id',
      additional_messages: [
        {
          role: RoleType.User,
          content: 'Hello!',
          content_type: 'text',
        },
      ],
    });

    if (v.chat.status === ChatStatus.COMPLETED) {
      for (const item of v.messages) {
        console.log('[%s]:[%s]:%s', item.role, item.type, item.content);
      }
      console.log('usage', v.chat.usage);
    }
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
}
```

## Key Features

- 🌐 **Consistent API**: Maintains consistent API with [Coze-JS](../coze-js/README.md)
- 🔄 **Streaming Support**: Compatible with ByteDance Mini Program/WeChat Mini Program

## Advanced Usage

### Streaming Chat

```javascript
import { ChatEventType } from '@coze/api';
import { CozeAPI } from '@coze/taro-api';

async function streamChat() {
  const stream = await client.chat.stream({
    bot_id: 'your_bot_id',
    additional_messages: [
      {
        role: RoleType.User,
        content: 'Hello!',
        content_type: 'text',
      },
    ],
  });

  for await (const part of stream) {
    if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
      console.log(part.data.content); // Real-time response
    }
  }
}
```

### Refresh token

```javascript
import { COZE_COM_BASE_URL } from '@coze/api';
import { CozeAPI } from '@coze/taro-api';

const client = new CozeAPI({
  token: 'your_pat_token', // https://www.coze.com/open/oauth/pats
  baseURL: COZE_COM_BASE_URL,
  onBeforeAPICall: () => {
    return { token: 'your_new_pat_token' };
  },
});
```

### Abort streaming chat

```javascript
import { ChatEventType } from '@coze/api';
import { CozeAPI, AbortController } from '@coze/taro-api';

async function streamChat() {
  const controller = new AbortController();
  setTimeout(() => {
    controller.abort();
  }, 10);

  const stream = await client.chat.stream({
    bot_id: 'your_bot_id',
    additional_messages: [
      {
        role: RoleType.User,
        content: 'Hello!',
        content_type: 'text',
      },
    ],
  }, {
    signal: controller.signal,
  });

  for await (const part of stream) {
    if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
      console.log(part.data.content); // Real-time response
    }
  }
}
```

## Try Examples

```bash
cd examples/coze-js-taro
cp .env.development .env.local # Edit .env.local with your credentials
npm run dev:weapp
```

## Documentation

For detailed API documentation and guides, visit:

- [API Overview](https://www.coze.com/docs/developer_guides/api_overview)
- [Authentication Guide](https://www.coze.com/docs/developer_guides/authentication)
