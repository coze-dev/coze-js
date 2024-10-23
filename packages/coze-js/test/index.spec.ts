import { Coze } from '../src/index';
import { fetch } from 'undici';

jest.mock('undici');
jest.mock('uuid', () => ({
  v4: () => 'mocked-uuid',
}));

describe('formatHost Function Tests', () => {
  it('default', () => {
    const coze = new Coze({ api_key: 'x' });
    expect(coze.chatV2).toBeInstanceOf(Function);
    expect(coze.chatV2Streaming).toBeInstanceOf(Function);
    expect(coze.chatV3).toBeInstanceOf(Function);
    expect(coze.chatV3Streaming).toBeInstanceOf(Function);
  });
});

describe('Coze', () => {
  let coze: Coze;

  beforeEach(() => {
    coze = new Coze({ api_key: 'test-api-key' });
  });

  describe('chatV2', () => {
    it('should make a request with correct parameters', async () => {
      const mockResponse = { some: 'data' };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ code: 0, ...mockResponse }),
      });

      const result = await coze.chatV2({
        bot_id: 'test-bot-id',
        query: 'test query',
      });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.coze.com/open_api/v2/chat?conversation_id=mocked-uuid',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            authorization: 'Bearer test-api-key',
            'content-type': 'application/json',
          }),
          body: JSON.stringify({
            bot_id: 'test-bot-id',
            user: 'mocked-uuid',
            query: 'test query',
            stream: false,
          }),
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getBotInfo', () => {
    it('should make a GET request with correct parameters', async () => {
      const mockResponse = { data: { name: 'TestBot' } };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ code: 0, ...mockResponse }),
      });

      const result = await coze.getBotInfo({ bot_id: 'test-bot-id' });

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

  describe('createConversation', () => {
    it('should format payload correctly', async () => {
      const mockResponse = { data: { id: 'conv-id' } };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ code: 0, ...mockResponse }),
      });

      const messages: any[] = [
        { role: 'user', content: 'Hello', content_type: 'text' },
        {
          role: 'assistant',
          content: [{ type: 'text', text: 'Hi' }],
          content_type: 'object_string',
        },
      ];
      const meta_data = { key: 'value' };

      await coze.createConversation({ messages, meta_data });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.coze.com/v1/conversation/create',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            messages: [
              { role: 'user', content: 'Hello', content_type: 'text' },
              {
                role: 'assistant',
                content: JSON.stringify([{ type: 'text', text: 'Hi' }]),
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
