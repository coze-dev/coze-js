import { vi } from 'vitest';

import { Transcriptions } from '../../../src/resources/websockets/audio/transcriptions/index';
import { CozeAPI } from '../../../src/index';

describe('Transcriptions', () => {
  let client: CozeAPI;
  let transcriptions: Transcriptions;

  beforeEach(() => {
    client = new CozeAPI({ token: 'test-token' });
    transcriptions = new Transcriptions(client);
    // Mock makeWebsocket method
    client.makeWebsocket = vi.fn().mockResolvedValue({
      send: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  describe('create', () => {
    it('should create a websocket connection for transcriptions', async () => {
      const options = { connectionTimeout: 5000 };
      const result = await transcriptions.create(options);

      expect(client.makeWebsocket).toHaveBeenCalledWith(
        '/v1/audio/transcriptions',
        options,
      );
      expect(result).toBeDefined();
    });
  });
});
