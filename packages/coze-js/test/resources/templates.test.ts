import {
  Templates,
  TemplateEntityType,
} from '../../src/resources/templates/templates.js';
import { APIClient } from '../../src/core.js';

describe('Templates', () => {
  let client: APIClient;
  let templates: Templates;

  beforeEach(() => {
    client = new APIClient({
      token: 'test-key',
    });
    templates = new Templates(client);
  });

  describe('duplicate', () => {
    it('should duplicate a template successfully', async () => {
      const mockResponse = {
        data: {
          entity_id: 'new-template-123',
          entity_type: TemplateEntityType.AGENT,
        },
      };
      vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const templateId = 'template-123';
      const params = {
        workspace_id: 'workspace-123',
        name: 'Duplicated Template',
      };

      const result = await templates.duplicate(templateId, params);

      expect(result).to.deep.equal(mockResponse.data);
      expect(client.post).toHaveBeenCalledWith(
        `/v1/templates/${templateId}/duplicate`,
        params,
        false,
        undefined,
      );
    });

    it('should duplicate a template without optional name parameter', async () => {
      const mockResponse = {
        data: {
          entity_id: 'new-template-123',
          entity_type: TemplateEntityType.AGENT,
        },
      };

      vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const templateId = 'template-123';
      const params = {
        workspace_id: 'workspace-123',
      };

      const result = await templates.duplicate(templateId, params);

      expect(result).to.deep.equal(mockResponse.data);
      expect(client.post).toHaveBeenCalledWith(
        `/v1/templates/${templateId}/duplicate`,
        params,
        false,
        undefined,
      );
    });

    it('should handle errors when duplicating a template', async () => {
      const errorMessage = 'Template not found';
      vi.spyOn(client, 'post').mockRejectedValue(new Error(errorMessage));

      const templateId = 'non-existent-template';
      const params = {
        workspace_id: 'workspace-123',
      };

      try {
        await templates.duplicate(templateId, params);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toEqual(errorMessage);
      }
    });
  });
});
