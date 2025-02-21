import { describe, expect, test } from 'vitest';

import { getRegionApi, Region } from '../../../src/libs/utils/env';

describe('utils/env', () => {
  test('getRegionApi', () => {
    const url = getRegionApi(Region.OVERSEA);
    expect(url).toBe('https://api.coze.com');

    const url2 = getRegionApi(Region.CN);
    expect(url2).toBe('https://api.coze.cn');
  });
});
