# Coze 实时语音 API

[![npm version](https://img.shields.io/npm/v/@coze/realtime-api.svg)](https://www.npmjs.com/package/@coze/realtime-api)
[![npm downloads](https://img.shields.io/npm/dm/@coze/realtime-api.svg)](https://www.npmjs.com/package/@coze/realtime-api)
[![license](https://img.shields.io/npm/l/@coze/realtime-api.svg)](https://github.com/coze-dev/coze-js/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/coze-dev/coze-js/pulls)

[English](./README.md) | 简体中文

一个强大的实时语音 SDK，用于与 Coze AI Bot 进行语音交互。

## 特性
1. 精准的语音识别：利用大语言模型进行 ASR（自动语音识别），我们的系统提供上下文理解能力。它可以参考之前提到的术语，理解说话风格和引用，并在噪音、专业术语和中英混合语音等挑战性场景下提供更高的识别准确率。

2. 强大的 AI 代理能力：作为 AI 代理开发平台，Coze 提供全面的代理功能，包括：
   - 记忆系统（文件存储、数据库、变量）
   - 知识集成（文本、表格、图像）
   - 技能（插件、触发器）
   - 工作流编排（任务流、图像处理流程）

3. 低延迟：使用 RTC（实时通信）技术实现，最大限度地减少通信管道中的延迟。

4. 自然语音合成：使用由大语言模型驱动的高级 TTS（文本转语音）模型，我们的系统：
   - 智能预测情感语境和语调
   - 生成超自然、高保真、个性化的语音输出
   - 在自然度、音质、韵律、呼吸模式和情感表达方面表现出色
   - 无缝处理中英混合内容
   - 提供类人的语气词和情感细微差别表达

![api-overview](./assets/api-overview.png)

## 安装

```bash
npm install @coze/realtime-api
# 或
yarn add @coze/realtime-api
```

## 快速开始

```ts
import { RealtimeClient, EventNames, RealtimeUtils } from "@coze/realtime-api";

// 初始化客户端
const client = new RealtimeClient({
  baseURL: "https://api.coze.cn",
  accessToken: "your_access_token",
  // 或者
  // accessToken: async () => {
  //   // 如果令牌过期则刷新
  //   return 'your_oauth_token';
  // },
  botId: "your_bot_id",
  voiceId: "your_voice_id",           // 可选：指定音色 ID
  conversationId: "conversation_id",   // 可选：用于对话连续性
  debug: true,                        // 可选：启用调试日志
  getRoomInfo: async () => {
    // 自定义获取房间信息
    return {
      token: "your_token",
      uid: "your_uid",
      room_id: "your_room_id",
      app_id: "your_app_id",
    };
  },
  allowPersonalAccessTokenInBrowser: true,  // 可选：在浏览器中启用 PAT 令牌使用
  audioMutedDefault: false,           // 可选：初始音频状态（默认：false）
  suppressStationaryNoise: false,     // 可选：启用静态噪声抑制（默认：false）
  suppressNonStationaryNoise: false,  // 可选：启用非静态噪声抑制（默认：false）
});

// 基本设置
async function initializeVoiceChat() {
  // 1. 验证设备权限
  const result = await RealtimeUtils.checkDevicePermission();
  if (!result.audio) {
    throw new Error("需要麦克风访问权限");
  }

  // 2. 建立连接
  await client.connect();
}

// 核心操作
const operations = {
  disconnect: () => client.disconnect(),
  interrupt: () => client.interrupt(),
  toggleMicrophone: (enabled: boolean) => client.setAudioEnable(enabled),
  checkConnection: () => client.isConnected,
  // 获取 RTC 引擎实例，详情请访问  https://www.volcengine.com/docs/6348/104478#rtcengine
  getRtcEngine: () => client.getRtcEngine(),
};

// 事件处理
function setupEventListeners() {
  // 监听所有事件
  client.on(EventNames.EventNames, console.log);

  // 仅客户端事件
  client.on(EventNames.ALL_CLIENT, console.log);

  // 仅服务器端事件
  client.on(EventNames.ALL_SERVER, console.log);

  // 特定事件处理
  client.on(EventNames.CONNECTED, (event) => {
    console.log("连接已建立:", event);
  });
}
```

## 示例
查看完整的示例，请参考我们的[实时语音控制台DEMO](../../examples/realtime-console)。

## 同声传译
[使用文档](./live.md)
