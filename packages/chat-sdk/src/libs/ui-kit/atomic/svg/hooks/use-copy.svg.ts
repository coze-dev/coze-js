import { useMemo } from "react";
import { type SvgProps, type SvgStyles } from "../type";
import { getSvgBase64 } from "@/libs/utils";

const svgStyleMap: Record<string, SvgStyles> = {
  dark: {
    fill: "#202945",
    fillOpacity: "0.62",
  },
  light: {
    fill: "#FFF",
    fillOpacity: "1.0",
  },
  "gray-bold": {
    fill: "#1C1D23",
    fillOpacity: "1",
  },
};
const getSvgRaw = (color: SvgStyles) => {
  return `<svg class="icon-icon icon-icon-coz_copy !coz-fg-images-white w-[14px] h-[14px]" width="1em" height="1em" viewBox="0 0 24 24" fill="${color.fill}" fill-opacity="${color.fillOpacity}" xmlns="http://www.w3.org/2000/svg"><path d="M9 3C9 2.44772 9.44772 2 10 2H20C20.5523 2 21 2.44772 21 3V15C21 15.5523 20.5523 16 20 16C19.4477 16 19 15.5523 19 15V4H10C9.44771 4 9 3.55228 9 3Z"></path><path d="M5 6C3.89543 6 3 6.89543 3 8V20C3 21.1046 3.89543 22 5 22H15C16.1046 22 17 21.1046 17 20V8C17 6.89543 16.1046 6 15 6H5ZM5 8H15V20H5L5 8Z"></path></svg>`;
};

export const useCopySvg = (props: SvgProps) => {
  const color = (props.theme && svgStyleMap[props.theme]) || svgStyleMap.dark;

  const svgData = useMemo(() => {
    return getSvgBase64(getSvgRaw(color));
  }, [color]);
  return svgData;
};
