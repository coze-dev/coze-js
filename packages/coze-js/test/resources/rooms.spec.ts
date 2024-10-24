import {
  Rooms,
  type CreateRoomReq,
  type CreateRoomData,
} from '../../src/resources/audio/rooms/rooms';
import { CozeAPI } from '../../src/index';

jest.mock('../../src/utils', () => ({
  isBrowser: jest.fn(),
}));

describe('Rooms', () => {
  let client: CozeAPI;
  let rooms: Rooms;

  beforeEach(() => {
    client = new CozeAPI({ token: 'test-token' });
    rooms = new Rooms(client);
  });

  describe('create', () => {
    it('should create a room', async () => {
      const mockCreateRoomData: CreateRoomData = {
        token: 'room-token',
        uid: 'user-123',
        room_id: 'room-456',
        app_id: 'app-789',
      };

      const mockResponse = { data: mockCreateRoomData };
      jest.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params: CreateRoomReq = {
        bot_id: 'bot-123',
        conversation_id: 'conv-456',
        voice_id: 'voice-789',
        connector_id: 'connector-012',
      };

      const result = await rooms.create(params);

      expect(client.post).toHaveBeenCalledWith(
        '/v1/audio/rooms',
        params,
        false,
        undefined,
      );
      expect(result).toEqual(mockCreateRoomData);
    });

    it('should create a room with minimal required parameters', async () => {
      const mockCreateRoomData: CreateRoomData = {
        token: 'room-token',
        uid: 'user-123',
        room_id: 'room-456',
        app_id: 'app-789',
      };

      const mockResponse = { data: mockCreateRoomData };
      jest.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params: CreateRoomReq = {
        bot_id: 'bot-123',
        connector_id: 'connector-012',
      };

      const result = await rooms.create(params);

      expect(client.post).toHaveBeenCalledWith(
        '/v1/audio/rooms',
        params,
        false,
        undefined,
      );
      expect(result).toEqual(mockCreateRoomData);
    });
  });
});
