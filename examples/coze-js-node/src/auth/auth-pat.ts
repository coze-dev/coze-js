/**
 * How to use personal access token to init Coze client.
 */

import { CozeAPI } from '@coze/api';

import config from '../config/config';

// 'en' for https://api.coze.com, 'cn' for https://api.coze.cn
const key = process.env.COZE_ENV || 'en';

// Retrieve the API key (Personal Access Token) from the configuration based on the current environment
const apiKey = config[key].auth.pat.COZE_API_KEY;

// The default base URL is https://api.coze.com
const baseURL = config[key].COZE_BASE_URL;

// Initialize a new Coze API client using the base URL and API key (Personal Access Token)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const client = new CozeAPI({
  baseURL,
  token: apiKey,
});

// Example of how to use the client (commented out)
// e.g. client.chat.stream(...);
