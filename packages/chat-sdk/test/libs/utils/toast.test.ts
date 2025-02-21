import { describe, test } from 'vitest';

import { showToast } from '../../../src/libs/utils/toast';
describe('utils/showToast', () => {
  test('showToast', () => {
    showToast({ duration: 1, content: 'sada', icon: 'success' });
  });
});
