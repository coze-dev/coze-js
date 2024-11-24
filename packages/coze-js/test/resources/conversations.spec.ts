import { Conversations } from '../../src/resources/conversations/index';
import { CozeAPI, type RoleType, type ContentType } from '../../src/index';

describe('Conversations', () => {
  let client: CozeAPI;
  let conversations: Conversations;

  beforeEach(() => {
    client = new CozeAPI({ token: 'test-token' });
    conversations = new Conversations(client);
  });

  describe('create', () => {
    it('should create a conversation', async () => {
      const mockResponse = { data: { id: 'conversation-id' } };
      vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params = {
        messages: [
          {
            role: 'user' as RoleType,
            content: 'Hello',
            content_type: 'text' as ContentType,
          },
        ],
        meta_data: { key: 'value' },
      };

      const result = await conversations.create(params);

      expect(client.post).toHaveBeenCalledWith(
        '/v1/conversation/create',
        params,
        false,
        undefined,
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('retrieve', () => {
    it('should retrieve a conversation', async () => {
      const mockResponse = {
        data: { id: 'conversation-id', meta_data: { key: 'value' } },
      };
      vi.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const conversationId = 'conversation-id';

      const result = await conversations.retrieve(conversationId);

      expect(client.get).toHaveBeenCalledWith(
        `/v1/conversation/retrieve?conversation_id=${conversationId}`,
        null,
        false,
        undefined,
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('list', () => {
    it('should list conversations', async () => {
      const mockResponse = { data: { id: 'conversation-id' } };
      vi.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const params = {
        bot_id: 'test-bot-id',
      };

      const result = await conversations.list(params);

      expect(client.get).toHaveBeenCalledWith(
        '/v1/conversations',
        params,
        false,
        undefined,
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('clear', () => {
    it('should clear a conversation', async () => {
      const mockResponse = { data: { id: 'conversation-id' } };
      vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const conversationId = 'conversation-id';

      const result = await conversations.clear(conversationId);

      expect(client.post).toHaveBeenCalledWith(
        `/v1/conversations/${conversationId}/clear`,
        null,
        false,
        undefined,
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  // Add more tests for other methods as needed
});
