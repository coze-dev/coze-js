import { formatAddtionalMessages } from '../src/utils';

describe('formatAddtionalMessages', () => {
  it('should return an empty array when input is undefined', () => {
    expect(formatAddtionalMessages(undefined)).toEqual([]);
  });

  it('should return an empty array when input is an empty array', () => {
    expect(formatAddtionalMessages([])).toEqual([]);
  });

  it('should stringify content when content_type is "object_string" and content is an array', () => {
    const input: any[] = [{ content_type: 'object_string', content: [1, 2, 3] }];
    const expected = [{ content_type: 'object_string', content: '[1,2,3]' }];
    expect(formatAddtionalMessages(input)).toEqual(expected);
  });

  it('should not modify content when content_type is not "object_string"', () => {
    const input: any[] = [{ content_type: 'text', content: 'Hello' }];
    expect(formatAddtionalMessages(input)).toEqual(input);
  });

  it('should not modify content when content_type is "object_string" but content is not an array', () => {
    const input: any[] = [{ content_type: 'object_string', content: 'Hello' }];
    expect(formatAddtionalMessages(input)).toEqual(input);
  });

  it('should handle mixed input correctly', () => {
    const input: any[] = [
      { content_type: 'object_string', content: [1, 2, 3] },
      { content_type: 'text', content: 'Hello' },
      { content_type: 'object_string', content: 'World' },
    ];
    const expected = [
      { content_type: 'object_string', content: '[1,2,3]' },
      { content_type: 'text', content: 'Hello' },
      { content_type: 'object_string', content: 'World' },
    ];
    expect(formatAddtionalMessages(input)).toEqual(expected);
  });
});
