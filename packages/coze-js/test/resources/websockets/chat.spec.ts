import { vi } from 'vitest';

import { Chat } from '../../../src/resources/websockets/chat/index';
import { CozeAPI } from '../../../src/index';

describe('Chat', () => {
  let client: CozeAPI;
  let chat: Chat;

  beforeEach(() => {
    client = new CozeAPI({ token: 'test-token' });
    chat = new Chat(client);
    // Mock makeWebsocket method
    client.makeWebsocket = vi.fn().mockResolvedValue({
      send: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  describe('create', () => {
    it('should create a websocket connection for chat', async () => {
      const options = { connectionTimeout: 5000 };
      const result = await chat.create('bot-id', options);

      expect(client.makeWebsocket).toHaveBeenCalledWith(
        '/v1/chat?bot_id=bot-id',
        options,
      );
      expect(result).toBeDefined();
    });
  });
});
