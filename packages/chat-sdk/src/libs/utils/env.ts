export enum Region {
  OVERSEA = "oversea",
  CN = "cn",
}

export const getRegionApi = (region?: Region) => {
  switch (region) {
    case "oversea":
      return "https://api.coze.com";
    default: {
      return "https://api.coze.cn";
    }
  }
};
