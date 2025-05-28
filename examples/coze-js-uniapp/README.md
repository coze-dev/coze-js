# Coze.js UniApp 示例

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

这是一个 [Coze](https://www.coze.com)（或[扣子](https://www.coze.cn)）API 与 [UniApp](https://uniapp.dcloud.net.cn/) 集成的示例项目。本示例演示了如何在 UniApp 跨平台应用中使用 Coze 的 Open API 能力，包括实时语音聊天、语音转写、文本转语音等 WebSocket 功能。

## 功能特点

- 🎤 **实时语音聊天**：基于 WebSocket 的双向语音对话功能
- 📝 **实时语音转写**：将语音实时转写为文本
- 🔊 **文本转语音**：将文本转换为自然流畅的语音
- ⚙️ **API 示例**：Coze API 调用示例
- 📱 **多平台支持**：同时支持 H5、微信小程序等多种平台

## 快速开始

### 环境要求

- Node.js 16+
- npm 或 pnpm

### 安装依赖

```bash
# 安装依赖
npm run run-preinstall # 务必先执行
npm install
```

### 环境配置

```bash
# 复制环境配置文件，并编辑填入你的 API 密钥
cp .env.production .env.local

# 编辑 .env.local 文件，填入您的 Coze API 密钥和配置
# 必须设置以下变量：
# VITE_COZE_TOKEN=your_pat_token
# VITE_COZE_BOT_ID=your_bot_id
```

### 运行项目

```bash
# 运行 H5 版本
npm run dev:h5

# 运行微信小程序版本
npm run dev:mp-weixin
```

## 项目结构

```
├── src/
│   ├── api/             # API 请求封装
│   ├── composables/     # 组合式函数
│   │   ├── use-chat.ts             # 聊天功能 Hook
│   │   ├── use-speech.ts           # 文本转语音 Hook
│   │   ├── use-transcription.ts    # 语音转文本 Hook
│   │   └── use-voice-chat.ts       # 语音聊天 Hook
│   ├── pages/          # 页面组件
│   │   ├── home/           # 首页
│   │   ├── chat/           # 语音聊天页面
│   │   ├── speech/         # 文本转语音页面
│   │   ├── transcription/  # 语音转写页面
│   │   └── api/            # API 示例页面
│   ├── static/         # 静态资源
│   ├── App.vue         # 应用入口组件
│   ├── main.ts         # 应用入口文件
│   └── pages.json      # 页面路由配置
├── .env.production     # 生产环境配置模板
└── package.json        # 项目依赖配置
```

## 功能模块说明

### 1. 实时语音聊天

基于 WebSocket 的实时语音对话功能，支持：

- 双向实时语音对话
- 文本消息发送
- 麦克风静音控制
- 服务端/客户端判停模式

### 2. 实时语音转写

将语音实时转写为文本功能，支持：

- 实时语音转写
- 暂停/继续转写
- 完整转写结果展示

### 3. 文本转语音

将文本转换为自然流畅的语音，支持：

- 文本输入转语音
- 语音播放控制（暂停/继续）
- 语速调节

### 4. API 示例

展示 Coze API 基本调用方法，包括：

- 流式/非流式聊天接口
- Workflow 调用
- 文件上传示例

## 开发与测试

### 平台特定说明

#### H5 版本

```bash
npm run dev:h5
```

H5 版本会自动打开浏览器，访问 `http://localhost:5173/` 查看效果。

#### 微信小程序版本

```bash
npm run dev:mp-weixin
```

然后使用微信开发者工具打开项目的 `dist/dev/mp-weixin` 目录。

### 注意事项

- 请确保在 `.env.local` 中正确配置了 API 密钥和机器人 ID
- 在不同平台下，录音权限获取方式可能有所不同，需要进行相应配置
- 首次使用微信小程序时，需要在开发者工具中开启相关权限

## 相关资源

- [Coze 平台](https://www.coze.cn)
- [UniApp 开发文档](https://uniapp.dcloud.net.cn/)
- [Coze.js API SDK](../../packages/coze-js/README.md)
- [Coze.js UniApp SDK](../../packages/coze-uniapp/README.md)

## 许可证

[MIT](../../LICENSE)
