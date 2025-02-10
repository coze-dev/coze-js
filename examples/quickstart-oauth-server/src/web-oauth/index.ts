/* eslint-disable */
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import fs from 'fs';
import path, { dirname } from 'path';
import {
  getWebAuthenticationUrl,
  getWebOAuthToken,
  refreshOAuthToken,
} from '@coze/api';
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
  const requiredFields = ['client_id', 'client_secret', 'coze_api_base'];

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

router.get('/web_login', async ctx => {
  try {
    const { redirect_url, workspace_id } = ctx.query;
    if (!redirect_url) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        msg: 'Redirect URI is required',
      };
      return;
    }
    const authUrl = getWebAuthenticationUrl({
      baseURL: config.coze_api_base,
      clientId: config.client_id,
      redirectUrl: redirect_url as string,
      workspaceId: (workspace_id as string) || undefined, // OBO 模式需要传入 workspaceId
    });
    ctx.redirect(authUrl);
  } catch (error: any) {
    console.error('Failed to get Web Authentication URL:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      msg: `Failed to get Web Authentication URL: ${error?.message}`,
    };
  }
});

router.post('/get_web_token', async ctx => {
  try {
    const { code, redirect_url } = ctx.request.body as any;

    if (!code) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        msg: 'Authorization code is required',
      };
      return;
    }

    // Get access token
    const oauthToken = await getWebOAuthToken({
      baseURL: config.coze_api_base,
      clientId: config.client_id,
      clientSecret: config.client_secret,
      code: code,
      redirectUrl: redirect_url as string,
    });

    ctx.body = {
      code: 0,
      data: oauthToken,
    };
  } catch (error: any) {
    console.error('Failed to get Web OAuth Token:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      msg: `Failed to get Web OAuth Token: ${error?.message}`,
    };
  }
});

router.post('/refresh_web_token', async ctx => {
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
      clientSecret: config.client_secret,
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
const port = process.env.PORT || 3004;
app.listen(port, () => {
  console.log(`Server running on port http://127.0.0.1:${port}`);
});
