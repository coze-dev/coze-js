import { CozeAPI } from '@coze/api';

import config from '../config.js';

const key = process.env.COZE_ENV || 'en';

const apiKey = process.env.COZE_API_KEY || config[key].auth.pat.COZE_API_KEY;
const botId = process.env.COZE_BOT_ID || config[key].COZE_BOT_ID;
const spaceId = process.env.COZE_SPACE_ID || config[key].COZE_SPACE_ID;
const workflowId = process.env.COZE_WORKFLOW_ID || config[key].COZE_WORKFLOW_ID;
const baseURL = process.env.COZE_BASE_URL || config[key].COZE_BASE_URL;

const client = new CozeAPI({
  baseURL,
  token: apiKey,
});

async function sleep(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

export { client, botId, spaceId, workflowId, sleep, baseURL, apiKey };
