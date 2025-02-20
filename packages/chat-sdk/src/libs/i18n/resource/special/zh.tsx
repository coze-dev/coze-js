import { I18nSpecial } from '../type';
const resource: I18nSpecial = {
  chatInitRetry: options => <>启动遇到问题，{options?.retry}</>,
  messageListRetry: options => <>获取历史数据失败，{options?.retry}</>,
  copyLinkSuccess: options => `复制链接: ${options?.url}`,
  audioInputTooltipTick: options => (
    <>{options?.duration} 后自动结束录制并发送</>
  ),
};
export default resource;
