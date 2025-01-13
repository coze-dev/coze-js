import { type GenericFormData, toFormData } from 'axios';

import { APIResource } from '../../resource.js';
import { type RequestOptions } from '../../../core.js';

export class Voices extends APIResource {
  /**
   * @description Clone a voice | 音色克隆
   * @param params
   * @param params.voice_name - Required. Voice name, cannot be empty and must be longer than 6 characters
   * | 复刻的音色名称，不能为空，长度大于 6
   * @param params.file - Required. Audio file | 音频文件
   * @param params.audio_format - Required. Only supports "wav", "mp3", "ogg", "m4a", "aac", "pcm" formats
   * | 只支持 "wav", "mp3", "ogg", "m4a", "aac", "pcm" 格式
   * @param params.language - Optional. Only supports "zh", "en" "ja" "es" "id" "pt" languages
   * | 只支持 "zh", "en" "ja" "es" "id" "pt" 语种
   * @param params.voice_id - Optional. If provided, will train on existing voice and override previous training
   * | 传入的话就会在原有的音色上去训练，覆盖前面训练好的音色
   * @param params.preview_text - Optional. If provided, will generate preview audio based on this text, otherwise uses default text
   * | 如果传入会基于该文本生成预览音频，否则使用默认的文本
   * @param params.text - Optional. Users can read this text, service will compare audio with text. Returns error if difference is too large
   * | 可以让用户按照该文本念诵，服务会对比音频与该文本的差异。若差异过大会返回错误
   * @param params.space_id - Optional.  The space id of the voice. | 空间ID
   * @param params.description- Optional. The description of the voice. | 音色描述
   * @param options - Request options
   * @returns Clone voice data
   */
  async clone(params: CloneVoiceReq, options?: RequestOptions) {
    const apiUrl = '/v1/audio/voices/clone';
    const response = await this._client.post<
      GenericFormData,
      { data: CloneVoiceData }
    >(apiUrl, toFormData(params), false, options);
    return response.data;
  }
  /**
   * @description List voices | 获取音色列表
   * @param params
   * @param params.filter_system_voice - Optional. Whether to filter system voices, default is false
   * | 是否过滤系统音色, 默认不过滤
   * @param params.page_num - Optional. Starts from 1 by default, value must be > 0
   * | 不传默认从 1 开始，传值需要 > 0
   * @param params.page_size - Optional. Default is 100, value must be (0, 100]
   * | 不传默认 100，传值需要 (0, 100]
   * @param options - Request options
   * @returns List voices data
   */
  async list(params?: ListVoicesReq, options?: RequestOptions) {
    const apiUrl = '/v1/audio/voices';
    const response = await this._client.get<
      ListVoicesReq,
      { data: ListVoicesData }
    >(apiUrl, params, false, options);
    return response.data;
  }
}
export interface CloneVoiceReq {
  /** Voice name, cannot be empty and must be longer than 6 characters | 复刻的音色名称，不能为空，长度大于 6 */
  voice_name: string;
  /** Audio file | 音频文件 */
  file: File;
  /** Only supports "wav", "mp3", "ogg", "m4a", "aac", "pcm" formats
   * | 只支持 "wav", "mp3", "ogg", "m4a", "aac", "pcm" 格式 */
  audio_format: 'wav' | 'mp3' | 'ogg' | 'm4a' | 'aac' | 'pcm';
  /** Only supports "zh", "en" "ja" "es" "id" "pt" languages | 只支持 "zh", "en" "ja" "es" "id" "pt" 语种 */
  language?: 'zh' | 'en' | 'ja' | 'es' | 'id' | 'pt';
  /** If provided, will train on existing voice and override previous training
   * | 传入的话就会在原有的音色上去训练，覆盖前面训练好的音色 */
  voice_id?: string;
  /** If provided, will generate preview audio based on this text, otherwise uses default text
   * | 如果传入会基于该文本生成预览音频，否则使用默认的文本 */
  preview_text?: string;
  /** Users can read this text, service will compare audio with text. Returns error if difference is too large
   * | 可以让用户按照该文本念诵，服务会对比音频与该文本的差异。若差异过大会返回错误 */
  text?: string;
  /** The space id of the voice. */
  space_id?: string;
  /** The description of the voice. */
  description?: string;
}

export interface CloneVoiceData {
  /** Voice ID after cloning | 复刻后音色ID */
  voice_id: string;
}

export interface ListVoicesReq {
  /** Whether to filter system voices, default is false | 是否过滤系统音色, 默认不过滤 */
  filter_system_voice?: boolean;
  /** Starts from 1 by default, value must be > 0 | 不传默认从 1 开始，传值需要 > 0 */
  page_num?: number;
  /** Default is 100, value must be (0, 100] | 不传默认 100，传值需要(0, 100] */
  page_size?: number;
}

export interface ListVoicesData {
  /** List of voices | 音色列表 */
  voice_list: Voice[];
  /** Whether there is more data | 是否还有更多数据 */
  has_more: boolean;
}

export interface Voice {
  /** Whether it is a system voice | 是否为系统音色 */
  is_system_voice: boolean;
  /** Language name | 语言名称 */
  language_name: string;
  /** Preview text, default is "Hello, I'm your exclusive AI cloned voice..."
   * | 预览文本，默认"你好，我是你的专属AI克隆声音，希望未来可以一起好好相处哦" */
  preview_text: string;
  /** Creation time | 创建时间 */
  create_time: number;
  /** Update time | 更新时间 */
  update_time: number;
  /** Voice name | 音色名称 */
  name: string;
  /** Language code | 语言代码 */
  language_code: string;
  /** Voice ID | 音色ID */
  voice_id: string;
  /** Remaining number of times this voice can be trained | 当前音色还可以训练的次数 */
  available_training_times: number;
  /** Preview audio | 预览音频 */
  preview_audio: string;
}
