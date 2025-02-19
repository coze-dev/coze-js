import { type ImageProps } from "@tarojs/components";

interface SvgPropsCustom {
  className?: string;
  theme?: "light" | "dark" | "gray-bold";
}
export type SvgProps = SvgPropsCustom & Omit<ImageProps, "ref">;
export interface SvgStyles {
  fill: string;
  fillOpacity: string;
}
