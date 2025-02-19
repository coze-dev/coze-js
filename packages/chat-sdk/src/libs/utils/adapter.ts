import { request } from "@tarojs/taro";
import { isFunction } from "@tarojs/shared";
import { AxiosAdapter } from "axios";
import { logger } from "./logger";

export const taroAdapter: AxiosAdapter = (config) => {
  const { url, method, data, headers } = config;
  const header = isFunction(headers.toJSON) ? headers.toJSON() : headers;
  header["Content-Type"] = header["Content-Type"] || "application/json";
  logger.debug("taroAdapter:", config);
  const responseType: "text" | "arraybuffer" =
    config.responseType === "arraybuffer" ? "arraybuffer" : "text";
  return new Promise((resolve, reject) => {
    request({
      url: url as string,
      method: (method ?? "GET").toUpperCase() as any,
      data,
      header,
      responseType: responseType,
      timeout: 60 * 10 * 1000,
      success: (res) => {
        resolve({
          data: res.data,
          status: res.statusCode,
          statusText: res.errMsg,
          headers: res.header,
          config,
        });
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};
