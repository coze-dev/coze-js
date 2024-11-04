# Coze Node.js Example

This guide will help you quickly set up and run the Coze Node.js example.

## Quick Start

### 1. Install Dependencies
Please refer to the root [README.md](../../README.md) for dependency installation instructions.

### 2. Configure Environment
1. Create your configuration file:

```bash
cp config.default.js config.js
```

2. Update the following values in `config.js`:
- `COZE_API_KEY`: Your Coze API key
- `COZE_BOT_ID`: Your bot ID
- `COZE_SPACE_ID`: Your space ID（optional）
- `COZE_WORKFLOW_ID`: Your workflow ID（optional）
- `COZE_BASE_URL`: API base URL

### 3. Run the Example
Choose one of the following commands based on your endpoint:

```bash
# For China region (api.coze.cn)
node chat.mjs

# For Global region (api.coze.com)
COZE_ENV=en node chat.mjs
```
