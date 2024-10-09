import { Bots } from '../../src/resources/bots/bots';
import { CozeAPI } from '../../src/index';

describe('Bots', () => {
  let client: CozeAPI;
  let bots: Bots;

  beforeEach(() => {
    client = new CozeAPI({ token: 'test-token' });
    bots = new Bots(client);
  });

  describe('create', () => {
    it('should create a bot', async () => {
      const mockResponse = { data: { bot_id: 'test-bot-id' } };
      jest.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params = {
        space_id: 'test-space-id',
        name: 'Test Bot',
      };

      const result = await bots.create(params);

      expect(client.post).toHaveBeenCalledWith('/v1/bot/create', params);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('update', () => {
    it('should update a bot', async () => {
      const mockResponse = { data: undefined };
      jest.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params = {
        bot_id: 'test-bot-id',
        name: 'Updated Bot Name',
      };

      const result = await bots.update(params);

      expect(client.post).toHaveBeenCalledWith('/v1/bot/update', params);
      expect(result).toBeUndefined();
    });
  });

  describe('list', () => {
    it('should list bots', async () => {
      const mockResponse = { data: { bots: [{ bot_id: 'test-bot-id' }] } };
      jest.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const params = { space_id: 'test-space-id' };

      const result = await bots.list(params);

      expect(client.get).toHaveBeenCalledWith('/v1/space/published_bots_list', params);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('publish', () => {
    it('should publish a bot', async () => {
      const mockResponse = { data: undefined };
      jest.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params = { bot_id: 'test-bot-id', connector_ids: ['test-connector-id'] };

      const result = await bots.publish(params);

      expect(client.post).toHaveBeenCalledWith('/v1/bot/publish', params);
      expect(result).toBeUndefined();
    });
  });

  describe('retrieve', () => {
    it('should retrieve bot information', async () => {
      const mockResponse = { data: { bot_id: 'test-bot-id', name: 'Test Bot' } };
      jest.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const params = { bot_id: 'test-bot-id' };

      const result = await bots.retrieve(params);

      expect(client.get).toHaveBeenCalledWith('/v1/bot/get_online_info', params);
      expect(result).toEqual(mockResponse.data);
    });
  });
});
