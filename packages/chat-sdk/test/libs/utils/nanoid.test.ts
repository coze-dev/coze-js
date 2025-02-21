import { describe, expect, test } from 'vitest';

import { nanoid } from '../../../src/libs/utils/nanoid';
describe('utils/nanoid', () => {
  test('nanoid', () => {
    const id = nanoid();
    expect(id).toBeDefined();
  });
});
