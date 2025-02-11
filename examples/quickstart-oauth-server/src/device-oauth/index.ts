/* eslint-disable */
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import fs from 'fs';
import path, { dirname } from 'path';
import { getDeviceCode, getDeviceToken, refreshOAuthToken } from '@coze/api';
import { fileURLToPath } from 'url';

// config file path
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
  const requiredFields = ['client_id', 'coze_api_base'];

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

// Add CORS middleware
app.use(cors());

// Use bodyParser middleware to parse POST request body
app.use(bodyParser());

router.get('/get_device_code', async ctx => {
  try {
    const { workspace_id } = ctx.query;
    const deviceCode = await getDeviceCode({
      baseURL: config.coze_api_base,
      clientId: config.client_id,
      workspaceId: (workspace_id as string) || undefined, // OBO 模式需要传入 workspaceId
    });

    ctx.body = {
      code: 0,
      data: deviceCode,
    };
  } catch (error: any) {
    console.error('Failed to get Device Code:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      msg: `Failed to get Device Code: ${error?.message}`,
    };
  }
});

router.post('/get_device_token', async ctx => {
  try {
    const { device_code } = ctx.request.body as any;

    if (!device_code) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        msg: 'Device code is required',
      };
      return;
    }

    const deviceToken = await getDeviceToken({
      baseURL: config.coze_api_base,
      clientId: config.client_id,
      deviceCode: device_code,
      poll: true,
    });

    ctx.body = {
      code: 0,
      data: deviceToken,
    };
  } catch (error: any) {
    console.error('Failed to get Device Token:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      msg: `Failed to get Device Token: ${error?.message}`,
    };
  }
});

router.post('/refresh_device_token', async ctx => {
  try {
    const { refresh_token } = ctx.request.body as any;

    if (!refresh_token) {
      ctx.status = 400;
      ctx.body = { code: 400, msg: 'Refresh token is required' };
      return;
    }

    // Refresh access token
    const oauthToken = await refreshOAuthToken({
      baseURL: config.coze_api_base,
      clientId: config.client_id,
      refreshToken: refresh_token,
    });

    ctx.body = {
      code: 0,
      data: oauthToken,
    };
  } catch (error: any) {
    console.error('Failed to refresh token:', error);
    ctx.status = 500;
    ctx.body = { code: 500, msg: `Failed to refresh token: ${error?.message}` };
  }
});

// Register routes
app.use(router.routes()).use(router.allowedMethods());

// Start server
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server running on port http://127.0.0.1:${port}`);
});
