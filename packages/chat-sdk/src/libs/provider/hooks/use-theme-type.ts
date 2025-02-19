import { ThemeType } from "@/exports";
import { useInitBgInfo } from "./use-init-bg-info";

export const useThemeType = (): ThemeType => {
  const bgInfo = useInitBgInfo();
  const theme = bgInfo?.pc && bgInfo?.mobile ? "bg-theme" : "light";
  return theme;
};
