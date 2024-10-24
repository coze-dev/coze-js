import { toFormData } from 'axios';

import {
  Files,
  type CreateFileReq,
  type FileObject,
} from '../../src/resources/files/files';
import { CozeAPI } from '../../src/index';

jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  toFormData: jest.fn().mockImplementation(data => data),
}));

describe('Files', () => {
  let client: CozeAPI;
  let files: Files;

  beforeEach(() => {
    client = new CozeAPI({ token: 'test-token' });
    files = new Files(client);
  });

  describe('create', () => {
    it('should upload a file', async () => {
      const mockFileObject: FileObject = {
        id: 'file-1',
        bytes: 1024,
        created_at: 1234567890,
        file_name: 'test.pdf',
      };

      const mockResponse = { data: mockFileObject };
      jest.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params: CreateFileReq = {
        file: 'mock-file-content',
      };

      const result = await files.create(params);

      expect(toFormData).toHaveBeenCalledWith(params);
      expect(client.post).toHaveBeenCalledWith(
        '/v1/files/upload',
        params,
        false,
        undefined,
      );
      expect(result).toEqual(mockFileObject);
    });
  });

  describe('retrieve', () => {
    it('should retrieve file information', async () => {
      const mockFileObject: FileObject = {
        id: 'file-1',
        bytes: 1024,
        created_at: 1234567890,
        file_name: 'test.pdf',
      };

      const mockResponse = { data: mockFileObject };
      jest.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const fileId = 'file-1';
      const result = await files.retrieve(fileId);

      expect(client.get).toHaveBeenCalledWith(
        '/v1/files/retrieve?file_id=file-1',
        null,
        false,
        undefined,
      );
      expect(result).toEqual(mockFileObject);
    });
  });
});
