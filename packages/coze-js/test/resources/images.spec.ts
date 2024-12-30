import { Images } from '../../src/resources/datasets/images/images';
import { CozeAPI } from '../../src/index';

describe('Images', () => {
  let client: CozeAPI;
  let images: Images;

  beforeEach(() => {
    client = new CozeAPI({ token: 'test-token' });
    images = new Images(client);
  });

  describe('update', () => {
    it('should update image caption', async () => {
      const mockResponse = undefined;
      vi.spyOn(client, 'put').mockResolvedValue(mockResponse);

      const datasetId = 'test-dataset-id';
      const documentId = 'test-document-id';
      const params = {
        caption: 'Updated image description',
      };

      await images.update(datasetId, documentId, params);

      expect(client.put).toHaveBeenCalledWith(
        `/v1/datasets/${datasetId}/images/${documentId}`,
        params,
        false,
        undefined,
      );
    });
  });

  describe('list', () => {
    it('should list images with default parameters', async () => {
      const mockResponse = {
        data: {
          photo_infos: [
            {
              url: 'https://example.com/image.jpg',
              name: 'test-image.jpg',
              size: 1024,
              type: 'jpg',
              status: 1,
              caption: 'Test image',
              creator_id: 'user-1',
              create_time: 1234567890,
              document_id: 'doc-1',
              source_type: 0,
              update_time: 1234567890,
            },
          ],
          total_count: 1,
        },
      };
      vi.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const datasetId = 'test-dataset-id';
      const result = await images.list(datasetId);

      expect(client.get).toHaveBeenCalledWith(
        `/v1/datasets/${datasetId}/images`,
        undefined,
        false,
        undefined,
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should list images with custom parameters', async () => {
      const mockResponse = {
        data: {
          photo_infos: [],
          total_count: 0,
        },
      };
      vi.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const datasetId = 'test-dataset-id';
      const params = {
        page_num: 2,
        page_size: 20,
        keyword: 'test',
        has_caption: true,
      };

      const result = await images.list(datasetId, params);

      expect(client.get).toHaveBeenCalledWith(
        `/v1/datasets/${datasetId}/images`,
        params,
        false,
        undefined,
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});
