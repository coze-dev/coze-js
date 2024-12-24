import { APIResource } from '../resource.js';
import { type RequestOptions } from '../../core.js';

export class Templates extends APIResource {
  /**
   * Duplicate a template. | 复制一个模板。
   * @param templateId - Required. The ID of the template to duplicate. | 要复制的模板的 ID。
   * @param params - Optional. The parameters for the duplicate operation. | 可选参数，用于复制操作。
   * @param params.workspace_id - Required. The ID of the workspace to duplicate the template into. | 要复制到的目标工作空间的 ID。
   * @param params.name - Optional. The name of the new template. | 新模板的名称。
   * @returns TemplateDuplicateRes | 复制模板结果
   */
  async duplicate(
    templateId: string,
    params: TemplateDuplicateReq,
    options?: RequestOptions,
  ): Promise<TemplateDuplicateData> {
    const apiUrl = `/v1/templates/${templateId}/duplicate`;
    const response = await this._client.post<
      TemplateDuplicateReq,
      { data: TemplateDuplicateData }
    >(apiUrl, params, false, options);
    return response.data;
  }
}

export interface TemplateDuplicateReq {
  workspace_id: string;
  name?: string;
}

export enum TemplateEntityType {
  AGENT = 'agent',
}

export interface TemplateDuplicateData {
  entity_id: string;
  entity_type: TemplateEntityType;
}
