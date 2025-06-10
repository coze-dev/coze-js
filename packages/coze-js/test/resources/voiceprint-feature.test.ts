import { toFormData } from 'axios';

import {
  VoiceprintFeature,
  type CreateVoiceprintFeatureReq,
  type UpdateVoiceprintFeatureReq,
  type ListVoiceprintFeatureReq,
  type SpeakerIdentifyReq,
} from '../../src/resources/audio/voiceprint-groups/features.js';
import { APIClient } from '../../src/core.js';

// Mock axios toFormData function
vi.mock('axios', async () => {
  const actual = await vi.importActual('axios');
  return {
    ...(actual as object),
    toFormData: vi.fn().mockImplementation(data => data),
  };
});

describe('VoiceprintFeature', () => {
  let client: APIClient;
  let voiceprintFeature: VoiceprintFeature;
  const groupId = 'group-123';

  beforeEach(() => {
    client = new APIClient({
      token: 'test-key',
    });
    voiceprintFeature = new VoiceprintFeature(client);
  });

  describe('create', () => {
    it('should create voiceprint feature successfully', async () => {
      const mockResponse = {
        data: {
          id: 'feature-123',
        },
      };
      vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params: CreateVoiceprintFeatureReq = {
        file: new Blob(['audio content'], { type: 'audio/wav' }),
        name: 'Test Feature',
        desc: 'Test Description',
        sample_rate: 16000,
        channel: 1,
      };

      const result = await voiceprintFeature.create(groupId, params);

      expect(toFormData).toHaveBeenCalledWith(params);
      expect(result).to.deep.equal(mockResponse.data);
      expect(client.post).toHaveBeenCalledWith(
        `/v1/audio/voiceprint_groups/${groupId}/features`,
        params,
        false,
        undefined,
      );
    });

    it('should create voiceprint feature with custom options', async () => {
      const mockResponse = {
        data: {
          id: 'feature-123',
        },
      };
      vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params: CreateVoiceprintFeatureReq = {
        file: new Blob(['audio content'], { type: 'audio/wav' }),
        name: 'Test Feature',
      };

      const options = {
        headers: {
          'Custom-Header': 'custom-value',
        },
      };

      const result = await voiceprintFeature.create(groupId, params, options);

      expect(toFormData).toHaveBeenCalledWith(params);
      expect(result).to.deep.equal(mockResponse.data);
      expect(client.post).toHaveBeenCalledWith(
        `/v1/audio/voiceprint_groups/${groupId}/features`,
        params,
        false,
        options,
      );
    });

    it('should handle errors when creating voiceprint feature', async () => {
      const errorMessage = 'Failed to create voiceprint feature';
      vi.spyOn(client, 'post').mockRejectedValue(new Error(errorMessage));

      const params: CreateVoiceprintFeatureReq = {
        file: new Blob(['audio content'], { type: 'audio/wav' }),
        name: 'Test Feature',
      };

      try {
        await voiceprintFeature.create(groupId, params);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toEqual(errorMessage);
      }
    });
  });

  describe('update', () => {
    it('should update voiceprint feature successfully', async () => {
      vi.spyOn(client, 'put').mockResolvedValue({ data: undefined });

      const featureId = 'feature-123';
      const params: UpdateVoiceprintFeatureReq = {
        name: 'Updated Feature Name',
        desc: 'Updated Description',
      };

      await voiceprintFeature.update(groupId, featureId, params);

      expect(toFormData).toHaveBeenCalledWith(params);
      expect(client.put).toHaveBeenCalledWith(
        `/v1/audio/voiceprint_groups/${groupId}/features/${featureId}`,
        params,
        false,
        undefined,
      );
    });

    it('should update voiceprint feature with file and custom options', async () => {
      vi.spyOn(client, 'put').mockResolvedValue({ data: undefined });

      const featureId = 'feature-123';
      const params: UpdateVoiceprintFeatureReq = {
        file: new Blob(['updated audio content'], { type: 'audio/wav' }),
        name: 'Updated Feature Name',
        sample_rate: 16000,
        channel: 1,
      };

      const options = {
        headers: {
          'Custom-Header': 'custom-value',
        },
      };

      await voiceprintFeature.update(groupId, featureId, params, options);

      expect(toFormData).toHaveBeenCalledWith(params);
      expect(client.put).toHaveBeenCalledWith(
        `/v1/audio/voiceprint_groups/${groupId}/features/${featureId}`,
        params,
        false,
        options,
      );
    });

    it('should handle errors when updating voiceprint feature', async () => {
      const errorMessage = 'Failed to update voiceprint feature';
      vi.spyOn(client, 'put').mockRejectedValue(new Error(errorMessage));

      const featureId = 'feature-123';
      const params: UpdateVoiceprintFeatureReq = {
        name: 'Updated Feature Name',
      };

      try {
        await voiceprintFeature.update(groupId, featureId, params);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toEqual(errorMessage);
      }
    });
  });

  describe('delete', () => {
    it('should delete voiceprint feature successfully', async () => {
      vi.spyOn(client, 'delete').mockResolvedValue({ data: undefined });

      const featureId = 'feature-123';

      await voiceprintFeature.delete(groupId, featureId);

      expect(client.delete).toHaveBeenCalledWith(
        `/v1/audio/voiceprint_groups/${groupId}/features/${featureId}`,
        false,
        undefined,
      );
    });

    it('should delete voiceprint feature with custom options', async () => {
      vi.spyOn(client, 'delete').mockResolvedValue({ data: undefined });

      const featureId = 'feature-123';
      const options = {
        headers: {
          'Custom-Header': 'custom-value',
        },
      };

      await voiceprintFeature.delete(groupId, featureId, options);

      expect(client.delete).toHaveBeenCalledWith(
        `/v1/audio/voiceprint_groups/${groupId}/features/${featureId}`,
        false,
        options,
      );
    });

    it('should handle errors when deleting voiceprint feature', async () => {
      const errorMessage = 'Failed to delete voiceprint feature';
      vi.spyOn(client, 'delete').mockRejectedValue(new Error(errorMessage));

      const featureId = 'feature-123';

      try {
        await voiceprintFeature.delete(groupId, featureId);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toEqual(errorMessage);
      }
    });
  });

  describe('list', () => {
    it('should list voiceprint features successfully', async () => {
      const mockResponse = {
        data: {
          items: [
            {
              id: 'feature-123',
              group_id: groupId,
              name: 'Test Feature',
              desc: 'Test Description',
              audio_url: 'https://example.com/audio.wav',
              created_at: 1625097600,
              updated_at: 1625097600,
              user_info: {
                id: 'user-123',
                name: 'Test User',
              },
            },
          ],
          total: 1,
        },
      };
      vi.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const params: ListVoiceprintFeatureReq = {
        page_num: 1,
        page_size: 10,
      };

      const result = await voiceprintFeature.list(groupId, params);

      expect(result).to.deep.equal(mockResponse.data);
      expect(client.get).toHaveBeenCalledWith(
        `/v1/audio/voiceprint_groups/${groupId}/features`,
        params,
        false,
        undefined,
      );
    });

    it('should list voiceprint features with custom options', async () => {
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

      const result = await voiceprintFeature.list(groupId, undefined, options);

      expect(result).to.deep.equal(mockResponse.data);
      expect(client.get).toHaveBeenCalledWith(
        `/v1/audio/voiceprint_groups/${groupId}/features`,
        undefined,
        false,
        options,
      );
    });

    it('should handle errors when listing voiceprint features', async () => {
      const errorMessage = 'Failed to list voiceprint features';
      vi.spyOn(client, 'get').mockRejectedValue(new Error(errorMessage));

      try {
        await voiceprintFeature.list(groupId);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toEqual(errorMessage);
      }
    });
  });

  describe('speakerIdentify', () => {
    it('should identify speaker successfully', async () => {
      const mockResponse = {
        data: {
          feature_score_list: [
            {
              feature_id: 'feature-123',
              feature_name: 'Test Feature',
              feature_desc: 'Test Description',
              score: 0.95,
            },
            {
              feature_id: 'feature-456',
              feature_name: 'Another Feature',
              feature_desc: 'Another Description',
              score: 0.85,
            },
          ],
        },
      };
      vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params: SpeakerIdentifyReq = {
        file: new Blob(['audio content'], { type: 'audio/wav' }),
        top_k: 2,
        sample_rate: 16000,
        channel: 1,
      };

      const result = await voiceprintFeature.speakerIdentify(groupId, params);

      expect(toFormData).toHaveBeenCalledWith(params);
      expect(result).to.deep.equal(mockResponse.data);
      expect(client.post).toHaveBeenCalledWith(
        `/v1/audio/voiceprint_groups/${groupId}/speaker_identify`,
        params,
        false,
        undefined,
      );
    });

    it('should identify speaker with custom options', async () => {
      const mockResponse = {
        data: {
          feature_score_list: [
            {
              feature_id: 'feature-123',
              feature_name: 'Test Feature',
              score: 0.95,
            },
          ],
        },
      };
      vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params: SpeakerIdentifyReq = {
        file: new Blob(['audio content'], { type: 'audio/wav' }),
      };

      const options = {
        headers: {
          'Custom-Header': 'custom-value',
        },
      };

      const result = await voiceprintFeature.speakerIdentify(
        groupId,
        params,
        options,
      );

      expect(toFormData).toHaveBeenCalledWith(params);
      expect(result).to.deep.equal(mockResponse.data);
      expect(client.post).toHaveBeenCalledWith(
        `/v1/audio/voiceprint_groups/${groupId}/speaker_identify`,
        params,
        false,
        options,
      );
    });

    it('should handle errors when identifying speaker', async () => {
      const errorMessage = 'Failed to identify speaker';
      vi.spyOn(client, 'post').mockRejectedValue(new Error(errorMessage));

      const params: SpeakerIdentifyReq = {
        file: new Blob(['audio content'], { type: 'audio/wav' }),
      };

      try {
        await voiceprintFeature.speakerIdentify(groupId, params);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toEqual(errorMessage);
      }
    });
  });
});
