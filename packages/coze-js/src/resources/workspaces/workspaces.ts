import { APIResource } from '../resource.js';
import { safeJsonParse } from '../../utils.js';
import { type RequestOptions } from '../../core.js';

export class Workspaces extends APIResource {
  /**
   * View the list of workspaces that the current Coze user has joined. | 查看当前扣子用户加入的空间列表。
   * @docs en: https://www.coze.com/docs/developer_guides/list_workspace?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/list_workspace?_lang=zh
   * @param params.page_num - Optional The page number for paginated queries. Default is 1. | 可选 分页查询时的页码。默认为 1，即从第一页数据开始返回。
   * @param params.page_size - Optional The size of pagination. Default is 10. Maximum is 50. | 可选 分页大小。默认为 10，最大为 50。
   * @returns OpenSpaceData | 工作空间列表
   */
  async list(params: ListWorkSpaceReq, options?: RequestOptions) {
    const apiUrl = '/v1/workspaces';
    const response = await this._client.get<ListWorkSpaceReq, string>(
      apiUrl,
      params,
      false,
      options,
    );
    // TODO The returned type is not in JSON format
    return safeJsonParse(response).data as OpenSpaceData;
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
