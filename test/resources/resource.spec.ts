import { APIClient } from '../../src/core';
import { APIResource } from '../../src/resources/resource';
import { FormData, File } from '../../src/shims/index';

describe('APIResource', () => {
  let client: APIClient;
  let resource: APIResource;

  beforeEach(() => {
    client = new APIClient({ token: 'test-token' });
    resource = new APIResource(client);
  });

  describe('_toFormData', () => {
    it('should convert object to FormData', () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });

      const body = {
        file: mockFile,
        text: 'Hello',
        number: 123,
      };

      const result = resource['_toFormData'](body);

      expect(result.get('file')).toStrictEqual(mockFile);
      expect(result.get('text')).toBe('Hello');
      expect(result.get('number')).toBe('123');
    });

    it('should handle empty object', () => {
      const result = resource['_toFormData']({});

      expect(result).toBeInstanceOf(FormData);
      expect(Array.from(result.entries())).toHaveLength(0);
    });

    it('should handle null or undefined', () => {
      const result1 = resource['_toFormData'](null);
      const result2 = resource['_toFormData'](undefined);

      expect(result1).toBeInstanceOf(FormData);
      expect(result2).toBeInstanceOf(FormData);
      expect(Array.from(result1.entries())).toHaveLength(0);
      expect(Array.from(result2.entries())).toHaveLength(0);
    });
  });
});
