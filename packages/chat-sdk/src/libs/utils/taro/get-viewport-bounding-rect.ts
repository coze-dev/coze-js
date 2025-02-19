import Taro from "@tarojs/taro";
import { isArray } from "@tarojs/shared";
import { createSelectorQuery } from "@tarojs/taro";

export const getViewportBoundingRect = (): Promise<
  Taro.NodesRef.BoundingClientRectCallbackResult[]
> =>
  new Promise((resolve) => {
    createSelectorQuery?.()
      ?.selectViewport()
      ?.boundingClientRect((res) => {
        if (!res) {
          return [];
        }
        resolve(isArray(res) ? res : [res]);
      })
      .exec();
  });
