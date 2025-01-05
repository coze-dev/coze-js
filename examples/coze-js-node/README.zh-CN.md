# Coze Node.js 示例

[English](./README.md) | 简体中文

本指南将帮助你快速设置和运行 Coze Node.js 示例。

## 快速开始

### 1. 安装依赖
请参考根目录的 [README.md](../../README.md) 了解依赖安装说明。

### 2. 配置环境
1. 修改你的配置文件：

```bash
cd src/config/config.ts
```

2. 在 `config.ts` 中更新以下值：
- `COZE_BOT_ID`：你的 Bot ID
- `COZE_BASE_URL`：API 基础域名
- `auth.pat.COZE_API_KEY`：你的 Coze API PAT

### 3. 运行示例
根据你的 Base URL 选择以下命令之一：

```bash
# 中国区域 (api.coze.cn)
COZE_ENV=zh npx tsx ./src/chat.ts

# 全球区域 (api.coze.com)
npx tsx ./src/chat.ts
```
