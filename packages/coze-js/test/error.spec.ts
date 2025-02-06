import { AxiosHeaders } from 'axios';

import {
  APIError,
  CozeError,
  castToError,
  APIConnectionError,
  BadRequestError,
  AuthenticationError,
  PermissionDeniedError,
  NotFoundError,
  RateLimitError,
  GatewayError,
  InternalServerError,
} from '../src/error';

describe('Error classes', () => {
  describe('CozeError', () => {
    it('should be an instance of Error', () => {
      const error = new CozeError('Test error');
      expect(error).toBeInstanceOf(Error);
    });

    it('should have the correct message', () => {
      const errorMessage = 'Test CozeError';
      const error = new CozeError(errorMessage);
      expect(error.message).toBe(errorMessage);
    });
  });

  describe('APIError', () => {
    it('should be an instance of CozeError', () => {
      const error = new APIError(400, undefined, 'Test error', undefined);
      expect(error).toBeInstanceOf(CozeError);
    });

    it('should set properties correctly', () => {
      const status = 400;
      const errorBody = {
        code: 1001,
        msg: 'Bad Request',
        error: {
          detail: 'Invalid input',
          help_doc: 'https://www.coze.com/docs/error/1001',
        },
      };
      const message = 'API Error';
      const headers = new AxiosHeaders({ 'x-tt-logid': '12345' });

      const error = new APIError(status, errorBody, message, headers);

      expect(error.status).toBe(status);
      expect(error.headers).toBe(headers);
      expect(error.code).toBe(errorBody.code);
      expect(error.msg).toBe(errorBody.msg);
      expect(error.detail).toBe(errorBody.error.detail);
      expect(error.logid).toBe('12345');
    });

    it('should create correct error message', () => {
      const status = 400;
      const errorBody = {
        code: 1001,
        msg: 'Bad Request',
        error: {
          detail: 'Invalid input',
        },
      };
      const headers = new AxiosHeaders({ 'x-tt-logid': '12345' });

      const error = new APIError(status, errorBody, undefined, headers);

      expect(error.message).toContain('code: 1001');
      expect(error.message).toContain('msg: Bad Request');
      expect(error.message).toContain('detail: Invalid input');
      expect(error.message).toContain('logid: 12345');
    });

    it('should use provided message when no error body', () => {
      const message = 'Custom error message';
      const error = new APIError(undefined, undefined, message, undefined);

      expect(error.message).toBe(message);
    });
  });
});

describe('APIError.generate', () => {
  it('should return APIConnectionError when status is undefined', () => {
    const error = APIError.generate(
      undefined,
      { code: 1001, msg: 'Error' },
      'Connection error',
      undefined,
    );
    expect(error).toBeInstanceOf(APIConnectionError);
    expect(error.message).toBe('Connection error.');
  });

  it('should return BadRequestError for status 400', () => {
    const error = APIError.generate(
      400,
      { code: 4000, msg: 'Bad Request' },
      undefined,
      undefined,
    );
    expect(error).toBeInstanceOf(BadRequestError);
    expect(error.status).toBe(400);
  });

  it('should return AuthenticationError for status 401', () => {
    const error = APIError.generate(
      401,
      { code: 4100, msg: 'Unauthorized' },
      undefined,
      undefined,
    );
    expect(error).toBeInstanceOf(AuthenticationError);
    expect(error.status).toBe(401);
  });

  it('should return PermissionDeniedError for status 403', () => {
    const error = APIError.generate(
      403,
      { code: 4101, msg: 'Forbidden' },
      undefined,
      undefined,
    );
    expect(error).toBeInstanceOf(PermissionDeniedError);
    expect(error.status).toBe(403);
  });

  it('should return NotFoundError for status 404', () => {
    const error = APIError.generate(
      404,
      { code: 4200, msg: 'Not Found' },
      undefined,
      undefined,
    );
    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.status).toBe(404);
  });

  it('should return RateLimitError for status 429', () => {
    const error = APIError.generate(
      429,
      { code: 4013, msg: 'Too Many Requests' },
      undefined,
      undefined,
    );
    expect(error).toBeInstanceOf(RateLimitError);
    expect(error.status).toBe(429);
  });

  it('should return GatewayError for status 502', () => {
    const error = APIError.generate(
      502,
      { code: 502, msg: 'Bad Gateway' },
      undefined,
      undefined,
    );
    expect(error).toBeInstanceOf(GatewayError);
    expect(error.status).toBe(502);
  });

  it('should return InternalServerError for status 500', () => {
    const error = APIError.generate(
      500,
      { code: 500, msg: 'Internal Server Error' },
      undefined,
      undefined,
    );
    expect(error).toBeInstanceOf(InternalServerError);
    expect(error.status).toBe(500);
  });

  it('should return generic APIError for unrecognized status', () => {
    const error = APIError.generate(
      418,
      { code: 418, msg: "I'm a teapot" },
      undefined,
      undefined,
    );
    expect(error).toBeInstanceOf(APIError);
    expect(error.status).toBe(418);
  });
});

describe('castToError', () => {
  it('should return the same error if input is already an Error', () => {
    const originalError = new Error('Test error');
    const result = castToError(originalError);
    expect(result).toBe(originalError);
  });

  it('should create a new Error if input is a string', () => {
    const errorString = 'Test error string';
    const result = castToError(errorString);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe(errorString);
  });

  it('should create a new Error with stringified message for non-string input', () => {
    const errorObject = { code: 500, message: 'Server error' };
    const result = castToError(errorObject);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('[object Object]');
  });
});
