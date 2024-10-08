import { APIResource } from '../../resource.js';

export class Documents extends APIResource {
  list(params: ListDocumentReq) {
    const apiUrl = `/open_api/knowledge/document/list`;
    const response = this._client.get<ListDocumentReq, ListDocumentData>(apiUrl, params);
    return response;
  }

  async create(params: CreateDocumentReq) {
    // TODO response.document_infos
    const apiUrl = `/open_api/knowledge/document/create`;
    const response = await this._client.post<CreateDocumentReq, { document_infos: DocumentInfo[] }>(apiUrl, params);
    return response.document_infos;
  }

  async delete(params: DeleteDocumentReq) {
    const apiUrl = `/open_api/knowledge/document/delete`;
    await this._client.post<DeleteDocumentReq, undefined>(apiUrl, params);
  }

  async update(params: UpdateDocumentReq) {
    const apiUrl = `/open_api/knowledge/document/update`;
    await this._client.post<UpdateDocumentReq, undefined>(apiUrl, params);
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
  chunk_type: string;
  separator?: string;
  max_tokens?: number;
  remove_extra_spaces?: boolean;
  remove_urls_emails?: boolean;
}

export interface DocumentBase {
  name: string;
  source_info: SourceInfo;
  update_rule: UpdateRule;
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
