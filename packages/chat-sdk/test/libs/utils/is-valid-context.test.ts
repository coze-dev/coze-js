import { describe, test, expect } from 'vitest';

import { isValidContext } from '../../../src/libs/utils/is-valid-context';

describe('Index 组件', () => {
  test('isValidContext', () => {
    const success = isValidContext({
      context1: 'asdf',
      context2: 'sasf',
    });
    expect(success).toBe(true);
  });
  test('isValidContext_error', () => {
    const success = isValidContext({
      context1: 'asdf',
      context2: null,
    });
    expect(success).toBe(false);
  });
});
