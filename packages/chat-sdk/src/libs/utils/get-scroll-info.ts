import { createSelectorQuery } from "@tarojs/taro";

export const getScrollInfo = (
  selectorName: string
): Promise<Taro.NodesRef.ScrollOffsetCallbackResult> =>
  new Promise((resolve) => {
    const selector = createSelectorQuery();
    selector
      .select(selectorName)
      .scrollOffset((res) => {
        resolve(res);
      })
      .exec();
  });
