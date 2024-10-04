import { type Coze } from '../../api.js';
import { APIResource } from '../resource.js';

type ListWorkSpaceParams = Parameters<typeof Coze.prototype.listWorkSpaces>[0];

export class Workspaces extends APIResource {
  list(params: ListWorkSpaceParams) {
    return this._client.api.listWorkSpaces(params);
  }
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
