import {
  VoiceprintGroups,
  type CreateVoiceprintGroupReq,
  type ListVoiceprintGroupReq,
  type UpdateVoiceprintGroupReq,
} from '../../src/resources/audio/voiceprint-groups/index.js';
import { APIClient } from '../../src/core.js';

describe('VoiceprintGroups', () => {
  let client: APIClient;
  let voiceprintGroups: VoiceprintGroups;

  beforeEach(() => {
    client = new APIClient({
      token: 'test-key',
    });
    voiceprintGroups = new VoiceprintGroups(client);
  });

  describe('create', () => {
    it('should create voiceprint group successfully', async () => {
      const mockResponse = {
        data: {
          id: 'group-123',
        },
      };
      vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params: CreateVoiceprintGroupReq = {
        name: 'Test Group',
        desc: 'Test Description',
        coze_account_id: 'account-123',
      };

      const result = await voiceprintGroups.create(params);

      expect(result).to.deep.equal(mockResponse.data);
      expect(client.post).toHaveBeenCalledWith(
        '/v1/audio/voiceprint_groups',
        params,
        false,
        undefined,
      );
    });

    it('should create voiceprint group with custom options', async () => {
      const mockResponse = {
        data: {
          id: 'group-123',
        },
      };
      vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params: CreateVoiceprintGroupReq = {
        name: 'Test Group',
      };

      const options = {
        headers: {
          'Custom-Header': 'custom-value',
        },
      };

      const result = await voiceprintGroups.create(params, options);

      expect(result).to.deep.equal(mockResponse.data);
      expect(client.post).toHaveBeenCalledWith(
        '/v1/audio/voiceprint_groups',
        params,
        false,
        options,
      );
    });

    it('should handle errors when creating voiceprint group', async () => {
      const errorMessage = 'Failed to create voiceprint group';
      vi.spyOn(client, 'post').mockRejectedValue(new Error(errorMessage));

      const params: CreateVoiceprintGroupReq = {
        name: 'Test Group',
      };

      try {
        await voiceprintGroups.create(params);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toEqual(errorMessage);
      }
    });
  });

  describe('list', () => {
    it('should list voiceprint groups successfully', async () => {
      const mockResponse = {
        data: {
          items: [
            {
              id: 'group-123',
              name: 'Test Group',
              desc: 'Test Description',
              created_at: 1625097600,
              updated_at: 1625097600,
              user_info: {
                id: 'user-123',
                name: 'Test User',
              },
              feature_count: 2,
            },
          ],
          total: 1,
        },
      };
      vi.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const params: ListVoiceprintGroupReq = {
        coze_account_id: 'account-123',
        page_num: 1,
        page_size: 10,
        name: 'Test',
      };

      const result = await voiceprintGroups.list(params);

      expect(result).to.deep.equal(mockResponse.data);
      expect(client.get).toHaveBeenCalledWith(
        '/v1/audio/voiceprint_groups',
        params,
        false,
        undefined,
      );
    });

    it('should list voiceprint groups with custom options', async () => {
      const mockResponse = {
        data: {
          items: [],
          total: 0,
        },
      };
      vi.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const options = {
        headers: {
          'Custom-Header': 'custom-value',
        },
      };

      const result = await voiceprintGroups.list(undefined, options);

      expect(result).to.deep.equal(mockResponse.data);
      expect(client.get).toHaveBeenCalledWith(
        '/v1/audio/voiceprint_groups',
        undefined,
        false,
        options,
      );
    });

    it('should handle errors when listing voiceprint groups', async () => {
      const errorMessage = 'Failed to list voiceprint groups';
      vi.spyOn(client, 'get').mockRejectedValue(new Error(errorMessage));

      try {
        await voiceprintGroups.list();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toEqual(errorMessage);
      }
    });
  });

  describe('update', () => {
    it('should update voiceprint group successfully', async () => {
      vi.spyOn(client, 'put').mockResolvedValue({ data: undefined });

      const groupId = 'group-123';
      const params: UpdateVoiceprintGroupReq = {
        name: 'Updated Group Name',
        desc: 'Updated Description',
      };

      await voiceprintGroups.update(groupId, params);

      expect(client.put).toHaveBeenCalledWith(
        `/v1/audio/voiceprint_groups/${groupId}`,
        params,
        false,
        undefined,
      );
    });

    it('should update voiceprint group with custom options', async () => {
      vi.spyOn(client, 'put').mockResolvedValue({ data: undefined });

      const groupId = 'group-123';
      const params: UpdateVoiceprintGroupReq = {
        name: 'Updated Group Name',
      };

      const options = {
        headers: {
          'Custom-Header': 'custom-value',
        },
      };

      await voiceprintGroups.update(groupId, params, options);

      expect(client.put).toHaveBeenCalledWith(
        `/v1/audio/voiceprint_groups/${groupId}`,
        params,
        false,
        options,
      );
    });

    it('should handle errors when updating voiceprint group', async () => {
      const errorMessage = 'Failed to update voiceprint group';
      vi.spyOn(client, 'put').mockRejectedValue(new Error(errorMessage));

      const groupId = 'group-123';
      const params: UpdateVoiceprintGroupReq = {
        name: 'Updated Group Name',
      };

      try {
        await voiceprintGroups.update(groupId, params);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toEqual(errorMessage);
      }
    });
  });

  describe('delete', () => {
    it('should delete voiceprint group successfully', async () => {
      vi.spyOn(client, 'delete').mockResolvedValue({ data: undefined });

      const groupId = 'group-123';

      await voiceprintGroups.delete(groupId);

      expect(client.delete).toHaveBeenCalledWith(
        `/v1/audio/voiceprint_groups/${groupId}`,
        false,
        undefined,
      );
    });

    it('should delete voiceprint group with custom options', async () => {
      vi.spyOn(client, 'delete').mockResolvedValue({ data: undefined });

      const groupId = 'group-123';
      const options = {
        headers: {
          'Custom-Header': 'custom-value',
        },
      };

      await voiceprintGroups.delete(groupId, options);

      expect(client.delete).toHaveBeenCalledWith(
        `/v1/audio/voiceprint_groups/${groupId}`,
        false,
        options,
      );
    });

    it('should handle errors when deleting voiceprint group', async () => {
      const errorMessage = 'Failed to delete voiceprint group';
      vi.spyOn(client, 'delete').mockRejectedValue(new Error(errorMessage));

      const groupId = 'group-123';

      try {
        await voiceprintGroups.delete(groupId);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toEqual(errorMessage);
      }
    });
  });
});
