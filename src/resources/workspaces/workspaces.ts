import { safeJsonParse } from '../../utils.js';
import { APIResource } from '../resource.js';

export class Workspaces extends APIResource {
  /**
   * View the file list of a specified knowledge base, which includes lists of documents, spreadsheets, or images. | 调用接口查看指定知识库的内容列表，即文件、表格或图像列表。
   * @docs en: https://www.coze.com/docs/developer_guides/list_knowledge_files?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/list_knowledge_files?_lang=zh
   * @param params.page_num - Optional The page number for paginated queries. Default is 1. | 可选 分页查询时的页码。默认为 1，即从第一页数据开始返回。
   * @param params.page_size - Optional The size of pagination. Default is 10. | 可选 分页大小。默认为 10，即每页返回 10 条数据。
   * @returns OpenSpaceData | 知识库文件列表
   */
  async list(params: ListWorkSpaceReq) {
    const apiUrl = `/v1/workspaces`;
    const response = await this._client.get<ListWorkSpaceReq, string>(apiUrl, params);
    // TODO The returned type is not in JSON format
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
