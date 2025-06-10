import { toFormData, type GenericFormData } from 'axios';

import { APIResource } from '../../resource';
import { type RequestOptions } from '../../../core';
import { type UserInfo } from '..';

export class VoiceprintFeature extends APIResource {
  /**
   * Create voiceprint feature
   */
  async create(
    groupId: string,
    params: CreateVoiceprintFeatureReq,
    options?: RequestOptions,
  ): Promise<CreateVoiceprintFeatureData> {
    const apiUrl = `/v1/audio/voiceprint_groups/${groupId}/features`;
    const response = await this._client.post<
      GenericFormData,
      { data: CreateVoiceprintFeatureData }
    >(apiUrl, toFormData(params), false, options);
    return response.data;
  }

  /**
   * Update voiceprint feature
   */
  // eslint-disable-next-line max-params
  async update(
    groupId: string,
    featureId: string,
    params: UpdateVoiceprintFeatureReq,
    options?: RequestOptions,
  ): Promise<undefined> {
    const apiUrl = `/v1/audio/voiceprint_groups/${groupId}/features/${featureId}`;
    const response = await this._client.put<
      GenericFormData,
      { data: undefined }
    >(apiUrl, toFormData(params), false, options);
    return response.data;
  }

  /**
   * Delete voiceprint feature
   */
  async delete(
    groupId: string,
    featureId: string,
    options?: RequestOptions,
  ): Promise<undefined> {
    const apiUrl = `/v1/audio/voiceprint_groups/${groupId}/features/${featureId}`;
    const response = await this._client.delete<undefined, { data: undefined }>(
      apiUrl,
      false,
      options,
    );
    return response.data;
  }

  /**
   * Get voiceprint feature list
   */
  async list(
    groupId: string,
    params?: ListVoiceprintFeatureReq,
    options?: RequestOptions,
  ): Promise<ListVoiceprintFeatureData> {
    const apiUrl = `/v1/audio/voiceprint_groups/${groupId}/features`;
    const response = await this._client.get<
      ListVoiceprintFeatureReq,
      { data: ListVoiceprintFeatureData }
    >(apiUrl, params, false, options);
    return response.data;
  }

  /**
   * Speaker identification
   */
  async speakerIdentify(
    groupId: string,
    params: SpeakerIdentifyReq,
    options?: RequestOptions,
  ): Promise<SpeakerIdentifyData> {
    const apiUrl = `/v1/audio/voiceprint_groups/${groupId}/speaker_identify`;
    const response = await this._client.post<
      GenericFormData,
      { data: SpeakerIdentifyData }
    >(apiUrl, toFormData(params), false, options);
    return response.data;
  }
}

export interface CreateVoiceprintFeatureReq {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: File | any;
  name: string;
  desc?: string;
  // Only required for PCM files
  sample_rate?: number;
  // Only required for PCM files, 0 / 1
  channel?: number;
}

export interface UpdateVoiceprintFeatureReq {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file?: File | any;
  name?: string;
  desc?: string;
  // Only required for PCM files
  sample_rate?: number;
  // Only required for PCM files, 0 / 1
  channel?: number;
}

export interface CreateVoiceprintFeatureData {
  id: string;
}

export interface ListVoiceprintFeatureReq {
  page_num?: number;
  page_size?: number;
}

export interface ListVoiceprintFeatureData {
  items?: VoiceprintFeature[];
  total?: number;
}
export interface VoiceprintFeature {
  id?: string;
  group_id?: string;
  name?: string;
  audio_url?: string;
  created_at?: number;
  updated_at?: number;
  desc?: string;
  icon_url?: string;
  user_info?: UserInfo;
}

export interface SpeakerIdentifyReq {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: File | any;
  top_k?: number;
  sample_rate?: number;
  channel?: number;
}

export interface FeatureScore {
  feature_id?: string;
  feature_name?: string;
  feature_desc?: string;
  score?: number;
}
export interface SpeakerIdentifyData {
  feature_score_list?: FeatureScore[];
}
