import { CozeAPI } from '../../src/index';
import { Files } from '../../src/resources/files/files';
import { fetch, File, FormData } from '../../src/shims/index';

// Mock fetch
jest.mock('../../src/shims/index', () => ({
  ...jest.requireActual('../../src/shims/index'),
  fetch: jest.fn(),
}));

describe('Files', () => {
  let coze: CozeAPI;
  let files: Files;

  beforeEach(() => {
    coze = new CozeAPI({ token: 'test-api-key' });
    files = new Files(coze);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('upload', () => {
    it('should upload a file', async () => {
      const mockResponse = { data: { file_id: 'file_123', file_name: 'test.txt' } };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ code: 0, ...mockResponse }),
      });

      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });

      const result = await files.create({ file });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.coze.com/v1/files/upload',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            authorization: 'Bearer test-api-key',
          }),
          // body: expect.any(FormData),
        }),
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('retrieve', () => {
    it('should retrieve file information', async () => {
      const mockResponse = { data: { file_id: 'file_123', file_name: 'test.txt', file_size: 1024 } };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ code: 0, ...mockResponse }),
      });

      const result = await files.retrieve('file_123');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.coze.com/v1/files/retrieve?file_id=file_123',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            authorization: 'Bearer test-api-key',
          }),
        }),
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});
