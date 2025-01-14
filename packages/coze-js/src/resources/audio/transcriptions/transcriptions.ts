import { toFormData, type GenericFormData } from 'axios';

import { APIResource } from '../../resource';
import { type RequestOptions } from '../../../core';

export class Transcriptions extends APIResource {
  /**
   * ASR voice to text | ASR 语音转文本
   * @param params - Required The parameters for file upload | 上传文件所需的参数
   * @param params.file - Required The audio file to be uploaded. | 需要上传的音频文件。
   */
  async create(
    params: CreateTranscriptionReq,
    options?: RequestOptions,
  ): Promise<TranscriptionData> {
    const apiUrl = '/v1/audio/transcriptions';
    const response = await this._client.post<
      GenericFormData,
      { data: TranscriptionData }
    >(apiUrl, toFormData(params), false, options);
    return response.data;
  }
}
export interface CreateTranscriptionReq {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: File | any;
}

export interface TranscriptionData {
  text: string;
}
