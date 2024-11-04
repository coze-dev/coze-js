import { APIResource } from '../../resource.js';
import { mergeConfig } from '../../../utils.js';
import { type RequestOptions } from '../../../core.js';

export class Speech extends APIResource {
  /**
   * @description Speech synthesis | 语音合成
   * @param params
   * @param params.input - Required. Text to generate audio | 要为其生成音频的文本
   * @param params.voice_id - Required. Voice ID | 生成音频的音色 ID
   * @param params.response_format - Optional. Audio encoding format,
   * supports "wav", "pcm", "ogg", "opus", "mp3", default is "mp3"
   * | 音频编码格式，支持 "wav", "pcm", "ogg", "opus", "mp3"，默认是 "mp3"
   * @param options - Request options
   * @returns Speech synthesis data
   */
  async create(params: CreateSpeechReq, options?: RequestOptions) {
    const apiUrl = '/v1/audio/speech';
    const response = await this._client.post<CreateSpeechReq, ArrayBuffer>(
      apiUrl,
      params,
      false,
      mergeConfig(options, { responseType: 'arraybuffer' }),
    );
    return response;
  }
}

export interface CreateSpeechReq {
  /** Text to generate audio for. Maximum length is 1024 characters | 要为其生成音频的文本。最大长度为 1024 个字符 */
  input: string;
  /** Voice ID for audio generation | 生成音频的音色 */
  voice_id: string;
  /** Audio encoding format, supports wav, pcm, ogg, opus, mp3. Default is mp3
   * | 音频编码格式，wav、pcm、ogg、opus、mp3，默认为 mp3 */
  response_format?: 'wav' | 'pcm' | 'ogg' | 'opus' | 'mp3';
  /** Speech speed, range [0.2,3], default is 1, usually one decimal place is sufficient
   * | 语速，[0.2,3]，默认为1，通常保留一位小数即可 */
  speed?: number;
}
