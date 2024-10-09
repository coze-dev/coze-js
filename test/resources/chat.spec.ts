import { CozeAPI } from '../../src/index';
import { fetch } from 'undici';
import { RoleType, type EnterMessage } from '../../src/resources';

jest.mock('undici');
jest.mock('uuid', () => ({
  v4: () => 'mocked-uuid',
}));

describe('formatHost Function Tests', () => {
  it('default', () => {
    const coze = new CozeAPI({ token: 'test-api-key' });
    expect(coze.chat.stream).toBeInstanceOf(Function);
    expect(coze.chat.create).toBeInstanceOf(Function);
  });
});

describe('Coze', () => {
  let coze: CozeAPI;

  beforeEach(() => {
    coze = new CozeAPI({ token: 'test-api-key' });
  });

  describe('chat.stream', () => {
    it('should make a request with correct parameters', async () => {
      const mockResponse = { some: 'data' };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ code: 0, data: mockResponse }),
      });

      const result = await coze.chat.create({
        conversation_id: 'mocked-uuid',
        bot_id: 'test-bot-id',
        user_id: 'test-user-id',
        additional_messages: [{ role: RoleType.User, content: 'test query' }],
      });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.coze.com/v3/chat?conversation_id=mocked-uuid',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            authorization: 'Bearer test-api-key',
            'content-type': 'application/json',
          }),
          body: JSON.stringify({
            bot_id: 'test-bot-id',
            user_id: 'test-user-id',
            additional_messages: [{ role: 'user', content: 'test query' }],
            stream: false,
          }),
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('chat.create', () => {
    it('should handle errors correctly', async () => {
      const errorResponse = { code: 400, message: 'Bad Request' };
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        headers: { get: () => 'application/json' },
        text: () => Promise.resolve(JSON.stringify(errorResponse)),
        json: () => Promise.resolve(errorResponse),
      });

      await expect(
        coze.chat.create({
          conversation_id: 'mocked-uuid',
          bot_id: 'test-bot-id',
          user_id: 'test-user-id',
          additional_messages: [{ role: RoleType.User, content: 'test query' }],
        }),
      ).rejects.toThrow('Bad Request');

      expect(fetch).toHaveBeenCalled();
    });
  });

  describe('chat.retrieve', () => {
    it('should retrieve chat data correctly', async () => {
      const mockResponse = {
        id: 'chat-id',
        conversation_id: 'conversation-id',
        bot_id: 'bot-id',
        user_id: 'user-id',
        messages: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi there!' },
        ],
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ data: mockResponse }),
      });

      const result = await coze.chat.retrieve('conversation-id', 'chat-id');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.coze.com/v3/chat/retrieve?conversation_id=conversation-id&chat_id=chat-id',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            authorization: 'Bearer test-api-key',
          }),
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when retrieving chat data', async () => {
      const errorResponse = { code: 404, message: 'Chat not found' };
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        headers: { get: () => 'application/json' },
        text: () => Promise.resolve(JSON.stringify(errorResponse)),
        json: () => Promise.resolve(errorResponse),
      });

      await expect(coze.chat.retrieve('non-existent-conversation', 'non-existent-chat')).rejects.toThrow('Chat not found');

      expect(fetch).toHaveBeenCalled();
    });
  });

  describe('chat.history', () => {
    it('should retrieve chat history correctly', async () => {
      const mockResponse = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there!' },
        { role: 'user', content: 'How are you?' },
        { role: 'assistant', content: "I'm doing well, thank you for asking!" },
      ];

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ data: mockResponse }),
      });

      const result = await coze.chat.history('conversation-id', 'chat-id');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.coze.com/v3/chat/message/list?conversation_id=conversation-id&chat_id=chat-id',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            authorization: 'Bearer test-api-key',
          }),
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when retrieving chat history', async () => {
      const errorResponse = { code: 404, message: 'Chat history not found' };
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        headers: { get: () => 'application/json' },
        text: () => Promise.resolve(JSON.stringify(errorResponse)),
        json: () => Promise.resolve(errorResponse),
      });

      await expect(coze.chat.history('non-existent-conversation', 'non-existent-chat')).rejects.toThrow('Chat history not found');

      expect(fetch).toHaveBeenCalled();
    });
  });
  describe('chat.cancel', () => {
    it('should cancel a chat correctly', async () => {
      const mockResponse = {
        id: 'chat-id',
        conversation_id: 'conversation-id',
        status: 'cancelled',
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ data: mockResponse }),
      });

      const result = await coze.chat.cancel('conversation-id', 'chat-id');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.coze.com/v3/chat/cancel',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            authorization: 'Bearer test-api-key',
            'content-type': 'application/json',
          }),
          body: JSON.stringify({ conversation_id: 'conversation-id', chat_id: 'chat-id' }),
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when cancelling a chat', async () => {
      const errorResponse = { code: 404, message: 'Chat not found' };
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        headers: { get: () => 'application/json' },
        text: () => Promise.resolve(JSON.stringify(errorResponse)),
        json: () => Promise.resolve(errorResponse),
      });

      await expect(coze.chat.cancel('non-existent-conversation', 'non-existent-chat')).rejects.toThrow('Chat not found');

      expect(fetch).toHaveBeenCalled();
    });
  });
});
