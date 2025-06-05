import { APIResource } from '../../resource';
import { type RequestOptions } from '../../../core';
import { VoiceprintFeature } from './features';

export * from './features';
export class VoiceprintGroups extends APIResource {
  features: VoiceprintFeature = new VoiceprintFeature(this._client);

  /**
   * 创建声纹组
   */
  async create(
    params: CreateVoiceprintGroupReq,
    options?: RequestOptions,
  ): Promise<CreateVoiceprintGroupData> {
    const apiUrl = '/v1/audio/voiceprint_groups';
    const response = await this._client.post<
      CreateVoiceprintGroupReq,
      { data: CreateVoiceprintGroupData }
    >(apiUrl, params, false, options);
    return response.data;
  }

  /**
   * 获取声纹组列表
   */
  async list(
    params?: ListVoiceprintGroupReq,
    options?: RequestOptions,
  ): Promise<ListVoiceprintGroupData> {
    const apiUrl = '/v1/audio/voiceprint_groups';
    const response = await this._client.get<
      ListVoiceprintGroupReq,
      { data: ListVoiceprintGroupData }
    >(apiUrl, params, false, options);
    return response.data;
  }

  /**
   * 更新声纹组
   */
  async update(
    groupId: string,
    params: UpdateVoiceprintGroupReq,
    options?: RequestOptions,
  ): Promise<undefined> {
    const apiUrl = `/v1/audio/voiceprint_groups/${groupId}`;
    const response = await this._client.put<
      UpdateVoiceprintGroupReq,
      { data: undefined }
    >(apiUrl, params, false, options);
    return response.data;
  }

  /**
   * 删除声纹组
   */
  async delete(groupId: string, options?: RequestOptions): Promise<undefined> {
    const apiUrl = `/v1/audio/voiceprint_groups/${groupId}`;
    const response = await this._client.delete<undefined, { data: undefined }>(
      apiUrl,
      false,
      options,
    );
    return response.data;
  }
}

export interface CreateVoiceprintGroupReq {
  coze_account_id?: string;
  name: string;
  desc?: string;
}

export interface CreateVoiceprintGroupData {
  id: string;
}

export interface ListVoiceprintGroupReq {
  coze_account_id?: string;
  page_num?: number;
  page_size?: number;
  /**
   *模糊前缀匹配
   */
  name?: string;
  /**
   *匹配用户ID
   */
  user_id?: string;
  /**
   *声纹组ID
   */
  group_id?: string;
}

export interface ListVoiceprintGroupData {
  items?: VoiceprintGroup[];
  total?: number;
}

export interface UserInfo {
  id?: string;
  name?: string;
  nickname?: string;
  avatar_url?: string;
}
export interface VoiceprintGroup {
  id?: string;
  name?: string;
  desc?: string;
  created_at?: number;
  updated_at?: number;
  icon_url?: string;
  user_info?: UserInfo;
  feature_count?: number;
}

export interface UpdateVoiceprintGroupReq {
  name?: string;
  desc?: string;
}
