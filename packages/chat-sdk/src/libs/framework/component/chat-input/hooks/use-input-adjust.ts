import { getBoundingRect, getViewportBoundingRect, logger } from "@/libs/utils";
import { useChatPropsStore } from "@/libs/provider";
import { useCallback, useState } from "react";

/*
 * When the custom navigation bar is selected for the mini-program,
 * it is necessary to position the location of the <input> element.
 */
export const useInputAdjust = (inputId: string) => {
  const [bottomOffset, setBottomOffset] = useState(0);
  const isMiniCustomHeader = useChatPropsStore(
    (store) => store.ui?.isMiniCustomHeader
  );
  const inputAdjustDefault = isMiniCustomHeader !== true;
  const changeInputLocation = useCallback(
    async (height: number) => {
      if (inputAdjustDefault) {
        return;
      }
      if (height === 0) {
        setBottomOffset(0);
        return;
      }
      const [viewportRect] = await getViewportBoundingRect();
      const [inputRect] = await getBoundingRect(`#${inputId}`);
      const bottomNow = viewportRect.height - inputRect.bottom;

      if (height > bottomNow) {
        setBottomOffset(height - bottomNow);
      }
    },
    [inputId]
  );
  logger.info("Chat Input's inputAdjust value:", {
    inputAdjustDefault,
    isMiniCustomHeader: isMiniCustomHeader,
  });
  return { changeInputLocation, bottomOffset, inputAdjustDefault };
};
