import { safeJsonParse } from '../src/utils';

describe('safeJsonParse', () => {
  it('should return the parsed JSON if input is valid', () => {
    const input = '{"name":"John","age":30}';
    const result = safeJsonParse(input);
    expect(result).toEqual({ name: 'John', age: 30 });
  });

  it('should return the default value if input is not valid', () => {
    const input = '{"name":"John","age":30';
    const result = safeJsonParse(input);
    expect(result).toEqual('');
  });
});
