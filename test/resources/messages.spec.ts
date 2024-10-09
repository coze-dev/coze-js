import { CozeAPI, RoleType } from '../../src/index';
import { type Messages } from '../../src/resources/conversations/messages/messages';
import { fetch } from 'undici';

jest.mock('undici');

describe('Messages', () => {
  let coze: CozeAPI;
  let messages: Messages;

  beforeEach(() => {
    coze = new CozeAPI({ token: 'test-api-key' });
    messages = coze.conversations.messages;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a message', async () => {
      const mockResponse = { data: { id: 'msg_123', content: 'Hello' } };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ code: 0, ...mockResponse }),
      });

      const result = await messages.create('conv_123', {
        role: RoleType.User,
        content: 'Hello',
        content_type: 'text',
        meta_data: {},
      });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.coze.com/v1/conversation/message/create?conversation_id=conv_123',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            authorization: 'Bearer test-api-key',
            'content-type': 'application/json',
          }),
          body: JSON.stringify({
            role: 'user',
            content: 'Hello',
            content_type: 'text',
            meta_data: {},
          }),
        }),
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('update', () => {
    it('should update a message', async () => {
      const mockResponse = { message: { id: 'msg_123', content: 'Updated Hello' } };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ code: 0, ...mockResponse }),
      });

      const result = await messages.update('conv_123', 'msg_123', {
        content: 'Updated Hello',
        content_type: 'text',
      });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.coze.com/v1/conversation/message/modify?conversation_id=conv_123&message_id=msg_123',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            authorization: 'Bearer test-api-key',
            'content-type': 'application/json',
          }),
          body: JSON.stringify({
            content: 'Updated Hello',
            content_type: 'text',
          }),
        }),
      );
      expect(result).toEqual(mockResponse.message);
    });
  });

  describe('retrieve', () => {
    it('should retrieve a message', async () => {
      const mockResponse = { data: { id: 'msg_123', content: 'Hello' } };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ code: 0, ...mockResponse }),
      });

      const result = await messages.retrieve('conv_123', 'msg_123');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.coze.com/v1/conversation/message/retrieve?conversation_id=conv_123&message_id=msg_123',
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

  describe('list', () => {
    it('should list messages', async () => {
      const mockResponse = { data: { messages: [{ id: 'msg_123', content: 'Hello' }] } };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ code: 0, ...mockResponse }),
      });

      const result = await messages.list('conv_123', { limit: 10 });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.coze.com/v1/conversation/message/list?conversation_id=conv_123&limit=10',
        expect.objectContaining({
          method: 'GET',
          headers: {
            authorization: 'Bearer test-api-key',
            'agw-js-conv': 'str',
          },
        }),
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('delete', () => {
    it('should delete a message', async () => {
      const mockResponse = { data: [{ id: 'msg_123', content: 'Deleted' }] };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ code: 0, ...mockResponse }),
      });

      const result = await messages.delete('conv_123', 'msg_123');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.coze.com/v1/conversation/message/delete?conversation_id=conv_123&message_id=msg_123',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            authorization: 'Bearer test-api-key',
          }),
        }),
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});
