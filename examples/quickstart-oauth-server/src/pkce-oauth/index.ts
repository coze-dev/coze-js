/* eslint-disable */
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import fs from 'fs';
import path, { dirname } from 'path';
import {
  getPKCEAuthenticationUrl,
  getPKCEOAuthToken,
  refreshOAuthToken,
} from '@coze/api';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import createSession from 'koa-session';

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

// Session configuration
const SESSION_CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false,
};

// Set the keys for cookie signing
app.keys = [crypto.randomBytes(32).toString('hex')];

// Apply session middleware
app.use(createSession(SESSION_CONFIG, app));

// Add CORS middleware
app.use(
  cors({
    credentials: true, // 允许跨域请求携带 cookie
    origin: ctx => {
      // 从请求中获取 Origin
      const requestOrigin = ctx.get('Origin');
      // 如果 Origin 存在则返回该值，这样可以支持开发环境和生产环境
      return requestOrigin || 'http://127.0.0.1:3000';
    },
  }),
);

// Use bodyParser middleware to parse POST request body
app.use(bodyParser());

router.get('/pkce_login', async ctx => {
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
    const { codeVerifier, url } = await getPKCEAuthenticationUrl({
      baseURL: config.coze_api_base,
      clientId: config.client_id,
      redirectUrl: redirect_url as string,
      workspaceId: workspace_id as string, // OBO 模式需要传入 workspaceId
    });

    console.log('codeVerifier', url, workspace_id);

    // Store code_verifier in session
    ctx.session!.codeVerifier = codeVerifier;

    ctx.redirect(url);
  } catch (error: any) {
    console.error('Failed to get PKCE Authentication URL:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      msg: `Failed to get PKCE Authentication URL: ${error?.message}`,
    };
  }
});

router.post('/get_pkce_token', async ctx => {
  try {
    const { code, redirect_url } = ctx.request.body as any;
    const codeVerifier = ctx.session?.codeVerifier;

    if (!code) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        msg: 'Authorization code is required',
      };
      return;
    }

    if (!codeVerifier) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        msg: 'Code verifier is required',
      };
      return;
    }

    const oauthToken = await getPKCEOAuthToken({
      baseURL: config.coze_api_base,
      clientId: config.client_id,
      code: code,
      redirectUrl: redirect_url as string,
      codeVerifier: codeVerifier,
    });

    ctx.body = {
      code: 0,
      data: oauthToken,
    };
  } catch (error: any) {
    console.error('Failed to get PKCE OAuth Token:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      msg: `Failed to get PKCE OAuth Token: ${error?.message}`,
    };
  }
});

router.post('/refresh_pkce_token', async ctx => {
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
const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`Server running on port http://127.0.0.1:${port}`);
});
