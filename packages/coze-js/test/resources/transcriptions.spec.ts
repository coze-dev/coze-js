import { toFormData } from 'axios';

import {
  Transcriptions,
  type CreateTranscriptionReq,
} from '../../src/resources/audio/transcriptions';
import { CozeAPI, type FileObject } from '../../src/index';

vi.mock('axios', () => ({
  ...vi.importActual('axios'),
  toFormData: vi.fn().mockImplementation(data => data),
}));

describe('Transcriptions', () => {
  let client: CozeAPI;
  let transcriptions: Transcriptions;

  beforeEach(() => {
    client = new CozeAPI({ token: 'test-token' });
    transcriptions = new Transcriptions(client);
  });

  describe('create', () => {
    it('should upload a file', async () => {
      const mockFileObject: FileObject = {
        id: 'file-1',
        bytes: 1024,
        created_at: 1234567890,
        file_name: 'test.mp3',
      };

      const mockResponse = { data: mockFileObject };
      vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params: CreateTranscriptionReq = {
        file: 'mock-file-content',
      };

      const result = await transcriptions.create(params);

      expect(toFormData).toHaveBeenCalledWith(params);
      expect(client.post).toHaveBeenCalledWith(
        '/v1/audio/transcriptions',
        params,
        false,
        undefined,
      );
      expect(result).toEqual(mockFileObject);
    });
  });
});
