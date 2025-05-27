import { APIResource } from '../../resource';
import { type RequestOptions } from '../../../core';

export class Live extends APIResource {
  /**
   * 拉流 获取收听者信息
   */
  async retrieve(liveId: string, options?: RequestOptions) {
    const apiUrl = `/v1/audio/live/${liveId}`;
    const response = await this._client.get<
      unknown,
      { data: RetrieveLiveData }
    >(apiUrl, undefined, false, options);
    return response.data;
  }
}
export interface RetrieveLiveData {
  app_id: string;
  stream_infos: StreamInfo[];
}

export interface StreamInfo {
  stream_id: string;
  name: string;
  live_type: LiveType;
}

export enum LiveType {
  Origin = 'origin', // 原生流
  Translation = 'translation', // 翻译流
}
