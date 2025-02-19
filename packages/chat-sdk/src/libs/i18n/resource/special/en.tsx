import { I18nSpecial } from "../type";
const resource: I18nSpecial = {
  chatInitRetry: (options) => <>Start error,{options?.retry}</>,
  messageListRetry: (options) => (
    <>Get message history error,{options?.retry}</>
  ),
  copyLinkSuccess: (options) => `Copy link: ${options?.url}`,
  audioInputTooltipTick: (options) => (
    <>{options?.duration} automatically end recording after and sending</>
  ),
};
export default resource;
