import {
  Variables,
  type VariableUpdateReq,
  type VariableRetrieveReq,
} from '../../src/resources/variables/variables.js';
import { APIClient } from '../../src/core.js';

describe('Variables', () => {
  let client: APIClient;
  let variables: Variables;

  beforeEach(() => {
    client = new APIClient({
      token: 'test-key',
    });
    variables = new Variables(client);
  });

  describe('update', () => {
    it('should update variables successfully', async () => {
      vi.spyOn(client, 'put').mockResolvedValue({ data: undefined });

      const params: VariableUpdateReq = {
        app_id: 'app-123',
        connector_id: '1024',
        connector_uid: 'user-123',
        data: [
          {
            keyword: 'testVariable',
            value: 'testValue',
          },
        ],
      };

      await variables.update(params);

      expect(client.put).toHaveBeenCalledWith(
        '/v1/variables',
        params,
        false,
        undefined,
      );
    });

    it('should update variables with bot_id instead of app_id', async () => {
      vi.spyOn(client, 'put').mockResolvedValue({ data: undefined });

      const params: VariableUpdateReq = {
        bot_id: 'bot-123',
        connector_id: '999',
        connector_uid: 'user-123',
        data: [
          {
            keyword: 'testVariable',
            value: 'testValue',
          },
        ],
      };

      await variables.update(params);

      expect(client.put).toHaveBeenCalledWith(
        '/v1/variables',
        params,
        false,
        undefined,
      );
    });

    it('should update variables with custom options', async () => {
      vi.spyOn(client, 'put').mockResolvedValue({ data: undefined });

      const params: VariableUpdateReq = {
        app_id: 'app-123',
        data: [
          {
            keyword: 'testVariable',
            value: 'testValue',
          },
        ],
      };

      const options = {
        headers: {
          'Custom-Header': 'custom-value',
        },
      };

      await variables.update(params, options);

      expect(client.put).toHaveBeenCalledWith(
        '/v1/variables',
        params,
        false,
        options,
      );
    });

    it('should handle errors when updating variables', async () => {
      const errorMessage = 'Failed to update variables';
      vi.spyOn(client, 'put').mockRejectedValue(new Error(errorMessage));

      const params: VariableUpdateReq = {
        app_id: 'app-123',
        data: [
          {
            keyword: 'testVariable',
            value: 'testValue',
          },
        ],
      };

      try {
        await variables.update(params);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toEqual(errorMessage);
      }
    });
  });

  describe('retrieve', () => {
    it('should retrieve variables successfully', async () => {
      const mockResponse = {
        data: {
          items: [
            {
              keyword: 'testVariable',
              value: 'testValue',
              create_time: 1625097600,
              update_time: 1625097600,
            },
          ],
        },
      };
      vi.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const params: VariableRetrieveReq = {
        app_id: 'app-123',
        connector_id: '1024',
        connector_uid: 'user-123',
        keywords: ['testVariable'],
      };

      const result = await variables.retrieve(params);

      expect(result).to.deep.equal(mockResponse.data);
      expect(client.get).toHaveBeenCalledWith(
        '/v1/variables',
        params,
        false,
        undefined,
      );
    });

    it('should retrieve variables with bot_id instead of app_id', async () => {
      const mockResponse = {
        data: {
          items: [
            {
              keyword: 'testVariable',
              value: 'testValue',
              create_time: 1625097600,
              update_time: 1625097600,
            },
          ],
        },
      };
      vi.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const params: VariableRetrieveReq = {
        bot_id: 'bot-123',
        connector_id: '999',
        connector_uid: 'user-123',
      };

      const result = await variables.retrieve(params);

      expect(result).to.deep.equal(mockResponse.data);
      expect(client.get).toHaveBeenCalledWith(
        '/v1/variables',
        params,
        false,
        undefined,
      );
    });

    it('should retrieve variables with custom options', async () => {
      const mockResponse = {
        data: {
          items: [
            {
              keyword: 'testVariable',
              value: 'testValue',
              create_time: 1625097600,
              update_time: 1625097600,
            },
          ],
        },
      };
      vi.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const params: VariableRetrieveReq = {
        app_id: 'app-123',
      };

      const options = {
        headers: {
          'Custom-Header': 'custom-value',
        },
      };

      const result = await variables.retrieve(params, options);

      expect(result).to.deep.equal(mockResponse.data);
      expect(client.get).toHaveBeenCalledWith(
        '/v1/variables',
        params,
        false,
        options,
      );
    });

    it('should handle empty response when retrieving variables', async () => {
      const mockResponse = {
        data: {
          items: [],
        },
      };
      vi.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const params: VariableRetrieveReq = {
        app_id: 'app-123',
        keywords: ['nonExistentVariable'],
      };

      const result = await variables.retrieve(params);

      expect(result).to.deep.equal(mockResponse.data);
      expect(result.items).to.be.an('array').that.is.empty;
    });

    it('should handle errors when retrieving variables', async () => {
      const errorMessage = 'Failed to retrieve variables';
      vi.spyOn(client, 'get').mockRejectedValue(new Error(errorMessage));

      const params: VariableRetrieveReq = {
        app_id: 'app-123',
      };

      try {
        await variables.retrieve(params);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toEqual(errorMessage);
      }
    });
  });
});
