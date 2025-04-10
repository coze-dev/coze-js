import { isBrowser, safeJsonParse, sleep, mergeConfig } from '../src/utils';

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

describe('sleep', () => {
  it('should return a promise that resolves after the specified time', async () => {
    const startTime = Date.now();
    await sleep(100);
    const endTime = Date.now();
    expect(endTime - startTime).toBeGreaterThanOrEqual(90);
  });
});

describe('isBrowser', () => {
  it('should return false if running in a node', () => {
    expect(isBrowser()).toBe(false);
  });
});

describe('mergeConfig', () => {
  it('should merge configurations correctly', () => {
    const defaultConfig = {
      baseURL: 'https://api.example.com',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const userConfig = {
      timeout: 10000,
      headers: {
        Authorization: 'Bearer token123',
      },
    };

    const options = {
      headers: {
        'X-Custom-Header': 'CustomValue',
      },
    };

    const result = mergeConfig(defaultConfig, userConfig, options);

    expect(result).toEqual({
      baseURL: 'https://api.example.com',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token123',
        'X-Custom-Header': 'CustomValue',
      },
    });
  });

  it('should handle undefined inputs', () => {
    const defaultConfig = {
      baseURL: 'https://api.example.com',
      timeout: 5000,
    };

    const result = mergeConfig(defaultConfig, undefined, undefined);

    expect(result).toEqual(defaultConfig);
  });

  it('should override array values instead of merging them', () => {
    const defaultConfig = {
      methods: ['GET', 'POST'],
    };

    const userConfig = {
      methods: ['PUT', 'DELETE'],
    };

    const result = mergeConfig(defaultConfig, userConfig);

    expect(result).toEqual({
      methods: ['PUT', 'DELETE'],
    });
  });
});
