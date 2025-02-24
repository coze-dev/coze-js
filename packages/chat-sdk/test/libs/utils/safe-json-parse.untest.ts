import { describe, expect, test } from 'vitest';

import { safeJSONParse } from '../../../src/libs/utils/safe-json-parse';
describe('utils/safe-json-parse', () => {
  test('safeJSONParse', () => {
    const str = '{"a":1,"b":2}';
    const obj = safeJSONParse(str, '123');
    expect(obj).toEqual({ a: 1, b: 2 });
  });
  test('safeJSONParse_default', () => {
    const str = '{"a":1,"b":2';
    const obj = safeJSONParse(str, '123');
    expect(obj).toEqual('123');
  });

  test('safeJSONParse_obj', () => {
    const str = { a: 1, b: 2 };
    const obj = safeJSONParse(str, '123');
    expect(obj).toEqual(str);
  });
});
