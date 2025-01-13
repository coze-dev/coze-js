import { type ChunkStrategy, Documents } from './documents/index';
import { APIResource } from '../resource';
import { type RequestOptions } from '../../core';
import { Images } from './images/index';

export class Datasets extends APIResource {
  documents: Documents = new Documents(this._client);
  images: Images = new Images(this._client);

  /**
   * Creates a new dataset | 创建数据集
   * @docs en: https://www.coze.com/docs/developer_guides/create_dataset?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/create_dataset?_lang=zh
   * @param params - The parameters for creating a dataset
   * @param {string} params.name - Required. Dataset name, maximum length of 100 characters | 必选 数据集名称，最大长度为 100 个字符
   * @param {string} params.space_id - Required. Space ID where the dataset belongs | 必选 数据集所属的空间 ID
   * @param {number} params.format_type - Required. Dataset type (0: Text type, 2: Image type) | 必选 数据集类型 (0: 文本类型, 2: 图片类型)
   * @param {string} [params.description] - Optional. Dataset description | 可选 数据集描述
   * @param {string} [params.file_id] - Optional. Dataset icon file ID from file upload
   */
  async create(
    params: CreateDatasetReq,
    options?: RequestOptions,
  ): Promise<CreateDatasetData> {
    const apiUrl = '/v1/datasets';
    const response = await this._client.post<
      CreateDatasetReq,
      { data: CreateDatasetData }
    >(apiUrl, params, false, options);
    return response.data;
  }

  /**
   * Lists all datasets in a space | 列出空间中的所有数据集
   * @docs en: https://www.coze.com/docs/developer_guides/list_dataset?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/list_dataset?_lang=zh
   * @param params - The parameters for listing datasets | 列出数据集的参数
   * @param {string} params.space_id - Required. Space ID where the datasets belong | 必选 数据集所属的空间 ID
   * @param {string} [params.name] - Optional. Dataset name for fuzzy search | 可选 数据集名称用于模糊搜索
   * @param {number} [params.format_type] - Optional. Dataset type (0: Text type, 2: Image type) | 可选 数据集类型 (0: 文本类型, 2: 图片类型)
   * @param {number} [params.page_num] - Optional. Page number for pagination (default: 1) | 可选 分页查询时的页码。默认为 1。
   * @param {number} [params.page_size] - Optional. Number of items per page (default: 10) | 可选 分页大小。默认为 10。
   */
  async list(
    params: ListDatasetReq,
    options?: RequestOptions,
  ): Promise<ListDatasetData> {
    const apiUrl = '/v1/datasets';
    const response = await this._client.get<
      ListDatasetReq,
      { data: ListDatasetData }
    >(apiUrl, params, false, options);
    return response.data;
  }

  /**
   * Updates a dataset | 更新数据集
   * @docs en: https://www.coze.com/docs/developer_guides/update_dataset?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/update_dataset?_lang=zh
   * @param dataset_id - Required. The ID of the dataset to update | 必选 数据集 ID
   * @param params - Required. The parameters for updating the dataset | 必选 更新数据集的参数
   * @param params.name - Required. Dataset name, maximum length of 100 characters. | 必选 数据集名称，最大长度为 100 个字符。
   * @param params.file_id - Optional. Dataset icon, should pass the file_id obtained from the file upload interface. | 可选 数据集图标，应传递从文件上传接口获取的 file_id。
   * @param params.description - Optional. Dataset description. | 可选 数据集描述。
   */
  async update(
    dataset_id: string,
    params: UpdateDatasetReq,
    options?: RequestOptions,
  ): Promise<void> {
    const apiUrl = `/v1/datasets/${dataset_id}`;
    await this._client.put<UpdateDatasetReq, unknown>(
      apiUrl,
      params,
      false,
      options,
    );
  }

  /**
   * Deletes a dataset | 删除数据集
   * @docs en: https://www.coze.com/docs/developer_guides/delete_dataset?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/delete_dataset?_lang=zh
   * @param dataset_id - Required. The ID of the dataset to delete | 必选 数据集 ID
   */
  async delete(dataset_id: string, options?: RequestOptions): Promise<void> {
    const apiUrl = `/v1/datasets/${dataset_id}`;
    await this._client.delete(apiUrl, false, options);
  }

  /**
   * Views the progress of dataset upload | 查看数据集上传进度
   * @docs en: https://www.coze.com/docs/developer_guides/get_dataset_progress?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/get_dataset_progress?_lang=zh
   * @param dataset_id - Required. The ID of the dataset to process | 必选 数据集 ID
   * @param params - Required. The parameters for processing the dataset | 必选 处理数据集的参数
   * @param params.dataset_ids - Required. List of dataset IDs | 必选 数据集 ID 列表
   */
  async process(
    dataset_id: string,
    params: ProcessDatasetReq,
    options?: RequestOptions,
  ): Promise<DocumentProgressData> {
    const apiUrl = `/v1/datasets/${dataset_id}/process`;
    const response = await this._client.post<
      ProcessDatasetReq,
      { data: DocumentProgressData }
    >(apiUrl, params, false, options);
    return response.data;
  }
}

export interface CreateDatasetReq {
  /** Dataset name, maximum length of 100 characters. */
  name: string;
  /** Space ID where the dataset belongs. Space ID is the unique identifier of the space. */
  space_id: string;
  /** Dataset type. Values include: 0: Text type, 2: Image type */
  format_type: number;
  /** Dataset description. */
  description?: string;
  /** Dataset icon, should pass the file_id obtained from the file upload interface. */
  file_id?: string;
}

export interface ListDatasetReq {
  /** Space ID**/
  space_id: string;

  /** Dataset name for fuzzy search */
  name?: string;

  /** Dataset type. Values include:
   * 0: Text type
   * 1: Table type
   * 2: Image type
   */
  format_type?: number;

  /** Page number for pagination. Minimum value is 1. Default is 1. */
  page_num?: number;

  /** Number of items per page. Range: 1-300. Default is 10. */
  page_size?: number;
}

export interface UpdateDatasetReq {
  /** Dataset name, maximum length of 100 characters. */
  name: string;
  /** Dataset icon, should pass the file_id obtained from the file upload interface. */
  file_id?: string;
  /** Dataset description. */
  description?: string;
}

export interface ProcessDatasetReq {
  /** Dataset IDs */
  document_ids: string[];
}

export interface CreateDatasetData {
  /** The ID of the created dataset. */
  dataset_id: string;
}

export interface ListDatasetData {
  /** The ID of the created dataset. */
  dataset_id: string;
}

export interface Dataset {
  /** Dataset name */
  name: string;

  /** Dataset status. Values include:
   * 1: Enabled
   * 3: Disabled
   */
  status: number;

  /** Whether the current user is the owner of this dataset */
  can_edit: boolean;

  /** Dataset icon URI */
  icon_uri: string;

  /** Dataset icon URL */
  icon_url: string;

  /** Space ID where the dataset belongs */
  space_id: string;

  /** Number of documents in the dataset */
  doc_count: number;

  /** List of files in the dataset */
  file_list: string[];

  /** Total number of dataset hits */
  hit_count: number;

  /** Dataset creator's avatar URL */
  avatar_url: string;

  /** Dataset creator's Coze ID */
  creator_id: string;

  /** Dataset ID */
  dataset_id: string;

  /** Dataset creation time (Unix timestamp in seconds) */
  create_time: number;

  /** Dataset description */
  description: string;

  /** Dataset type. Values include:
   * 0: Text type
   * 1: Table type
   * 2: Image type
   */
  format_type: number;

  /** Total number of dataset segments */
  slice_count: number;

  /** Dataset update time (Unix timestamp in seconds) */
  update_time: number;

  /** Dataset creator's username */
  creator_name: string;

  /** Total size of all files in the dataset */
  all_file_size: number;

  /** Number of bots using this dataset */
  bot_used_count: number;

  /** Dataset chunking strategy */
  chunk_strategy: ChunkStrategy;

  /** List of failed files */
  failed_file_list: string[];

  /** List of files currently being processed */
  processing_file_list: string[];

  /** List of file IDs currently being processed */
  processing_file_id_list: string[];
}

export interface DocumentProgressData {
  /** List of file processing statuses */
  data: DocumentProgress[];
}

export interface DocumentProgress {
  /** File URL */
  url: string;

  /** File size in bytes */
  size: number;

  /** File format/extension (e.g., txt, pdf, doc, docx) */
  type: string;

  /**
   * File processing status
   * 0: Processing
   * 1: Processed
   * 9: Processing failed, recommend re-upload
   */
  status: number;

  /** Upload progress percentage */
  progress: number;

  /** File ID */
  document_id: string;

  /**
   * Whether online webpage auto-updates
   * 0: No auto-update
   * 1: Auto-update
   */
  update_type: number;

  /** File name */
  document_name: string;

  /** Expected remaining time in seconds */
  remaining_time: number;

  /** Detailed failure description, only returned when document processing fails */
  status_descript?: string;

  /** Auto-update frequency for online webpages in hours */
  update_interval: number;
}

export * from './documents/index';
export * from './images/index';
