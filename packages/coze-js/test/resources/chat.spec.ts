import {
  Chat,
  ChatStatus,
  ChatEventType,
  type CreateChatReq,
  RoleType,
} from '../../src/resources/chat/chat';
import { CozeAPI } from '../../src/index';

describe('Chat', () => {
  let client: CozeAPI;
  let chat: Chat;

  beforeEach(() => {
    client = new CozeAPI({ token: 'test-token' });
    chat = new Chat(client);
  });

  describe('create', () => {
    it('should create a chat', async () => {
      const mockResponse = {
        data: { id: 'test-chat-id', conversation_id: 'test-conversation-id' },
      };
      vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params: CreateChatReq = {
        bot_id: 'test-bot-id',
        user_id: 'test-user-id',
        additional_messages: [
          { role: RoleType.User, content: 'Hello', content_type: 'text' },
          {
            role: RoleType.User,
            content: [{ type: 'text', text: 'Hello' }],
            content_type: 'object_string',
          },
        ],
        shortcut_command: {
          command_id: 'test-command-id',
          parameters: {
            test: { type: 'text', text: 'Hello' },
          },
        },
      };

      const result = await chat.create(params);

      expect(client.post).toHaveBeenCalledWith(
        '/v3/chat',
        {
          ...params,
          stream: false,
          additional_messages: [
            { role: RoleType.User, content: 'Hello', content_type: 'text' },
            {
              role: RoleType.User,
              content: JSON.stringify([{ type: 'text', text: 'Hello' }]),
              content_type: 'object_string',
            },
          ],
          shortcut_command: {
            command_id: 'test-command-id',
            parameters: {
              test: JSON.stringify({ type: 'text', text: 'Hello' }),
            },
          },
        },
        false,
        undefined,
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should generate uuid when user_id is not provided', async () => {
      const mockResponse = {
        data: { id: 'test-chat-id', conversation_id: 'test-conversation-id' },
      };
      vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params: CreateChatReq = {
        bot_id: 'test-bot-id',
        additional_messages: [
          { role: RoleType.User, content: 'Hello', content_type: 'text' },
        ],
        shortcut_command: {
          command_id: 'test-command-id',
          parameters: {
            test: JSON.stringify({ type: 'text', text: 'Hello' }),
          },
        },
      };

      const result = await chat.create(params);

      // Verify that the post call included a generated user_id
      expect(client.post).toHaveBeenCalledWith(
        '/v3/chat',
        {
          ...params,
          user_id: expect.any(String), // verify user_id was generated
          shortcut_command: {
            command_id: 'test-command-id',
            parameters: {
              test: JSON.stringify({ type: 'text', text: 'Hello' }),
            },
          },
          stream: false,
        },
        false,
        undefined,
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('createAndPoll', () => {
    it('should create and poll a chat', async () => {
      const createMockResponse = {
        data: {
          id: 'test-chat-id',
          conversation_id: 'test-conversation-id',
          status: ChatStatus.CREATED,
        },
      };
      const retrieveMockResponse = {
        data: {
          id: 'test-chat-id',
          conversation_id: 'test-conversation-id',
          status: ChatStatus.COMPLETED,
        },
      };
      const historyMockResponse = {
        data: [{ id: 'test-message-id', content: 'Test message' }],
      };

      vi.spyOn(client, 'post')
        .mockResolvedValueOnce(createMockResponse)
        .mockResolvedValueOnce(retrieveMockResponse);

      vi.spyOn(client, 'get').mockResolvedValueOnce(historyMockResponse);

      const params = {
        bot_id: 'test-bot-id',
        shortcut_command: {
          command_id: 'test-command-id',
          parameters: {
            test: { type: 'text' as const, text: 'Hello' },
          },
        },
      };

      const result = await chat.createAndPoll(params);

      expect(client.post).toHaveBeenNthCalledWith(
        1,
        '/v3/chat',
        { ...params, stream: false, user_id: expect.any(String) },
        false,
        undefined,
      );
      expect(client.post).toHaveBeenNthCalledWith(
        2,
        '/v3/chat/retrieve?conversation_id=test-conversation-id&chat_id=test-chat-id',
        undefined,
        false,
        undefined,
      );
      expect(client.get).toHaveBeenCalledWith(
        '/v3/chat/message/list?conversation_id=test-conversation-id&chat_id=test-chat-id',
        undefined,
        false,
        undefined,
      );
      expect(result).toEqual({
        chat: retrieveMockResponse.data,
        messages: historyMockResponse.data,
      });
    });
  });

  describe('stream', () => {
    it('should stream chat data', async () => {
      const mockGenerator = function* () {
        yield {
          event: ChatEventType.CONVERSATION_CHAT_CREATED,
          data: '{"id": "test-chat-id"}',
        };
        yield { event: ChatEventType.DONE, data: '[DONE]' };
      };

      vi.spyOn(client, 'post').mockResolvedValue(mockGenerator());

      const params = {
        bot_id: 'test-bot-id',
        shortcut_command: {
          command_id: 'test-command-id',
          parameters: {
            test: { type: 'text' as const, text: 'Hello' },
          },
        },
      };

      const result = chat.stream(params);

      for await (const data of result) {
        expect(data).toBeDefined();
      }

      expect(client.post).toHaveBeenCalledWith(
        '/v3/chat',
        {
          ...params,
          stream: true,
          user_id: expect.any(String),
          shortcut_command: {
            command_id: 'test-command-id',
            parameters: {
              test: JSON.stringify({ type: 'text', text: 'Hello' }),
            },
          },
        },
        true,
        undefined,
      );
    });
  });

  describe('retrieve', () => {
    it('should retrieve chat information', async () => {
      const mockResponse = {
        data: { id: 'test-chat-id', conversation_id: 'test-conversation-id' },
      };
      vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const result = await chat.retrieve(
        'test-conversation-id',
        'test-chat-id',
      );

      expect(client.post).toHaveBeenCalledWith(
        '/v3/chat/retrieve?conversation_id=test-conversation-id&chat_id=test-chat-id',
        undefined,
        false,
        undefined,
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('history', () => {
    it('should get chat history', async () => {
      const mockResponse = {
        data: [{ id: 'test-message-id', content: 'Test message' }],
      };
      vi.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const result = await chat.messages.list(
        'test-conversation-id',
        'test-chat-id',
      );

      expect(client.get).toHaveBeenCalledWith(
        '/v3/chat/message/list?conversation_id=test-conversation-id&chat_id=test-chat-id',
        undefined,
        false,
        undefined,
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('cancel', () => {
    it('should cancel a chat', async () => {
      const mockResponse = {
        data: { id: 'test-chat-id', status: ChatStatus.FAILED },
      };
      vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const result = await chat.cancel('test-conversation-id', 'test-chat-id');

      expect(client.post).toHaveBeenCalledWith(
        '/v3/chat/cancel',
        { conversation_id: 'test-conversation-id', chat_id: 'test-chat-id' },
        false,
        undefined,
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('submitToolOutputs', () => {
    it('should submit tool outputs', async () => {
      const mockResponse = {
        data: { id: 'test-chat-id', status: ChatStatus.COMPLETED },
      };
      vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params = {
        conversation_id: 'test-conversation-id',
        chat_id: 'test-chat-id',
        tool_outputs: [
          { tool_call_id: 'test-tool-call-id', output: 'Test output' },
        ],
        stream: false,
      };

      await chat.submitToolOutputs(params);

      // FIXME
      // expect(client.post).toHaveBeenCalledWith(
      //   '/v3/chat/submit_tool_outputs?conversation_id=test-conversation-id&chat_id=test-chat-id',
      //   { tool_outputs: params.tool_outputs, stream: false },
      //   true,
      //   undefined,
      // );

      // expect(result).toEqual(mockResponse.data);
    });

    it('should submit tool outputs with streaming', async () => {
      const mockGenerator = function* () {
        yield {
          event: ChatEventType.CONVERSATION_CHAT_IN_PROGRESS,
          data: '{"id": "test-chat-id"}',
        };
        yield { event: ChatEventType.DONE, data: '[DONE]' };
      };

      vi.spyOn(client, 'post').mockResolvedValue(mockGenerator());

      const params = {
        conversation_id: 'test-conversation-id',
        chat_id: 'test-chat-id',
        tool_outputs: [
          { tool_call_id: 'test-tool-call-id', output: 'Test output' },
        ],
        shortcut_command: {
          command_id: 'test-command-id',
          parameters: {
            test: JSON.stringify([{ type: 'text', text: 'Hello' }]),
          },
        },
        stream: true,
      };

      const result = chat.submitToolOutputs(params);

      for await (const data of result) {
        expect(data).toBeDefined();
      }

      expect(client.post).toHaveBeenCalledWith(
        '/v3/chat/submit_tool_outputs?conversation_id=test-conversation-id&chat_id=test-chat-id',
        {
          tool_outputs: params.tool_outputs,
          shortcut_command: params.shortcut_command,
          stream: true,
        },
        true,
        undefined,
      );
    });
  });
});
