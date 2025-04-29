import { Users } from '../../src/resources/users/index';
import { CozeAPI } from '../../src/index';

describe('Users', () => {
  let client: CozeAPI;
  let users: Users;

  beforeEach(() => {
    client = new CozeAPI({ token: 'test-token' });
    users = new Users(client);
  });

  describe('me', () => {
    it('should get current user information', async () => {
      const mockResponse = {
        data: {
          user_id: 'test-user-id',
          user_name: 'testuser',
          nick_name: 'Test User',
          avatar_url: 'https://example.com/avatar.png',
        },
      };
      vi.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const result = await users.me();

      expect(client.get).toHaveBeenCalledWith(
        '/v1/users/me',
        undefined,
        false,
        undefined,
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should get current user information with options', async () => {
      const mockResponse = {
        data: {
          user_id: 'test-user-id',
          user_name: 'testuser',
          nick_name: 'Test User',
          avatar_url: 'https://example.com/avatar.png',
        },
      };
      vi.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const options = { headers: { 'X-Custom-Header': 'value' } };
      const result = await users.me(options);

      expect(client.get).toHaveBeenCalledWith(
        '/v1/users/me',
        undefined,
        false,
        options,
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});
