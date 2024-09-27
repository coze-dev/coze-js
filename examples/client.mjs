import { CozeAPI } from '../dist/index.js';

const apiKey = process.env.COZE_API_KEY;
const botId = process.env.COZE_BOT_ID;
const spaceId = process.env.COZE_SPACE_ID;
const workflowId = process.env.COZE_WORKFLOW_ID;

const client = new CozeAPI({
  auth: new CozeAPI.TokenAuth(apiKey),
});

export { client, botId, spaceId, workflowId };
