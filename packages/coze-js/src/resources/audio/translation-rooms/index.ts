import { type CreateRoomData, type CreateRoomReq } from '../rooms';
import { APIResource } from '../../resource';
import { type RequestOptions } from '../../../core';

export class TranslationRooms extends APIResource {
  async create(params: CreateTranslationRoomReq, options?: RequestOptions) {
    const apiUrl = '/v1/audio/translation_room';
    const response = await this._client.post<
      CreateTranslationRoomReq,
      { data: CreateRoomData }
    >(apiUrl, params, false, options);
    return response.data;
  }
}
export interface CreateTranslationRoomReq {
  room_config: CreateRoomReq;
  translate_config?: TranslateConfig;
}

export interface TranslateConfig {
  from: string;
  to: string;
}
