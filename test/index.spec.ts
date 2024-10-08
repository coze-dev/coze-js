import { CozeAPI } from '../src/index';
import { fetch } from 'undici';
import { type EnterMessage } from '../src/resources';

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
        additional_messages: [{ role: 'user', content: 'test query' }],
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

  describe('bots.retrieve', () => {
    it('should make a GET request with correct parameters', async () => {
      const mockResponse = { data: { name: 'TestBot' } };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ code: 0, ...mockResponse }),
      });

      const result = await coze.bots.retrieve({ bot_id: 'test-bot-id' });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.coze.com/v1/bot/get_online_info?bot_id=test-bot-id',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            authorization: 'Bearer test-api-key',
          }),
        }),
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('conversations.create', () => {
    it('should format payload correctly', async () => {
      const mockResponse = { data: { id: 'conv-id' } };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ code: 0, ...mockResponse }),
      });

      const messages: EnterMessage[] = [
        { role: 'user', content: 'Hello', content_type: 'text' },
        {
          role: 'assistant',
          content: [{ type: 'text', text: 'Hi' }],
          content_type: 'object_string',
        },
      ];
      const meta_data = { key: 'value' };

      await coze.conversations.create({ messages, meta_data });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.coze.com/v1/conversation/create',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            messages: [
              { role: 'user', content: 'Hello', content_type: 'text' },
              {
                role: 'assistant',
                content: [{ type: 'text', text: 'Hi' }],
                content_type: 'object_string',
              },
            ],
            meta_data: { key: 'value' },
          }),
        }),
      );
    });
  });
});
