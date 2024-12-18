import { type CozeAPI } from '../api';
import {
  getWorkflowStreamMixin,
  getChatStreamMixin,
  getWorkflowChatStreamMixin,
} from './mixins';

export function platformMixins(api: CozeAPI) {
  api.workflows.runs.stream = getWorkflowStreamMixin(api);
  api.chat.stream = getChatStreamMixin(api);
  api.workflows.chat.stream = getWorkflowChatStreamMixin(api);
}
