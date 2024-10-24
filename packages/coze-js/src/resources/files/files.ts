import { toFormData, type GenericFormData } from 'axios';

import { APIResource } from '../resource.js';
import { type RequestOptions } from '../../core.js';

export class Files extends APIResource {
  /**
   * Upload files to Coze platform. | 调用接口上传文件到扣子。
   * @docs en: https://www.coze.com/docs/developer_guides/upload_files?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/upload_files?_lang=zh
   * @param params - Required The parameters for file upload | 上传文件所需的参数
   * @param params.file - Required The file to be uploaded. | 需要上传的文件。
   * @returns Information about the new file. | 已上传的文件信息。
   */
  async create(params: CreateFileReq, options?: RequestOptions) {
    const apiUrl = '/v1/files/upload';
    const response = await this._client.post<
      GenericFormData,
      { data: FileObject }
    >(apiUrl, toFormData(params), false, options);
    return response.data;
  }

  /**
   * Get the information of the specific file uploaded to Coze platform. | 查看已上传的文件详情。
   * @docs en: https://www.coze.com/docs/developer_guides/retrieve_files?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/retrieve_files?_lang=zh
   * @param file_id - Required The ID of the uploaded file. | 已上传的文件 ID。
   * @returns Information about the uploaded file. | 已上传的文件信息。
   */
  async retrieve(file_id: string, options?: RequestOptions) {
    const apiUrl = `/v1/files/retrieve?file_id=${file_id}`;
    const response = await this._client.get<null, { data: FileObject }>(
      apiUrl,
      null,
      false,
      options,
    );
    return response.data;
  }
}
export interface CreateFileReq {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: File | any;
}

export interface FileObject {
  /**
   * 已上传的文件 ID。
   */
  id: string;

  /**
   * 文件的总字节数。
   */
  bytes: number;

  /**
   * 文件的上传时间，格式为 10 位的 Unixtime 时间戳，单位为秒（s）。
   */
  created_at: number;

  /**
   * 文件名称。
   */
  file_name: string;
}
