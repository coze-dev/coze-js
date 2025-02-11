/* eslint-disable */
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import fs from 'fs';
import path, { dirname } from 'path';
import { getJWTToken } from '@coze/api';
import { fileURLToPath } from 'url';

const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = dirname(currentFilename);
const configPath = path.join(currentDirname, 'coze_oauth_config.json');

// Load configuration file
function loadConfig() {
  // Check if configuration file exists
  if (!fs.existsSync(configPath)) {
    throw new Error(
      'Configuration file coze_oauth_config.json does not exist!',
    );
  }

  // Read configuration file
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  // Validate required fields
  const requiredFields = [
    'client_id',
    'public_key_id',
    'private_key',
    'coze_api_base',
  ];

  for (const field of requiredFields) {
    if (!config[field]) {
      throw new Error(`Configuration file missing required field: ${field}`);
    }
  }

  return config;
}

// Load configuration
const config = loadConfig();

const app = new Koa();
const router = new Router();

// Use bodyParser middleware to parse POST request body
app.use(bodyParser());

// Use cors middleware to allow cross-origin requests
app.use(cors());

// Login route
router.post('/get_jwt_token', async ctx => {
  try {
    // Get JWT OAuth token directly instead of redirecting
    const oauthToken = await getJWTToken({
      baseURL: config.coze_api_base,
      appId: config.client_id,
      aud: 'api.coze.cn',
      keyid: config.public_key_id,
      privateKey: config.private_key,
    });

    // return oauthToken
    ctx.body = {
      code: 0,
      data: oauthToken,
    };
  } catch (error: any) {
    console.error('Failed to get JWT OAuth token:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      msg: `Failed to get JWT OAuth token: ${error?.message}`,
    };
  }
});

// Register routes
app.use(router.routes()).use(router.allowedMethods());

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port http://127.0.0.1:${port}`);
});
