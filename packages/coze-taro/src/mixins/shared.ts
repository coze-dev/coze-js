import { type CozeAPI } from '../api';
import { getUploadFileMixin } from './mixins';

export function sharedMixins(api: CozeAPI) {
  api.files.upload = getUploadFileMixin(api);
}
