# Coze Node.js Example

This guide will help you quickly set up and run the Coze Node.js example.

## Quick Start

### 1. Install Dependencies
Please refer to the root [README.md](../../README.md) for dependency installation instructions.

### 2. Configure Environment
1. Create your configuration file:

```bash
cp src/config/config.default.ts src/config/config.ts
```

2. Update the following values in `config.ts`:
- `COZE_BOT_ID`: Your bot ID
- `COZE_BASE_URL`: API base URL
- `auth.pat.COZE_API_KEY`: Your Coze API key

### 3. Run the Example
Choose one of the following commands based on your endpoint:

```bash
# For China region (api.coze.cn)
COZE_ENV=zh npm run start src/chat.ts

# For Global region (api.coze.com)
npm run start src/chat.ts
```
