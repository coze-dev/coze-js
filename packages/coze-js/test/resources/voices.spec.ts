import { Voices } from '../../src/resources/audio/voices/voices';
import { Audio } from '../../src/resources/audio';
import { CozeAPI } from '../../src/index';

describe('Voices', () => {
  let client: CozeAPI;
  let voices: Voices;
  let audio: Audio;

  beforeEach(() => {
    client = new CozeAPI({ token: 'test-token' });
    voices = new Voices(client);
    audio = new Audio(client);
  });

  describe('clone', () => {
    it('should clone a voice', async () => {
      const mockResponse = { data: { voice_id: 'test-voice-id' } };
      jest.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const mockFile = {
        name: 'test.wav',
        size: 1024,
        type: 'audio/wav',
      } as unknown as File;

      const params = {
        voice_name: 'Test Voice',
        file: mockFile,
        audio_format: 'wav' as const,
        language: 'en' as const,
        preview_text: 'Hello, this is a test',
      };

      const result = await voices.clone(params);

      expect(client.post).toHaveBeenCalledWith(
        '/v1/audio/voices/clone',
        expect.any(Object),
        false,
        undefined,
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('list', () => {
    it('should list voices', async () => {
      const mockResponse = {
        data: {
          voice_list: [
            {
              is_system_voice: true,
              language_name: 'English',
              preview_text: 'Hello',
              create_time: 1234567890,
              update_time: 1234567890,
              name: 'Test Voice',
              language_code: 'en',
              available_training_times: 5,
            },
          ],
          has_more: false,
        },
      };
      jest.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const params = {
        filter_system_voice: true,
        page_num: 1,
        page_size: 10,
      };

      const result = await voices.list(params);

      expect(client.get).toHaveBeenCalledWith(
        '/v1/audio/voices',
        params,
        false,
        undefined,
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('speech', () => {
    it('should generate speech synthesis', async () => {
      const mockResponse = new ArrayBuffer(8);
      jest.spyOn(client, 'post').mockResolvedValue(mockResponse);

      const params = {
        input: 'Hello world',
        voice_id: 'test-voice-id',
        response_format: 'mp3' as const,
        speed: 1.0,
      };

      const result = await audio.speech(params);

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
