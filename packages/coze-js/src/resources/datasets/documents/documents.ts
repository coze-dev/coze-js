import { APIResource } from '../../resource.js';
import { mergeConfig } from '../../../utils.js';
import { type RequestOptions } from '../../../core.js';

// Required header for knowledge APIs
const headers = { 'agw-js-conv': 'str' };
export class Documents extends APIResource {
  /**
   * View the file list of a specified knowledge base, which includes lists of documents, spreadsheets, or images.
   * | 调用接口查看指定知识库的内容列表，即文件、表格或图像列表。
   * @docs en: https://www.coze.com/docs/developer_guides/list_knowledge_files?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/list_knowledge_files?_lang=zh
   * @param params.dataset_id - Required The ID of the knowledge base. | 必选 待查看文件的知识库 ID。
   * @param params.page - Optional The page number for paginated queries. Default is 1. | 可选 分页查询时的页码。默认为 1。
   * @param params.page_size - Optional The size of pagination. Default is 10. | 可选 分页大小。默认为 10。
   * @returns ListDocumentData | 知识库文件列表
   */
  list(params: ListDocumentReq, options?: RequestOptions) {
    const apiUrl = '/open_api/knowledge/document/list';
    const response = this._client.get<ListDocumentReq, ListDocumentData>(
      apiUrl,
      params,
      false,
      mergeConfig(options, { headers }),
    );
    return response;
  }

  /**
   * Upload files to the specific knowledge. | 调用此接口向指定知识库中上传文件。
   * @docs en: https://www.coze.com/docs/developer_guides/create_knowledge_files?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/create_knowledge_files?_lang=zh
   * @param params.dataset_id - Required The ID of the knowledge. | 必选 知识库 ID。
   * @param params.document_bases - Required The metadata information of the files awaiting upload. | 必选 待上传文件的元数据信息。
   * @param params.chunk_strategy - Required when uploading files to a new knowledge for the first time. Chunk strategy.
   * | 向新知识库首次上传文件时必选 分段规则。
   * @returns DocumentInfo[] | 已上传文件的基本信息
   */
  async create(params: CreateDocumentReq, options?: RequestOptions) {
    const apiUrl = '/open_api/knowledge/document/create';
    const response = await this._client.post<
      CreateDocumentReq,
      { document_infos: DocumentInfo[] }
    >(apiUrl, params, false, mergeConfig(options, { headers }));
    return response.document_infos;
  }

  /**
   * Delete text, images, sheets, and other files in the knowledge base, supporting batch deletion.
   * | 删除知识库中的文本、图像、表格等文件，支持批量删除。
   * @docs en: https://www.coze.com/docs/developer_guides/delete_knowledge_files?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/delete_knowledge_files?_lang=zh
   * @param params.document_ids - Required The list of knowledge base files to be deleted. | 必选 待删除的文件 ID。
   * @returns void | 无返回
   */
  async delete(params: DeleteDocumentReq, options?: RequestOptions) {
    const apiUrl = '/open_api/knowledge/document/delete';
    await this._client.post<DeleteDocumentReq, undefined>(
      apiUrl,
      params,
      false,
      mergeConfig(options, { headers }),
    );
  }

  /**
   * Modify the knowledge base file name and update strategy. | 调用接口修改知识库文件名称和更新策略。
   * @docs en: https://www.coze.com/docs/developer_guides/modify_knowledge_files?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/modify_knowledge_files?_lang=zh
   * @param params.document_id - Required The ID of the knowledge base file. | 必选 待修改的知识库文件 ID。
   * @param params.document_name - Optional The new name of the knowledge base file. | 可选 知识库文件的新名称。
   * @param params.update_rule - Optional The update strategy for online web pages. | 可选 在线网页更新策略。
   * @returns void | 无返回
   */
  async update(params: UpdateDocumentReq, options?: RequestOptions) {
    const apiUrl = '/open_api/knowledge/document/update';
    await this._client.post<UpdateDocumentReq, undefined>(
      apiUrl,
      params,
      false,
      mergeConfig(options, { headers }),
    );
  }
}

export interface ListDocumentReq {
  dataset_id: string;
  page?: number;
  page_size?: number;
}

export interface ListDocumentData {
  total: number;
  document_infos: DocumentInfo[];
}

export interface CreateDocumentReq {
  dataset_id: string;
  document_bases: DocumentBase[];
  chunk_strategy?: ChunkStrategy;
}

export interface DeleteDocumentReq {
  document_ids: string[];
}

export interface UpdateDocumentReq {
  document_id: string;
  document_name?: string;
  update_rule?: UpdateRule;
}

export interface DocumentInfo {
  char_count: number;
  chunk_strategy: ChunkStrategy;
  create_time: number;
  document_id: string;
  format_type: number;
  hit_count: number;
  name: string;
  size: number;
  slice_count: number;
  status: number;
  type: string;
  update_interval: number;
  update_time: number;
  update_type: number;
}

export interface ChunkStrategy {
  chunk_type: number;
  separator?: string;
  max_tokens?: number;
  remove_extra_spaces?: boolean;
  remove_urls_emails?: boolean;
}

export interface DocumentBase {
  name: string;
  source_info: SourceInfo;
  update_rule?: UpdateRule;
}

export interface SourceInfo {
  file_base64?: string;
  file_type?: string;
  web_url?: string;
  document_source?: number;
}

export interface UpdateRule {
  update_type: number;
  update_interval: number;
}
