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

## 更多示例

| 功能 | 描述 | 示例 |
|---------|-------------|----------|
| 对话 | 文本对话 | [chat.ts](../../examples/coze-js-node/src/chat.ts) |
| 对话| 端插件| [chat-local-plugin.ts](../../examples/coze-js-node/src/chat-local-plugin.ts)|
| 对话 | 对话中使用文件（图片） | [chat-with-file.ts](../../examples/coze-js-node/src/chat-with-file.ts) |
| Bot管理 | 创建和管理Bot | [bot.ts](../../examples/coze-js-node/src/bot.ts) |
| 数据集 | 文档管理 | [datasets.ts](../../examples/coze-js-node/src/datasets.ts) |
| 工作流 | 执行工作流 | [workflow.ts](../../examples/coze-js-node/src/workflow.ts) |
| 变量 | 变量管理 | [variables.ts](../../examples/coze-js-node/src/variables.ts) |
| 模板 | 模板管理 | [templates.ts](../../examples/coze-js-node/src/templates.ts) |
| 用户 | 获取用户信息 | [users-me.ts](../../examples/coze-js-node/src/users-me.ts) |
| 声纹 | 声纹管理 | [voiceprint.ts](../../examples/coze-js-node/src/voiceprint.ts) |
| 语音 | 语音合成 | [voice.ts](../../examples/coze-js-node/src/voice.ts) |
| 流式对话（websocket） | 文本、语音对话 | [chat.ts](../../examples/coze-js-node/src/websockets/chat.ts) |
| 语音合成（websocket） | 文本转语音 | [speech.ts](../../examples/coze-js-node/src/websockets/speech.ts) |
| 语音识别（websocket） | 语音转文本 | [transcriptions.ts](../../examples/coze-js-node/src/websockets/transcriptions.ts) |
[查看所有示例 →](../../examples/coze-js-node/src/)
[Websocket 事件 →](https://bytedance.larkoffice.com/docx/Uv6Wd8GTjoEex3xyq4YcxDnRnkc)

## 主要特性

- 🌐 **完整 API 支持**：覆盖所有 [Coze 开放平台 API](https://www.coze.cn/docs/developer_guides/api_overview)
- 🔐 **多种认证方式**：PAT、OAuth、JWT、OAuth PKCE
- 🔄 **流式响应支持**：聊天和工作流的实时响应
- 🔄 **Websocket 支持**：聊天、语音转文本、文本转语音的实时响应
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

### 流式对话（Websocket）
```javascript
import { CozeAPI, RoleType, WebsocketsEventType } from '@coze/api';

async function wsChat() {
  const ws = await client.websockets.chat.create('your_bot_id');

  ws.onopen = () => {
    ws.send({
      id: 'event_id',
      event_type: WebsocketsEventType.CHAT_UPDATE,
      data: {
        chat_config: {
          auto_save_history: true,
          user_id: 'uuid',
          meta_data: {},
          custom_variables: {},
          extra_params: {},
        },
      },
    });

    ws.send({
      id: 'event_id',
      event_type: WebsocketsEventType.CONVERSATION_MESSAGE_CREATE,
      data: {
        role: RoleType.User,
        content: 'tell me a joke',
        content_type: 'text',
      },
    });
  };

  ws.onmessage = (data, event) => {
    if (data.event_type === WebsocketsEventType.ERROR) {
      if (data.data.code === 4100) {
        console.error('Unauthorized Error', data);
      } else if (data.data.code === 4101) {
        console.error('Forbidden Error', data);
      } else {
        console.error('WebSocket error', data);
      }
      ws.close();
      return;
    }

    if (data.event_type === WebsocketsEventType.CONVERSATION_MESSAGE_DELTA) {
      console.log('on message delta', data.data);
    } else if (
      data.event_type === WebsocketsEventType.CONVERSATION_CHAT_COMPLETED
    ) {
      console.log('on chat completed', data.data);
    }
  };

  ws.onerror = error => {
    console.error('WebSocket error', error);
    ws.close();
  };
}
```


### 流式对话 SDK
基于Websocket的实时语音对话SDK，如果你使用 Web，推荐使用此 SDK
在线 Demo: https://www.coze.cn/open-platform/realtime/websocket
```typescript
import { WsChatClient, WsChatEventNames } from '@coze/api/ws-tools';
import { RoleType } from '@coze/api';

try {
  // 初始化
  const client = new WsChatClient({
    botId: 'your_bot_id',
    token: 'your_auth_token',
    voiceId: 'your_voice_id', // 可选
    allowPersonalAccessTokenInBrowser: true, // 可选，默认是 false
    debug: false, // 可选，默认是 false
  });

  await client.connect();
} catch (error) {
  console.error('error', error);
}

// 监听所有事件
client.on(WsChatEventNames.ALL, (eventName: string, event: WsChatEventData) => {
  console.log(event);
});

// 发送用户消息
client.sendMessage({
  id: 'event_id',
  event_type: WebsocketsEventType.CONVERSATION_MESSAGE_CREATE,
  data: {
    role: RoleType.User,
    content: 'Hello World',
    content_type: 'text',
  },
});

// 打断
client.interrupt();

// 断开连接
await client.disconnect();

// 设置音频启用
await client.setAudioEnable(false);

// 设置音频输入设备
await client.setAudioInputDevice('your_device_id');


// 设置播放音量
client.setPlaybackVolume(0);

// 获取播放音量
const volume = client.getPlaybackVolume();

```


### Proxy 示例
```ts
const client = new CozeAPI({
  token: '', // use proxy token in server
  baseURL: 'http://localhost:8080/api',
});
```

[查看代理示例 →](../../examples/coze-js-node/src/proxy/)

### 语音合成 SDK
在线 Demo: https://www.coze.cn/open-platform/realtime/websocket#speech
```javascript
import { WebsocketsEventType } from '@coze/api';
import { WsSpeechClient } from '@coze/api/ws-tools';

// 初始化
const client = new WsSpeechClient({
  token: 'your_pat_token',
  allowPersonalAccessTokenInBrowser: true, // optional
});

// 监听所有下行事件(包括error）
client.on('data', data => {
  console.log('[speech] ws data', data);
});

// 或者，监听单个事件
client.on(WebsocketsEventType.ERROR, data => {
  console.error('[speech] ws error', data);
});

// 监听播放完成事件，如果手动调用disconnect，则不会触发此事件
client.on('completed', () => {
  console.log('[speech] playback completed');
});

// 连接
try {
  await client.connect({voiceId: 'your_voice_id'});
  console.log('[speech] ws connect success');
} catch (error) {
  console.error('[speech] ws connect error', error);
  return;
}

// 发送消息并播放
client.appendAndComplete('你好，Coze!');

// 打断
await client.interrupt();


// 暂停语音播放
client.pause();

// 恢复语音播放
client.resume();

// 切换语音播放
client.togglePlay();

// 语音是否播放中
client.isPlaying();

// 断开连接，销毁 websocket
client.disconnect();

// 发送文本片段
client.append('你好，');
client.append(' Coze!');
// 结束发送文本
client.complete();
```

### 语音识别 SDK
在线 Demo: https://www.coze.cn/open-platform/realtime/websocket#transcription
```javascript
import { WsTranscriptionClient } from '@coze/api/ws-tools';
import { WebsocketsEventType } from '@coze/api';
// 初始化
const client = new WsTranscriptionClient({
  token: 'your_pat_token',
  allowPersonalAccessTokenInBrowser: true, // 可选
});

// 监听所有下行事件（包括错误）
client.on(WebsocketsEventType.ALL, data => {
  console.log('[transcription] ws data', data);
});

// 或者，监听单个事件
client.on(WebsocketsEventType.ERROR, data => {
  console.error('[transcription] ws error', data);
});

// 监听语音识别更新结果
client.on(WebsocketsEventType.TRANSCRIPTIONS_MESSAGE_UPDATE, (event) => {
  console.log('[transcription] result', event.data.content);
});

// 开始识别
try {
  await client.start();
} catch (error) {
  console.error('[transcription] error', error);
}

// 停止语音识别
client.stop();


// 暂停语音识别
client.pause();

// 恢复语音识别
client.resume();


// 销毁实例
client.destroy();
```


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
COZE_ENV=zh npx tsx ./src/chat.ts
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
