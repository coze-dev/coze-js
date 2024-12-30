import { Datasets } from '../../src/resources/datasets';
import { CozeAPI } from '../../src/index';

describe('Datasets', () => {
  let client: CozeAPI;
  let datasets: Datasets;

  beforeEach(() => {
    client = new CozeAPI({ token: 'test-token' });
    datasets = new Datasets(client);
  });

  describe('create', () => {
    it('should create a dataset', async () => {
      const mockResponse = { data: { dataset_id: 'test-dataset-id' } };
      vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params = {
        name: 'Test Dataset',
        space_id: 'test-space-id',
        format_type: 0,
        description: 'Test description',
        file_id: 'test-file-id',
      };

      const result = await datasets.create(params);

      expect(client.post).toHaveBeenCalledWith(
        '/v1/datasets',
        params,
        false,
        undefined,
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('list', () => {
    it('should list datasets', async () => {
      const mockResponse = {
        data: {
          dataset_id: 'test-dataset-id',
        },
      };
      vi.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const params = {
        space_id: 'test-space-id',
        name: 'Test Dataset',
        format_type: 0,
        page_num: 1,
        page_size: 10,
      };

      const result = await datasets.list(params);

      expect(client.get).toHaveBeenCalledWith(
        '/v1/datasets',
        params,
        false,
        undefined,
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('update', () => {
    it('should update a dataset', async () => {
      const mockResponse = undefined;
      vi.spyOn(client, 'put').mockResolvedValue(mockResponse);

      const datasetId = 'test-dataset-id';
      const params = {
        name: 'Updated Dataset',
        description: 'Updated description',
        file_id: 'updated-file-id',
      };

      await datasets.update(datasetId, params);

      expect(client.put).toHaveBeenCalledWith(
        `/v1/datasets/${datasetId}`,
        params,
        false,
        undefined,
      );
    });
  });

  describe('delete', () => {
    it('should delete a dataset', async () => {
      const mockResponse = undefined;
      vi.spyOn(client, 'delete').mockResolvedValue(mockResponse);

      const datasetId = 'test-dataset-id';

      await datasets.delete(datasetId);

      expect(client.delete).toHaveBeenCalledWith(
        `/v1/datasets/${datasetId}`,
        false,
        undefined,
      );
    });
  });

  describe('process', () => {
    it('should process a dataset', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              url: 'test-url',
              size: 1024,
              type: 'pdf',
              status: 0,
              progress: 50,
              update_type: 0,
              document_name: 'test.pdf',
              remaining_time: 30,
            },
          ],
        },
      };
      vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const datasetId = 'test-dataset-id';
      const params = {
        document_ids: ['doc-1', 'doc-2'],
      };

      const result = await datasets.process(datasetId, params);

      expect(client.post).toHaveBeenCalledWith(
        `/v1/datasets/${datasetId}/process`,
        params,
        false,
        undefined,
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('sub-resources', () => {
    it('should have documents sub-resource', () => {
      expect(datasets.documents).toBeDefined();
    });

    it('should have images sub-resource', () => {
      expect(datasets.images).toBeDefined();
    });
  });
});
