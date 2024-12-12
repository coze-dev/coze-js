import {
  type CreateDocumentReq,
  Documents,
  type DocumentInfo,
  type UpdateDocumentReq,
  type ListDocumentReq,
  type DeleteDocumentReq,
} from '../../src/resources/datasets/documents/documents';
import { CozeAPI } from '../../src/index';

describe('Documents', () => {
  let client: CozeAPI;
  let documents: Documents;

  beforeEach(() => {
    client = new CozeAPI({ token: 'test-token' });
    documents = new Documents(client);
  });

  describe('create', () => {
    it('should create a document', async () => {
      const mockDocumentInfo: DocumentInfo = {
        char_count: 1000,
        chunk_strategy: { chunk_type: 0, max_tokens: 500 },
        create_time: 1234567890,
        document_id: 'doc-1',
        format_type: 1,
        hit_count: 5,
        name: 'Document 1',
        size: 2048,
        slice_count: 3,
        status: 1,
        type: 'pdf',
        update_interval: 24,
        update_time: 1234567891,
        update_type: 1,
      };

      const mockResponse = { document_infos: [mockDocumentInfo] };
      vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params: CreateDocumentReq = {
        dataset_id: 'dataset-id',
        document_bases: [
          {
            name: 'Document 1',
            source_info: {
              file_base64: 'base64encodedstring',
              file_type: 'pdf',
            },
            update_rule: {
              update_type: 1,
              update_interval: 24,
            },
          },
        ],
        chunk_strategy: {
          chunk_type: 0,
          max_tokens: 500,
        },
      };

      const result = await documents.create(params);

      expect(client.post).toHaveBeenCalledWith(
        '/open_api/knowledge/document/create',
        params,
        false,
        { headers: { 'agw-js-conv': 'str' } },
      );
      expect(result).toEqual([mockDocumentInfo]);
    });
  });

  describe('update', () => {
    it('should update a document', async () => {
      const mockResponse = undefined;
      vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params: UpdateDocumentReq = {
        document_id: 'doc-1',
        document_name: 'Updated Document 1',
        update_rule: {
          update_type: 2,
          update_interval: 48,
        },
      };

      await documents.update(params);

      expect(client.post).toHaveBeenCalledWith(
        '/open_api/knowledge/document/update',
        params,
        false,
        { headers: { 'agw-js-conv': 'str' } },
      );
    });
  });

  describe('delete', () => {
    it('should delete documents', async () => {
      const mockResponse = undefined;
      vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params: DeleteDocumentReq = {
        document_ids: ['doc-1', 'doc-2'],
      };

      await documents.delete(params);

      expect(client.post).toHaveBeenCalledWith(
        '/open_api/knowledge/document/delete',
        params,
        false,
        { headers: { 'agw-js-conv': 'str' } },
      );
    });
  });

  describe('list', () => {
    it('should list documents', async () => {
      const mockResponse = {
        total: 2,
        document_infos: [
          {
            char_count: 1000,
            chunk_strategy: { chunk_type: 'token', max_tokens: 500 },
            create_time: 1234567890,
            document_id: 'doc-1',
            format_type: 1,
            hit_count: 5,
            name: 'Document 1',
            size: 2048,
            slice_count: 3,
            status: 1,
            type: 'pdf',
            update_interval: 24,
            update_time: 1234567891,
            update_type: 1,
          },
          {
            char_count: 2000,
            chunk_strategy: { chunk_type: 'token', max_tokens: 500 },
            create_time: 1234567892,
            document_id: 'doc-2',
            format_type: 2,
            hit_count: 10,
            name: 'Document 2',
            size: 4096,
            slice_count: 5,
            status: 1,
            type: 'txt',
            update_interval: 48,
            update_time: 1234567893,
            update_type: 2,
          },
        ],
      };
      vi.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const params: ListDocumentReq = {
        dataset_id: 'dataset-id',
        page: 1,
        page_size: 10,
      };

      const result = await documents.list(params);

      expect(client.get).toHaveBeenCalledWith(
        '/open_api/knowledge/document/list',
        params,
        false,
        { headers: { 'agw-js-conv': 'str' } },
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
