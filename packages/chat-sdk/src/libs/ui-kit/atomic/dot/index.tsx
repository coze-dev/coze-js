import { FC } from "react";
import { CenterAlignedBox } from "../center-aligned-box";
import { View } from "@tarojs/components";

export const Dot: FC<{
  boxWidth?: number; // box width
  boxHeight?: number; // box height
  circleDiameter?: number; // circle diameter
  circleColor?: string;
  className?: string;
}> = ({
  circleDiameter = 4,
  circleColor = "currentColor",
  boxHeight = 16,
  boxWidth = 26,
  className,
}) => {
  return (
    <CenterAlignedBox width={boxWidth} height={boxHeight} className={className}>
      <View
        style={{
          width: circleDiameter,
          height: circleDiameter,
          backgroundColor: circleColor,
          borderRadius: circleDiameter,
        }}
      />
    </CenterAlignedBox>
  );
};
