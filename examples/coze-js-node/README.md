# Coze Node.js Example

English | [简体中文](./README.zh-CN.md)

This guide will help you quickly set up and run the Coze Node.js example.

## Quick Start

### 1. Install Dependencies
Please refer to the root [README.md](../../README.md) for dependency installation instructions.

### 2. Configure Environment
1. Modify your configuration file:

```bash
cd src/config/config.ts
```

2. Update the following values in `config.ts`:
- `COZE_BOT_ID`: Your bot ID
- `COZE_BASE_URL`: API base URL
- `auth.pat.COZE_API_KEY`: Your Coze API key

### 3. Run the Example
Choose one of the following commands based on your Base URL:

```bash
# For China region (api.coze.cn)
COZE_ENV=zh npx tsx ./src/chat.ts            # macOS/Linux
set "COZE_ENV=zh" && npx tsx ./src/chat.ts   # Windows CMD
$env:COZE_ENV="zh"; npx tsx ./src/chat.ts    # Windows PowerShell

# For Global region (api.coze.com)
npx tsx ./src/chat.ts
```
