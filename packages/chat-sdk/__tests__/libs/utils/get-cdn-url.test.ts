import { describe, expect, test } from 'vitest';

import { getCdnUrl } from '../../../src/libs/utils/get-cdn-url';

describe('utils/get-cdn-url', () => {
  test('getCdnUrl', () => {
    const url = getCdnUrl('https://www.coze.cn/', './test.png');
    expect(url).toBe('https://www.coze.cn/test.png');
  });

  test('getCdnUrl-2', () => {
    const url = getCdnUrl('https://www.coze.cn/', '/test.png');
    expect(url).toBe('https://www.coze.cn/test.png');
  });

  test('getCdnUrl-3', () => {
    const url = getCdnUrl('https://www.coze.cn/asdf', 'test.png');
    expect(url).toBe('https://www.coze.cn/asdf/test.png');
  });
});
