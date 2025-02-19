import { BgImageInfo } from "@/libs/types";

type DeviceMode = "mobile" | "pc";
export const cropperSizeMap = {
  pc: {
    width: 486,
    height: 346,
  },
  mobile: {
    width: 248,
    height: 346,
  },
};

function hexToRgb(hex: string) {
  // 如果是三位十六进制，将其扩展为六位
  if (hex.length === 4) {
    hex = hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  hex = hex.slice(1); // 去掉'#'
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4), 16);
  return `rgb(${r},${g},${b})`;
}
// 输入透明度系数 和color 返回新的颜色
export function addAlpha(color: string, alpha: number): string {
  if (/^((#[0-9A-Fa-f]{3})|(#[0-9A-Fa-f]{6}))$/.test(color)) {
    color = hexToRgb(color);
  }
  const regex = /^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/;
  if (!regex.test(color)) {
    return color;
  }

  const values: string[] = color.slice(5, -1).split(",");
  values.push(alpha.toString());

  const newColor = `rgba(${values.join(",")})`;

  return newColor;
}

export const getGradient = (
  gradient: BgImageInfo["gradientPosition"],
  canvasData: BgImageInfo["canvasPosition"],
  cropperWidth = 0
) => {
  const { left: cropperImgLeft = 0, width: cropperImgWidth = 0 } = canvasData;
  if (cropperImgWidth && cropperWidth) {
    return {
      left: cropperImgLeft / cropperWidth,
      right: (cropperWidth - cropperImgWidth - cropperImgLeft) / cropperWidth,
    };
  } else {
    return gradient;
  }
};

export const getDeviceMode = (width: number, height: number): DeviceMode => {
  if (!width || !height) {
    return "pc";
  }
  return width / height <= getStandardRatio("mobile") ? "mobile" : "pc";
};
export const getStandardRatio = (mode: DeviceMode): number =>
  cropperSizeMap[mode].width / cropperSizeMap[mode].height;
