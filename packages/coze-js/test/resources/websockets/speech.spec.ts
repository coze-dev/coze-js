import { vi } from 'vitest';

import { Speech } from '../../../src/resources/websockets/audio/speech';
import { CozeAPI } from '../../../src/index';

describe('Speech', () => {
  let client: CozeAPI;
  let speech: Speech;

  beforeEach(() => {
    client = new CozeAPI({ token: 'test-token' });
    speech = new Speech(client);
    // Mock makeWebsocket method
    client.makeWebsocket = vi.fn().mockResolvedValue({
      send: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  describe('create', () => {
    it('should create a websocket connection for speech', async () => {
      const options = { connectionTimeout: 5000 };
      const result = await speech.create(undefined, options);

      expect(client.makeWebsocket).toHaveBeenCalledWith(
        '/v1/audio/speech',
        options,
      );
      expect(result).toBeDefined();
    });
  });
});
