import { vi } from 'vitest';

import { SimultInterpretation } from '../../../src/resources/websockets/audio/simult-interpretation';
import { CozeAPI } from '../../../src/index';

describe('SimultInterpretation', () => {
  let client: CozeAPI;
  let simultInterpretation: SimultInterpretation;

  beforeEach(() => {
    client = new CozeAPI({ token: 'test-token' });
    simultInterpretation = new SimultInterpretation(client);
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
      const result = await simultInterpretation.create(options);

      expect(client.makeWebsocket).toHaveBeenCalledWith(
        '/v1/audio/simult_interpretation',
        options,
      );
      expect(result).toBeDefined();
    });
  });
});
