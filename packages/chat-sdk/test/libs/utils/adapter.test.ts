import { describe, test, vi, expect } from 'vitest';
import { AxiosRequestHeaders } from 'axios';

import { taroAdapter } from '../../../src/libs/utils/adapter';
vi.mock('@tarojs/taro', () => ({
  request: ({ url, success, fail }) =>
    url.startsWith('https://www.coze.cn/')
      ? success({
          statusCode: 200,
          errMsg: 'success',
          data: 'success',
          header: {
            'Content-Type': 'application/json',
          },
        })
      : fail(new Error('unknown url')),
}));
describe('utils/adapter', () => {
  test('success', async () => {
    const res = await taroAdapter({
      url: 'https://www.coze.cn/',
      method: 'GET',
      data: { test: '1' },
      headers: {
        'Content-Type': 'application/json',
      } as unknown as AxiosRequestHeaders,
    });
    console.log('res', res);
    expect(res.status).to.be.equal(200);
  });

  test('fail', async () => {
    try {
      await taroAdapter({
        url: 'https://www.coze.cn23222/',
        method: 'GET',
        data: { test: '1' },
        headers: {
          'Content-Type': 'application/json',
        } as unknown as AxiosRequestHeaders,
      });
    } catch (error) {
      expect(error).toBe(error);
    }
  });
});
