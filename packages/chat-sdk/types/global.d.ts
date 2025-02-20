/// <reference types="@tarojs/taro" />
declare module "*.png";
declare module "*.gif";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.css";
declare module "*.less";
declare module "*.scss";
declare module "*.sass";
declare module "*.styl";

declare namespace NodeJS {
  interface ProcessEnv {
    /** NODE 内置环境变量, 会影响到最终构建生成产物 */
    NODE_ENV: "development" | "production";
    /** 当前构建的平台 */
    TARO_ENV:
      | "weapp"
      | "swan"
      | "alipay"
      | "h5"
      | "rn"
      | "tt"
      | "quickapp"
      | "qq"
      | "jd";
    /**
     * 当前构建的小程序 appid
     * @description 若不同环境有不同的小程序，可通过在 env 文件中配置环境变量`TARO_APP_ID`来方便快速切换 appid， 而不必手动去修改 dist/project.config.json 文件
     * @see https://taro-docs.jd.com/docs/next/env-mode-config#特殊环境变量-taro_app_id
     */
    TARO_APP_ID: string;
  }
}

interface TTEventSourceRaw {
  onOpen: (callback: () => void) => void;
  onClose: (callback: (res: { code: number; reason: string }) => void) => void;
  onError: (callback: (errMsg: string) => void) => void;
  onMessage: (callback: (data: unknown, event: string) => void) => void;
  close: () => void;
}
declare var tt: {
  createEventSource: (options: {
    url: string;
    method?: "POST" | "GET";
    header?: Record<string, unknown>;
    timeout?: number;
    data?: string | Record<string, unknown> | Array<unknown>;
  }) => TTEventSourceRaw;
};
