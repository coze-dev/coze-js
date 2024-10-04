import { CozeAPI } from '../../dist/node/index.js';

const apiKey = process.env.COZE_API_KEY || '';
const botId = process.env.COZE_BOT_ID || '';
const spaceId = process.env.COZE_SPACE_ID || '';
const workflowId = process.env.COZE_WORKFLOW_ID || '';
const baseURL = process.env.COZE_BASE_URL || 'https://api.coze.cn';

const client = new CozeAPI({
  baseURL,
  token: apiKey,
});

export { client, botId, spaceId, workflowId };
