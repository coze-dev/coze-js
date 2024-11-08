import { Audio } from '../../src/resources/audio';
import { CozeAPI } from '../../src/index';

describe('Voices', () => {
  let client: CozeAPI;
  let audio: Audio;

  beforeEach(() => {
    client = new CozeAPI({ token: 'test-token' });
    audio = new Audio(client);
  });

  describe('create', () => {
    it('should generate speech synthesis', async () => {
      const mockResponse = new ArrayBuffer(8);
      vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params = {
        input: 'Hello world',
        voice_id: 'test-voice-id',
        response_format: 'mp3' as const,
        speed: 1.0,
      };

      const result = await audio.speech.create(params);

      expect(client.post).toHaveBeenCalledWith(
        '/v1/audio/speech',
        params,
        false,
        expect.objectContaining({
          responseType: 'arraybuffer',
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
