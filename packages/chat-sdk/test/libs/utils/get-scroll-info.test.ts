import { describe, expect, test } from 'vitest';

import { getScrollInfo } from '../../../src/libs/utils/get-scroll-info';

describe('utils/get-scroll-info', () => {
  test('getScrollInfo', async () => {
    const { scrollLeft, scrollTop } = await getScrollInfo('test.txt');
    expect(scrollLeft).toBe(0);
    expect(scrollTop).toBe(0);
  });
});
