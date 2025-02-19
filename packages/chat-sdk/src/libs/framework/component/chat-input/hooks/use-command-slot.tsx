import { useChatPropsStore, useThemeType } from "@/libs/provider";
import { ClearContext } from "../clear-context";
import { DeleteMessage } from "../delete-message";
import { UiCommandPosition } from "@/libs/types";
import { logger } from "@/libs/utils";

export const useCommandSlot = (position: UiCommandPosition) => {
  const ui = useChatPropsStore((store) => store.ui);
  const clearContextConfig = Object.assign(
    { isNeed: true, position: "inputLeft", SlotComponent: ClearContext },
    ui?.chatSlot?.clearContext || {}
  );
  const uiTheme = useThemeType();
  const clearMessageConfig = Object.assign(
    { isNeed: true, position: "headerRight", SlotComponent: DeleteMessage },
    ui?.chatSlot?.clearMessage || {}
  );
  logger.debug("useCommandSlot", {
    clearContextConfig,
    clearMessageConfig,
    position,
    ui,
  });
  return [clearContextConfig, clearMessageConfig]
    .filter((item) => {
      return item.isNeed && item.position === position;
    })
    .map(({ position, SlotComponent }) =>
      position === "headerRight" ? (
        <SlotComponent
          type="square-hover-btn"
          svgTheme={uiTheme === "bg-theme" ? "light" : "dark"}
        />
      ) : (
        <SlotComponent svgTheme={"dark"} />
      )
    );
};
