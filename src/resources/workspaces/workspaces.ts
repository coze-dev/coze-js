import { safeJsonParse } from '../../utils.js';
import { APIResource } from '../resource.js';

export class Workspaces extends APIResource {
  async list(params: ListWorkSpaceReq) {
    const apiUrl = `/v1/workspaces`;
    const response = await this._client.get<ListWorkSpaceReq, string>(apiUrl, params);
    // TODO 返回的类型不是json格式的
    return safeJsonParse(response)['data'] as OpenSpaceData;
  }
}

export interface ListWorkSpaceReq {
  page_num?: number;
  page_size?: number;
}
export interface OpenSpaceData {
  workspaces: OpenSpace[];
  total_count: number;
}

export interface OpenSpace {
  id: string;
  name: string;
  icon_url: string;
  role_type: string;
  workspace_type: string;
}
