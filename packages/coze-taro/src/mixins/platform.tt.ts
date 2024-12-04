import { type CozeAPI } from '../api';
import { getWorkflowStreamMixin, getChatStreamMixin } from './mixins';

export function platformMixins(api: CozeAPI) {
  api.workflows.runs.stream = getWorkflowStreamMixin(api);
  api.chat.stream = getChatStreamMixin(api);
}
