import { type FileLike, type FormData } from '../../shims/index.js';
import { APIResource } from '../resource.js';

export class Files extends APIResource {
  async create(params: CreateFileReq) {
    // TODO file upload 需特殊处理
    const apiUrl = `/v1/files/upload`;
    const response = await this._client.post<FormData, { data: FileObject }>(apiUrl, this._toFormData(params));
    return response.data;
  }

  async retrieve(file_id: string) {
    const apiUrl = `/v1/files/retrieve?file_id=${file_id}`;
    const response = await this._client.get<null, { data: FileObject }>(apiUrl);
    return response.data;
  }
}
export interface CreateFileReq {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: FileLike | any;
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
