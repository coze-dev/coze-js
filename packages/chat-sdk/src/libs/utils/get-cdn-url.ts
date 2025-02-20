export const getCdnUrl = (baseUrl?: string, urlPath?: string) => {
  let url = '';
  const baseUrlNow =
    baseUrl ||
    'https://lf3-static.bytednsdoc.com/obj/eden-cn/rkzild_lgvj/ljhwZthlaukjlkulzlp/';
  try {
    return `${baseUrlNow?.replace(/\/+$/, '') || ''}/${urlPath?.replace(
      /^\.?\/+/,
      '',
    )}`;
  } catch (err) {
    console.error('Invalid URL:', err, baseUrl, urlPath);
  }
  if (!url) {
    url = '';
  }
  return url;
};
