import { RoleType, type ChatV3Message } from '../../src/resources/index';
import {
  Messages,
  type CreateMessageReq,
  type UpdateMessageReq,
  type ListMessageReq,
  type ListMessageData,
} from '../../src/resources/conversations/messages/messages';
import { CozeAPI } from '../../src/index';

describe('Messages', () => {
  let client: CozeAPI;
  let messages: Messages;

  beforeEach(() => {
    client = new CozeAPI({ token: 'test-token' });
    messages = new Messages(client);
  });

  describe('create', () => {
    it('should create a message', async () => {
      const mockMessage: ChatV3Message = {
        id: 'msg-1',
        role: RoleType.User,
        content: 'Hello, world!',
        content_type: 'text',
        conversation_id: 'conv-1',
        bot_id: 'bot-1',
        chat_id: 'chat-1',
        meta_data: {},
        created_at: 1234567890,
        updated_at: 1234567890,
        type: 'question',
      };

      const mockResponse = { data: mockMessage };
      jest.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params: CreateMessageReq = {
        role: RoleType.User,
        content: 'Hello, world!',
        content_type: 'text',
        meta_data: {},
      };

      const result = await messages.create('conv-1', params);

      expect(client.post).toHaveBeenCalledWith(
        '/v1/conversation/message/create?conversation_id=conv-1',
        params,
        false,
        undefined,
      );
      expect(result).toEqual(mockMessage);
    });
  });

  describe('update', () => {
    it('should update a message', async () => {
      const mockMessage: ChatV3Message = {
        id: 'msg-1',
        role: RoleType.User,
        content: 'Updated message',
        content_type: 'text',
        conversation_id: 'conv-1',
        bot_id: 'bot-1',
        chat_id: 'chat-1',
        meta_data: {},
        created_at: 1234567890,
        updated_at: 1234567890,
        type: 'question',
      };

      const mockResponse = { message: mockMessage };
      jest.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params: UpdateMessageReq = {
        content: 'Updated message',
      };

      const result = await messages.update('conv-1', 'msg-1', params);

      expect(client.post).toHaveBeenCalledWith(
        '/v1/conversation/message/modify?conversation_id=conv-1&message_id=msg-1',
        params,
        false,
        undefined,
      );
      expect(result).toEqual(mockMessage);
    });
  });

  describe('retrieve', () => {
    it('should retrieve a message', async () => {
      const mockMessage: ChatV3Message = {
        id: 'msg-1',
        role: RoleType.User,
        content: 'Hello, world!',
        content_type: 'text',
        conversation_id: 'conv-1',
        bot_id: 'bot-1',
        chat_id: 'chat-1',
        meta_data: {},
        created_at: 1234567890,
        updated_at: 1234567890,
        type: 'question',
      };

      const mockResponse = { data: mockMessage };
      jest.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const result = await messages.retrieve('conv-1', 'msg-1');

      expect(client.get).toHaveBeenCalledWith(
        '/v1/conversation/message/retrieve?conversation_id=conv-1&message_id=msg-1',
        null,
        false,
        undefined,
      );
      expect(result).toEqual(mockMessage);
    });
  });

  describe('list', () => {
    it('should list messages', async () => {
      const mockListData: ListMessageData = {
        data: [
          {
            id: 'msg-1',
            role: RoleType.User,
            content: 'Hello',
            content_type: 'text',
            conversation_id: 'conv-1',
            bot_id: 'bot-1',
            chat_id: 'chat-1',
            meta_data: {},
            created_at: 1234567890,
            updated_at: 1234567890,
            type: 'question',
          },
          {
            id: 'msg-2',
            role: RoleType.Assistant,
            content: 'Hi there!',
            content_type: 'text',
            conversation_id: 'conv-1',
            bot_id: 'bot-1',
            chat_id: 'chat-1',
            meta_data: {},
            created_at: 1234567891,
            updated_at: 1234567891,
            type: 'answer',
          },
        ],
        first_id: 'msg-1',
        last_id: 'msg-2',
        has_more: false,
      };

      jest.spyOn(client, 'post').mockResolvedValue(mockListData);

      const params: ListMessageReq = {
        order: 'desc',
        limit: 10,
      };

      const result = await messages.list('conv-1', params);

      expect(client.post).toHaveBeenCalledWith(
        '/v1/conversation/message/list?conversation_id=conv-1',
        params,
        false,
        undefined,
      );
      expect(result).toEqual(mockListData);
    });
  });

  describe('delete', () => {
    it('should delete a message', async () => {
      const mockDeletedMessage: ChatV3Message = {
        id: 'msg-1',
        role: RoleType.User,
        content: 'Deleted message',
        content_type: 'text',
        conversation_id: 'conv-1',
        bot_id: 'bot-1',
        chat_id: 'chat-1',
        meta_data: {},
        created_at: 1234567890,
        updated_at: 1234567890,
        type: 'question',
      };

      const mockResponse = { data: [mockDeletedMessage] };
      jest.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const result = await messages.delete('conv-1', 'msg-1');

      expect(client.post).toHaveBeenCalledWith(
        '/v1/conversation/message/delete?conversation_id=conv-1&message_id=msg-1',
        undefined,
        false,
        undefined,
      );
      expect(result).toEqual([mockDeletedMessage]);
    });
  });
});
