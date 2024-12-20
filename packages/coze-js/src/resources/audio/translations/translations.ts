import { toFormData, type GenericFormData } from 'axios';

import { APIResource } from '../../resource.js';
import { type RequestOptions } from '../../../core.js';

export class Translations extends APIResource {
  /**
   * Upload files to Coze platform. | 调用接口上传文件到扣子。
   * @docs en: https://www.coze.com/docs/developer_guides/upload_files?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/upload_files?_lang=zh
   * @param params - Required The parameters for file upload | 上传文件所需的参数
   * @param params.file - Required The file to be uploaded. | 需要上传的文件。
   * @returns Information about the new file. | 已上传的文件信息。
   */
  async create(params: CreateAudioTranslationReq, options?: RequestOptions) {
    const apiUrl = '/v1/audio/translations';
    const response = await this._client.post<
      GenericFormData,
      { data: AudioTranslationData }
    >(apiUrl, toFormData(params), false, options);
    return response.data;
  }
}
export interface CreateAudioTranslationReq {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: File | any;
}

export interface AudioTranslationData {
  text: string;
}
