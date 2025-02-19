import { describe, expect, test } from 'vitest';
import { getCdnUrl } from '../../../src/libs/utils/get-cdn-url';

describe('utils/get-cdn-url', () => {
  test('getCdnUrl', async () => {
    const url = getCdnUrl('https://www.coze.cn/', './test.png');
    expect(url).toBe('https://www.coze.cn/test.png');
  });

  test('getCdnUrl-2', async () => {
    const url = getCdnUrl('https://www.coze.cn/', '/test.png');
    expect(url).toBe('https://www.coze.cn/test.png');
  });

  test('getCdnUrl-3', async () => {
    const url = getCdnUrl('https://www.coze.cn/asdf', 'test.png');
    expect(url).toBe('https://www.coze.cn/asdf/test.png');
  });
  test('getCdnUrl-false', async () => {
    const url = getCdnUrl('5', './test.png');
    expect(url).toBe('');
  });
});
