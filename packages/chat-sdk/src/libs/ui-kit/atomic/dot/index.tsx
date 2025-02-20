import { FC } from 'react';

import { View } from '@tarojs/components';

import { CenterAlignedBox } from '../center-aligned-box';

export const Dot: FC<{
  boxWidth?: number; // box width
  boxHeight?: number; // box height
  circleDiameter?: number; // circle diameter
  circleColor?: string;
  className?: string;
}> = ({
  circleDiameter = 4,
  circleColor = 'currentColor',
  boxHeight = 16,
  boxWidth = 26,
  className,
}) => (
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
