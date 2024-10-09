import { type ContentType, type ChatV3Message, type MetaDataType, type RoleType, type ObjectStringItem } from '../../index.js';
import { APIResource } from '../../resource.js';

export class Messages extends APIResource {
  async create(conversation_id: string, params: CreateMessageReq) {
    // TODO 按照restful规范，conversion_id 应该放在path中，而不是query中
    const apiUrl = `/v1/conversation/message/create?conversation_id=${conversation_id}`;
    const response = await this._client.post<CreateMessageReq, { data: ChatV3Message }>(apiUrl, params);
    return response.data;
  }

  async update(conversation_id: string, message_id: string, params: UpdateMessageReq) {
    // TODO 这个接口好奇怪，response 是 message 而不是 data
    const apiUrl = `/v1/conversation/message/modify?conversation_id=${conversation_id}&message_id=${message_id}`;
    const response = await this._client.post<UpdateMessageReq, { message: ChatV3Message }>(apiUrl, params);
    return response.message;
  }

  async retrieve(conversation_id: string, message_id: string) {
    const apiUrl = `/v1/conversation/message/retrieve?conversation_id=${conversation_id}&message_id=${message_id}`;
    const response = await this._client.get<null, { data: ChatV3Message }>(apiUrl);
    return response.data;
  }

  async list(conversation_id: string, params: ListMessageReq) {
    const apiUrl = `/v1/conversation/message/list?conversation_id=${conversation_id}`;
    const response = await this._client.get<ListMessageReq, { data: ListMessageData }>(apiUrl, params);
    return response.data;
  }

  async delete(conversation_id: string, message_id: string) {
    const apiUrl = `/v1/conversation/message/delete?conversation_id=${conversation_id}&message_id=${message_id}`;
    const response = await this._client.post<unknown, { data: ChatV3Message[] }>(apiUrl);
    return response.data;
  }
}

export interface CreateMessageReq {
  role: RoleType;
  content: string | ObjectStringItem[];
  content_type: ContentType;
  meta_data: MetaDataType;
}

export interface UpdateMessageReq {
  meta_data?: MetaDataType;
  content?: string | ObjectStringItem[];
  content_type?: ContentType;
}

export interface ListMessageReq {
  order?: 'desc' | 'asc';
  chat_id?: string;
  before_id?: string;
  after_id?: string;
  limit?: number;
}

export interface ListMessageData {
  data: ChatV3Message[];
  first_id: string;
  last_id: string;
  has_more: boolean;
}
