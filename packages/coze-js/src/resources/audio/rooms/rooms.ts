import { APIResource } from '../../resource';
import { type RequestOptions } from '../../../core';

export class Rooms extends APIResource {
  async create(params: CreateRoomReq, options?: RequestOptions) {
    const apiUrl = '/v1/audio/rooms';
    const response = await this._client.post<
      CreateRoomReq,
      { data: CreateRoomData }
    >(apiUrl, params, false, options);
    return response.data;
  }
}
export interface CreateRoomReq {
  bot_id: string;
  conversation_id?: string;
  voice_id?: string;
  connector_id: string;
  uid?: string;
  workflow_id?: string;
  config?: RoomConfig;
}

export interface RoomConfig {
  video_config?: {
    stream_video_type: 'main' | 'screen';
  };
  prologue_content?: string;
  translate_config?: TranslateConfig;
  room_mode?: RoomMode;
  turn_detection?: CreateRoomTurnDetection;
}

export interface TranslateConfig {
  from: string;
  to: string;
}

export enum RoomMode {
  Default = 'default', // 普通模式
  S2S = 's2s', // 端到端模式
  Podcast = 'podcast', // 博客模式
  Translate = 'translate', // 同声传译模式
}

export interface CreateRoomData {
  token: string;
  uid: string;
  room_id: string;
  app_id: string;
}

export interface CreateRoomTurnDetection {
  type?: CreateRoomTurnDetectionType;
}

export enum CreateRoomTurnDetectionType {
  ServerVad = 'server_vad',
  ClientVad = 'client_vad',
  ClientInterrupt = 'client_interrupt',
}
