import Taro, { createSelectorQuery } from "@tarojs/taro";
import { isArray } from "@tarojs/shared";
export const getBoundingRect = (
  selectorName: string
): Promise<Taro.NodesRef.BoundingClientRectCallbackResult[]> =>
  new Promise((resolve) => {
    createSelectorQuery?.()
      ?.select(selectorName)
      ?.boundingClientRect((res) => {
        if (!res) {
          resolve([]);
          return [];
        }
        resolve(isArray(res) ? res : [res]);
      })
      .exec();
  });
