import * as utils from '../../src/utils';
import {
  WorkSpaces,
  type ListWorkSpacesReq,
  type OpenSpaceData,
} from '../../src/resources/workspaces/workspaces';
import { CozeAPI } from '../../src/index';

vi.mock('../../src/utils', () => ({
  safeJsonParse: vi.fn(),
  isBrowser: vi.fn(),
}));

describe('Workspaces', () => {
  let client: CozeAPI;
  let workspaces: WorkSpaces;

  beforeEach(() => {
    client = new CozeAPI({ token: 'test-token' });
    workspaces = new WorkSpaces(client);
  });

  describe('list', () => {
    it('should list workspaces', async () => {
      const mockOpenSpaceData: OpenSpaceData = {
        workspaces: [
          {
            id: 'workspace-1',
            name: 'Workspace 1',
            icon_url: 'https://example.com/icon1.png',
            role_type: 'admin',
            workspace_type: 'team',
          },
          {
            id: 'workspace-2',
            name: 'Workspace 2',
            icon_url: 'https://example.com/icon2.png',
            role_type: 'member',
            workspace_type: 'personal',
          },
        ],
        total_count: 2,
      };

      const mockResponse = JSON.stringify({ data: mockOpenSpaceData });
      vi.spyOn(client, 'get').mockResolvedValue(mockResponse);
      (utils.safeJsonParse as vi.Mock).mockReturnValue({
        data: mockOpenSpaceData,
      });

      const params: ListWorkSpacesReq = {
        page_num: 1,
        page_size: 10,
      };

      const result = await workspaces.list(params);

      expect(client.get).toHaveBeenCalledWith(
        '/v1/workspaces',
        params,
        false,
        undefined,
      );
      expect(result).toEqual(mockOpenSpaceData);
    });

    it('should use default values when params are not provided', async () => {
      const mockOpenSpaceData: OpenSpaceData = {
        workspaces: [],
        total_count: 0,
      };

      const mockResponse = JSON.stringify({ data: mockOpenSpaceData });
      vi.spyOn(client, 'get').mockResolvedValue(mockResponse);
      (utils.safeJsonParse as vi.Mock).mockReturnValue({
        data: mockOpenSpaceData,
      });

      await workspaces.list({});

      expect(client.get).toHaveBeenCalledWith(
        '/v1/workspaces',
        {},
        false,
        undefined,
      );
    });
  });
});
