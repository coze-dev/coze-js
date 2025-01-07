import { APIResource } from '../../resource';
import { type RequestOptions } from '../../../core';

export class Images extends APIResource {
  /**
   * Update the description of an image in the knowledge base | 更新知识库中的图片描述
   * @docs en: https://www.coze.com/docs/developer_guides/developer_guides/update_image_caption?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/developer_guides/update_image_caption?_lang=zh
   * @param datasetId - The ID of the dataset | 必选 知识库 ID
   * @param documentId - The ID of the document | 必选 知识库文件 ID
   * @param params - The parameters for updating the image
   * @param params.caption - Required. The description of the image | 必选 图片的描述信息
   * @returns undefined
   */
  // eslint-disable-next-line max-params
  async update(
    datasetId: string,
    documentId: string,
    params: UpdateImageReq,
    options?: RequestOptions,
  ): Promise<void> {
    const apiUrl = `/v1/datasets/${datasetId}/images/${documentId}`;
    await this._client.put<UpdateImageReq, unknown>(
      apiUrl,
      params,
      false,
      options,
    );
  }

  /**
   * List images in the knowledge base | 列出知识库中的图片
   * @docs en: https://www.coze.com/docs/developer_guides/developer_guides/get_images?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/developer_guides/get_images?_lang=zh
   * @param datasetId - The ID of the dataset | 必选 知识库 ID
   * @param params - The parameters for listing images
   * @param params.page_num - Optional. Page number for pagination, minimum value is 1, defaults to 1 | 可选 分页查询时的页码。默认为 1。
   * @param params.page_size - Optional. Number of items per page, range 1-299, defaults to 10 | 可选 分页大小。默认为 10。
   * @param params.keyword - Optional. Search keyword for image descriptions | 可选 图片描述的搜索关键词。
   * @param params.has_caption - Optional. Filter for images with/without captions | 可选 是否过滤有/无描述的图片。
   */
  async list(
    datasetId: string,
    params?: ListImageReq,
    options?: RequestOptions,
  ): Promise<ListImageData> {
    const apiUrl = `/v1/datasets/${datasetId}/images`;
    const response = await this._client.get<
      ListImageReq,
      { data: ListImageData }
    >(apiUrl, params, false, options);
    return response.data;
  }
}

export interface ListImageReq {
  /** Page number for pagination, minimum value is 1, defaults to 1 */
  page_num?: number;

  /** Number of items per page, range 1-299, defaults to 10 */
  page_size?: number;

  /** Search keyword for image descriptions */
  keyword?: string;

  /** Filter for images with/without captions */
  has_caption?: boolean;
}

export interface UpdateImageReq {
  /** Description of the image */
  caption: string;
}

export interface ListImageData {
  /** List of image information */
  photo_infos: ImageInfo[];

  /** Total number of images */
  total_count: number;
}

export interface ImageInfo {
  /** Image URL */
  url: string;

  /** Image name */
  name: string;

  /** Image size in bytes */
  size: number;

  /** File format/extension (e.g., jpg, png) */
  type: string;

  /**
   * File processing status
   * 0: Processing
   * 1: Processed
   * 9: Processing failed, recommend re-upload
   */
  status: number;

  /** Image description */
  caption: string;

  /** Creator's Coze ID */
  creator_id: string;

  /** Upload time as 10-digit Unix timestamp */
  create_time: number;

  /** Image ID */
  document_id: string;

  /**
   * Upload method
   * 0: Local file upload
   * 1: Online webpage upload
   * 5: file_id upload
   */
  source_type: number;

  /** Update time as 10-digit Unix timestamp */
  update_time: number;
}
