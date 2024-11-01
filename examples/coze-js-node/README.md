step1 build coze-api

```bash
cd path/to/coze-api
yarn build
```

step2 set env

```bash
cd examples/node
cp config.default.json config.json
```

and set the COZE_API_KEY, COZE_BOT_ID, COZE_SPACE_ID, COZE_WORKFLOW_ID, COZE_BASE_URL

step3 run examples

```bash
node chat.mjs // for https://api.coze.cn endpoint
// or
COZE_ENV=en node chat.mjs  // for https://api.coze.com endpoint
```
