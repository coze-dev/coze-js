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
      jest.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params = {
        messages: [{ role: 'user' as RoleType, content: 'Hello', content_type: 'text' as ContentType }],
        meta_data: { key: 'value' },
      };

      const result = await conversations.create(params);

      expect(client.post).toHaveBeenCalledWith('/v1/conversation/create', params);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('retrieve', () => {
    it('should retrieve a conversation', async () => {
      const mockResponse = { data: { id: 'conversation-id', meta_data: { key: 'value' } } };
      jest.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const conversationId = 'conversation-id';

      const result = await conversations.retrieve(conversationId);

      expect(client.get).toHaveBeenCalledWith(`/v1/conversation/retrieve?conversation_id=${conversationId}`);
      expect(result).toEqual(mockResponse.data);
    });
  });

  // Add more tests for other methods as needed
});
