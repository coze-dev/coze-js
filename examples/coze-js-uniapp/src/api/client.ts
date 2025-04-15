import { CozeAPI } from '@coze/uniapp-api';

export const createCozeClient = () =>
  new CozeAPI({
    baseURL: import.meta.env.VITE_COZE_BASE_URL,
    token: import.meta.env.VITE_COZE_TOKEN || '',
    allowPersonalAccessTokenInBrowser: true, // only for test
  });

export const cozeClient = createCozeClient();
